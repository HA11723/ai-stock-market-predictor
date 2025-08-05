# File: backend/tests/test_data_loader.py
import pytest
import pandas as pd
from datetime import datetime, timedelta
from data_loader import fetch_stock_data


def test_fetch_stock_data_returns_dataframe():
    # Use recent dates (last 10 days) for a known ticker
    end = datetime.now()
    start = end - timedelta(days=10)
    df = fetch_stock_data(
        "AAPL",
        start.strftime('%Y-%m-%d'),
        end.strftime('%Y-%m-%d')
    )
    # Should return a DataFrame
    assert isinstance(df, pd.DataFrame)
    # DataFrame should have Date index and required columns
    for col in ["Open", "High", "Low", "Close", "Volume"]:
        assert col in df.columns
    # Should contain at least one row
    assert not df.empty
