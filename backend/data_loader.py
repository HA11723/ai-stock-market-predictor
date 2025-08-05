import yfinance as yf
import pandas as pd


def fetch_stock_data(ticker: str, start_date: str, end_date: str) -> pd.DataFrame:
    """
    Fetch daily OHLCV data for `ticker` between start_date and end_date from Yahoo Finance.
    Dates should be in 'YYYY-MM-DD' format.
    Returns a DataFrame with columns: ['Open', 'High', 'Low', 'Close', 'Volume'].
    """
    # Download data
    df = yf.download(ticker, start=start_date, end=end_date)

    # Keep only the columns we need
    df = df[['Open', 'High', 'Low', 'Close', 'Volume']]

    return df


if __name__ == "__main__":
    # Quick local test:
    data = fetch_stock_data("AAPL", "2010-01-01", "2025-01-01")
    print(data.head())
