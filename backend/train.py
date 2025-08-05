import argparse
import os
import joblib
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error

from data_loader import fetch_stock_data
from model import preprocess_data


def build_model(window_size: int) -> Sequential:
    """
    Build and compile a simple 2-layer LSTM model.
    """
    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(window_size, 1)))
    model.add(LSTM(50))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mse')
    return model


def validate_ticker(ticker: str) -> str:
    """
    Validate and correct ticker symbols.
    """
    # Handle known ticker changes
    ticker_mapping = {
        'FB': 'META',  # Facebook renamed to Meta
        'GOOG': 'GOOGL',  # Google has both GOOG and GOOGL
    }

    return ticker_mapping.get(ticker.upper(), ticker.upper())


def train_single_model(ticker: str, start_date: str, end_date: str,
                       window_size: int, epochs: int, batch_size: int,
                       output_dir: str) -> dict:
    """
    Train a single model for a ticker and return results.
    """
    try:
        print(f"\n=== Training model for {ticker} ===")

        # Validate ticker
        validated_ticker = validate_ticker(ticker)
        if validated_ticker != ticker:
            print(f"⚠️  Ticker {ticker} mapped to {validated_ticker}")
            ticker = validated_ticker

        # Fetch data
        print(f"📊 Fetching data for {ticker}...")
        df = fetch_stock_data(ticker, start_date, end_date)

        # Check if we have enough data
        if len(df) < window_size + 100:  # Need at least window_size + some extra for training
            print(
                f"❌ Insufficient data for {ticker}. Only {len(df)} records found. Skipping...")
            return {'ticker': ticker, 'status': 'failed', 'reason': 'insufficient_data'}

        print(f"✅ Found {len(df)} records for {ticker}")

        # Preprocess data
        print(f"🔄 Preprocessing data...")
        X_train, y_train, X_test, y_test, scaler = preprocess_data(
            df, window_size=window_size)

        # Build and train model
        print(f"🏗️  Building model...")
        model = build_model(window_size)

        best_path = os.path.join(output_dir, f"{ticker}_best.h5")
        checkpoint = ModelCheckpoint(
            best_path, save_best_only=True, monitor='val_loss')
        early_stop = EarlyStopping(patience=5, restore_best_weights=True)

        print(f"🚀 Training {ticker} for {epochs} epochs...")
        history = model.fit(
            X_train, y_train,
            validation_data=(X_test, y_test),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=[checkpoint, early_stop],
            verbose=1
        )

        # Evaluate model
        y_pred = model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mae = mean_absolute_error(y_test, y_pred)

        # Convert to dollar amounts (assuming scaler was fit on close prices)
        rmse_dollars = rmse * \
            scaler.scale_[0] if hasattr(scaler, 'scale_') else rmse
        mae_dollars = mae * \
            scaler.scale_[0] if hasattr(scaler, 'scale_') else mae

        # Save final artifacts
        final_path = os.path.join(output_dir, f"{ticker}_final.h5")
        scaler_path = os.path.join(output_dir, f"{ticker}_scaler.pkl")
        model.save(final_path)
        joblib.dump(scaler, scaler_path)

        print(f"💾 Saved: {best_path}, {final_path}, {scaler_path}")
        print(
            f"📈 Performance - RMSE: ${rmse_dollars:.2f}, MAE: ${mae_dollars:.2f}")

        return {
            'ticker': ticker,
            'status': 'success',
            'rmse': rmse_dollars,
            'mae': mae_dollars,
            'records': len(df)
        }

    except Exception as e:
        print(f"❌ Error training {ticker}: {str(e)}")
        return {'ticker': ticker, 'status': 'failed', 'reason': str(e)}


def main():
    parser = argparse.ArgumentParser(
        description="Train LSTM models for stock prediction")
    parser.add_argument(
        '--tickers', nargs='+', required=True,
        help='List of stock tickers to train (e.g., AAPL MSFT GOOGL)'
    )
    parser.add_argument(
        '--start', type=str, default='2010-01-01',
        help='Start date YYYY-MM-DD'
    )
    parser.add_argument(
        '--end', type=str, default='2025-01-01',
        help='End date YYYY-MM-DD'
    )
    parser.add_argument(
        '--window', type=int, default=60,
        help='Window size for LSTM'
    )
    parser.add_argument(
        '--epochs', type=int, default=20,
        help='Number of training epochs'
    )
    parser.add_argument(
        '--batch_size', type=int, default=32,
        help='Training batch size'
    )
    parser.add_argument(
        '--output_dir', type=str, default='model_artifacts',
        help='Directory to save models and scalers'
    )
    args = parser.parse_args()

    # Ensure output directory exists
    os.makedirs(args.output_dir, exist_ok=True)

    # Track results
    results = []
    successful = []
    failed = []

    print(f"🎯 Starting batch training for {len(args.tickers)} tickers...")
    print(f"📅 Date range: {args.start} to {args.end}")
    print(
        f"⚙️  Parameters: window={args.window}, epochs={args.epochs}, batch_size={args.batch_size}")

    for ticker in args.tickers:
        result = train_single_model(
            ticker, args.start, args.end, args.window,
            args.epochs, args.batch_size, args.output_dir
        )
        results.append(result)

        if result['status'] == 'success':
            successful.append(result)
        else:
            failed.append(result)

    # Print summary
    print("\n" + "="*60)
    print("TRAINING SUMMARY")
    print("="*60)
    print(f"Total tickers: {len(args.tickers)}")
    print(f"Successful: {len(successful)}")
    print(f"Failed: {len(failed)}")

    if successful:
        print(f"\n✅ Successfully trained models:")
        for result in successful:
            print(
                f"   {result['ticker']}: RMSE=${result['rmse']:.2f}, MAE=${result['mae']:.2f}")

    if failed:
        print(f"\n❌ Failed tickers:")
        for result in failed:
            print(f"   {result['ticker']}: {result['reason']}")

    # Save training summary
    summary_path = os.path.join(args.output_dir, "training_summary.txt")
    with open(summary_path, 'w') as f:
        f.write("TRAINING SUMMARY\n")
        f.write("="*50 + "\n")
        f.write(f"Total tickers: {len(args.tickers)}\n")
        f.write(f"Successful: {len(successful)}\n")
        f.write(f"Failed: {len(failed)}\n\n")

        if successful:
            f.write("Successful models:\n")
            for result in successful:
                f.write(
                    f"  {result['ticker']}: RMSE=${result['rmse']:.2f}, MAE=${result['mae']:.2f}\n")

        if failed:
            f.write("\nFailed tickers:\n")
            for result in failed:
                f.write(f"  {result['ticker']}: {result['reason']}\n")

    print(f"\n📄 Training summary saved to: {summary_path}")
    print("Training completed!")


if __name__ == '__main__':
    main()
