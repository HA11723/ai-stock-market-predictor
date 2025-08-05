import pytest
import pandas as pd
from data_loader import fetch_stock_data


def test_fetch_stock_data_structure():
    """Test that fetch_stock_data returns a DataFrame with expected columns."""
    df = fetch_stock_data("AAPL", "2023-01-01", "2023-12-31")

    assert isinstance(df, pd.DataFrame)
    assert not df.empty

    # Check expected columns
    expected_columns = ['Open', 'High', 'Low', 'Close', 'Volume']
    for col in expected_columns:
        assert col in df.columns

    # Check data types using the correct pandas syntax
    assert str(df['Close'].dtype) in ['float64', 'float32']
    assert str(df['Volume'].dtype) in ['int64', 'int32', 'float64']


def test_fetch_stock_data_date_range():
    """Test that fetch_stock_data respects date range."""
    start_date = "2023-01-01"
    end_date = "2023-01-31"
    df = fetch_stock_data("MSFT", start_date, end_date)

    assert isinstance(df, pd.DataFrame)
    if not df.empty:
        # Check that dates are within range
        assert df.index.min() >= pd.Timestamp(start_date)
        assert df.index.max() <= pd.Timestamp(end_date)


def test_fetch_stock_data_multiple_tickers():
    """Test that fetch_stock_data works for different tickers."""
    tickers = ["AAPL", "MSFT", "GOOGL"]

    for ticker in tickers:
        df = fetch_stock_data(ticker, "2023-01-01", "2023-01-31")
        assert isinstance(df, pd.DataFrame)
        # Some tickers might not have data for specific dates, which is okay


def test_fetch_stock_data_invalid_ticker():
    """Test that fetch_stock_data handles invalid tickers gracefully."""
    # This should not raise an exception, but might return empty DataFrame
    df = fetch_stock_data("INVALID_TICKER", "2023-01-01", "2023-01-31")
    assert isinstance(df, pd.DataFrame)


def test_fetch_stock_data_no_data():
    """Test that fetch_stock_data handles periods with no data."""
    # Try to fetch data for a very old date range that might not have data
    df = fetch_stock_data("AAPL", "1900-01-01", "1900-12-31")
    assert isinstance(df, pd.DataFrame)
