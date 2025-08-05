import os
from datetime import datetime, timedelta

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from tensorflow.keras.models import load_model
import pandas as pd
import yfinance as yf

from data_loader import fetch_stock_data

app = Flask(__name__)
CORS(app)

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
    data = request.get_json() or {}
    ticker = data.get('ticker', 'AAPL').upper()
    window_size = int(data.get('window', 60))
    end_date_str = data.get('end_date')

    # Determine date range
    if end_date_str:
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    else:
        end_date = datetime.now()
    start_date = end_date - timedelta(days=window_size * 3)

    # Paths for this ticker
    model_path = os.path.join('model_artifacts', f"{ticker}_best.h5")
    scaler_path = os.path.join('model_artifacts', f"{ticker}_scaler.pkl")

    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        return jsonify(error='Model not found for ticker'), 404

    # Load model & scaler on the fly
    model = load_model(model_path, compile=False)
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

    return jsonify(ticker=ticker, history=history, prediction=prediction)


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

    for t in tickers:
        try:
            hist = yf.download(
                t, period='2d', interval='1d',
                auto_adjust=True, progress=False
            )
        except Exception:
            continue

        if hasattr(hist.columns, 'nlevels') and hist.columns.nlevels > 1:
            hist.columns = hist.columns.get_level_values(0)

        closes = hist['Close'].values
        if len(closes) < 2:
            continue

        current, prev = float(closes[-1]), float(closes[-2])
        change = current - prev
        percent = (change / prev * 100) if prev != 0 else 0

        results.append({
            "ticker": t,
            "price": round(current, 2),
            "change": round(change, 2),
            "percent": round(percent, 2)
        })

    return jsonify(results)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
