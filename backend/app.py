import os
from datetime import datetime, timedelta
import time
import json
import hashlib

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from tensorflow.keras.models import load_model
import pandas as pd
import yfinance as yf
import redis

from data_loader import fetch_stock_data

app = Flask(__name__)
CORS(app)

# Redis connection
try:
    redis_client = redis.Redis.from_url(
        os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
        decode_responses=True
    )
    redis_client.ping()  # Test connection
    print("✅ Redis connected successfully")
except Exception as e:
    print(f"❌ Redis connection failed: {e}")
    redis_client = None

# Simple cache for quotes to avoid hitting API too frequently
quotes_cache = {}
CACHE_DURATION = 30  # 30 seconds cache
PREDICTION_CACHE_DURATION = 300  # 5 minutes for predictions

# Cache helper functions


def generate_cache_key(ticker, window_size, end_date_str):
    """Generate a unique cache key for prediction requests"""
    key_data = f"{ticker}:{window_size}:{end_date_str}"
    return f"prediction:{hashlib.md5(key_data.encode()).hexdigest()}"


def get_cached_prediction(cache_key):
    """Get prediction from Redis cache"""
    if not redis_client:
        return None
    try:
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
    except Exception as e:
        print(f"Redis get error: {e}")
    return None


def cache_prediction(cache_key, prediction_data):
    """Cache prediction in Redis"""
    if not redis_client:
        return
    try:
        redis_client.setex(
            cache_key,
            PREDICTION_CACHE_DURATION,
            json.dumps(prediction_data, default=str)
        )
    except Exception as e:
        print(f"Redis set error: {e}")

# Health-check


@app.route('/health')
def health():
    return jsonify(status='ok')

# Ping for quick liveness


@app.route('/api/ping')
def ping():
    return jsonify(message='pong')

# Predict endpoint: dynamically load model + scaler per ticker


@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Expects JSON: { "ticker": "AAPL", "window": 60, "end_date": "YYYY-MM-DD" }
    Returns JSON: { "ticker":"AAPL", "history":[{date,close},...], "prediction":123.45 }
    """
    start_time = time.time()

    data = request.get_json() or {}
    ticker = data.get('ticker', 'AAPL').upper()
    window_size = int(data.get('window', 60))
    end_date_str = data.get('end_date')

    # Determine date range
    if end_date_str:
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    else:
        end_date = datetime.now()
        end_date_str = end_date.strftime('%Y-%m-%d')
    start_date = end_date - timedelta(days=window_size * 3)

    # Check Redis cache first
    cache_key = generate_cache_key(ticker, window_size, end_date_str)
    cached_result = get_cached_prediction(cache_key)

    if cached_result:
        print(f"✅ Cache hit for {ticker} - {time.time() - start_time:.3f}s")
        return jsonify(cached_result)

    # Paths for this ticker - prefer .keras format for better performance
    keras_model_path = os.path.join('model_artifacts', f"{ticker}_best.keras")
    h5_model_path = os.path.join('model_artifacts', f"{ticker}_best.h5")
    scaler_path = os.path.join('model_artifacts', f"{ticker}_scaler.pkl")

    # Use .keras format if available (faster loading), otherwise fallback to .h5
    if os.path.exists(keras_model_path):
        model_path = keras_model_path
        print(f"📈 Using optimized .keras model for {ticker}")
    elif os.path.exists(h5_model_path):
        model_path = h5_model_path
        print(f"⚠️  Using legacy .h5 model for {ticker} (consider optimizing)")
    else:
        return jsonify(error='Model not found for ticker'), 404

    if not os.path.exists(scaler_path):
        return jsonify(error='Scaler not found for ticker'), 404

    # Load model & scaler on the fly
    model_load_start = time.time()
    model = load_model(model_path, compile=False)
    model_load_time = time.time() - model_load_start
    print(f"⚡ Model loaded in {model_load_time:.3f}s")
    scaler = joblib.load(scaler_path)

    # Fetch & preprocess
    df = fetch_stock_data(
        ticker,
        start_date.strftime('%Y-%m-%d'),
        end_date.strftime('%Y-%m-%d')
    )
    # Flatten MultiIndex if present
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    if 'Close' not in df.columns or len(df) < window_size:
        return jsonify(error='Not enough data for ticker'), 400

    close_prices = df['Close'].values.reshape(-1, 1)
    scaled = scaler.transform(close_prices)
    window_arr = scaled[-window_size:].reshape(1, window_size, 1)

    # Predict & inverse‐scale
    pred_scaled = model.predict(window_arr)
    prediction = float(scaler.inverse_transform(pred_scaled)[0, 0])

    # Build history payload
    hist_df = df[['Close']].tail(window_size)
    history = [
        {"date": idx.strftime('%Y-%m-%d'), "close": float(val)}
        for idx, val in zip(hist_df.index, hist_df['Close'])
    ]

    # Prepare result for caching and response
    result = {
        "ticker": ticker,
        "history": history,
        "prediction": prediction
    }

    # Cache the result
    cache_prediction(cache_key, result)

    print(
        f"🔥 Cache miss for {ticker} - computed in {time.time() - start_time:.3f}s")
    return jsonify(result)


# Live quotes board
@app.route('/api/quotes', methods=['POST'])
def quotes():
    """
    Expects JSON: { "tickers": ["AAPL","MSFT",...] }
    Returns JSON: [
      { "ticker":"AAPL","price":202.38,"change":-5.19,"percent":-2.50 },
      ...
    ]
    """
    data = request.get_json() or {}
    tickers = data.get('tickers', [])
    results = []

    # Check cache first
    cache_key = ','.join(sorted(tickers))
    current_time = time.time()

    if cache_key in quotes_cache:
        cached_data, timestamp = quotes_cache[cache_key]
        if current_time - timestamp < CACHE_DURATION:
            return jsonify(cached_data)

    # Download all tickers at once for better performance
    try:
        # Join tickers with space for yfinance batch download
        tickers_str = ' '.join(tickers)
        hist = yf.download(
            tickers_str, period='2d', interval='1d',
            auto_adjust=True, progress=False,
            group_by='ticker', threads=True
        )

        for t in tickers:
            try:
                # Handle single ticker vs multiple tickers response format
                if len(tickers) == 1:
                    ticker_data = hist
                else:
                    ticker_data = hist[t] if t in hist.columns.get_level_values(
                        0) else None

                if ticker_data is None or ticker_data.empty:
                    print(f"No data for {t}")
                    continue

                # Get Close column
                if 'Close' not in ticker_data.columns:
                    print(f"No Close data for {t}")
                    continue

                closes = ticker_data['Close'].dropna().values
                if len(closes) < 1:
                    print(f"Insufficient data for {t}")
                    continue

                current = float(closes[-1])

                # Calculate change if we have at least 2 days of data
                if len(closes) >= 2:
                    prev = float(closes[-2])
                    change = current - prev
                    percent = (change / prev * 100) if prev != 0 else 0
                else:
                    change = 0.0
                    percent = 0.0

                results.append({
                    "ticker": t,
                    "price": round(current, 2),
                    "change": round(change, 2),
                    "percent": round(percent, 2)
                })
            except Exception as e:
                print(f"Error processing {t}: {e}")
                continue

    except Exception as e:
        print(f"Error downloading data: {e}")
        # Fallback to individual downloads if batch fails
        for t in tickers:
            try:
                hist = yf.download(
                    t, period='2d', interval='1d',
                    auto_adjust=True, progress=False
                )

                if hasattr(hist.columns, 'nlevels') and hist.columns.nlevels > 1:
                    hist.columns = hist.columns.get_level_values(0)

                if 'Close' not in hist.columns or hist.empty:
                    continue

                closes = hist['Close'].values
                if len(closes) < 1:
                    continue

                current = float(closes[-1])

                if len(closes) >= 2:
                    prev = float(closes[-2])
                    change = current - prev
                    percent = (change / prev * 100) if prev != 0 else 0
                else:
                    change = 0.0
                    percent = 0.0

                results.append({
                    "ticker": t,
                    "price": round(current, 2),
                    "change": round(change, 2),
                    "percent": round(percent, 2)
                })
            except Exception:
                continue

    # Cache the results
    quotes_cache[cache_key] = (results, current_time)

    return jsonify(results)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
