import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler


def preprocess_data(
    df: pd.DataFrame,
    window_size: int = 60,
    split_ratio: float = 0.8
):
    """
    Prepare data for LSTM:
    1. Flatten MultiIndex columns (using first-level labels).
    2. Extract closing prices and normalize.
    3. Create sliding windows of length `window_size`.
    4. Split into training and test sets.

    Returns:
        X_train, y_train, X_test, y_test, scaler
    """
    # Flatten column names if DataFrame has MultiIndex
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    # Ensure 'Close' is present
    if 'Close' not in df.columns:
        raise KeyError("Expected 'Close' column in DataFrame")

    # Extract close prices and normalize
    close_prices = df['Close'].values.reshape(-1, 1)
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(close_prices)

    # Build sliding windows
    X, y = [], []
    for i in range(window_size, len(scaled)):
        X.append(scaled[i-window_size:i, 0])
        y.append(scaled[i, 0])

    X = np.array(X).reshape(-1, window_size, 1)
    y = np.array(y)

    # Split into train and test sets
    split_idx = int(len(X) * split_ratio)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    return X_train, y_train, X_test, y_test, scaler


if __name__ == "__main__":
    from data_loader import fetch_stock_data

    # Smoke test
    df = fetch_stock_data("AAPL", "2015-01-01", "2025-01-01")
    X_train, y_train, X_test, y_test, _ = preprocess_data(df, window_size=60)
    print("Shapes:", X_train.shape, y_train.shape, X_test.shape, y_test.shape)
