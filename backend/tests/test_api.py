import json
import pytest
from app import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as c:
        yield c


def test_health(client):
    rv = client.get('/health')
    assert rv.status_code == 200
    data = rv.get_json()
    assert data.get("status") == "ok"


def test_ping(client):
    rv = client.get('/api/ping')
    assert rv.status_code == 200
    assert rv.get_json() == {"message": "pong"}


@pytest.mark.parametrize("symbol", ["AAPL", "MSFT", "GOOGL"])
def test_predict_endpoint(client, symbol):
    payload = {"ticker": symbol, "window": 60}
    rv = client.post(
        "/api/predict",
        data=json.dumps(payload),
        content_type="application/json"
    )

    # Check if the ticker is available
    if rv.status_code == 404:
        data = rv.get_json()
        assert "error" in data
        assert "not found" in data["error"].lower()
        return

    assert rv.status_code == 200
    js = rv.get_json()
    assert js.get("ticker") == symbol
    assert isinstance(js.get("history"), list)
    assert isinstance(js.get("prediction"), (int, float))


def test_predict_invalid_ticker(client):
    payload = {"ticker": "INVALID", "window": 60}
    rv = client.post(
        "/api/predict",
        data=json.dumps(payload),
        content_type="application/json"
    )
    assert rv.status_code == 404
    data = rv.get_json()
    assert "error" in data


def test_predict_missing_ticker(client):
    payload = {"window": 60}
    rv = client.post(
        "/api/predict",
        data=json.dumps(payload),
        content_type="application/json"
    )
    assert rv.status_code == 200  # Uses default ticker 'AAPL'
    js = rv.get_json()
    assert js.get("ticker") == "AAPL"


def test_predict_invalid_json(client):
    rv = client.post(
        "/api/predict",
        data="invalid json",
        content_type="application/json"
    )
    assert rv.status_code == 400


def test_quotes_endpoint(client):
    payload = {"tickers": ["AAPL", "MSFT"]}
    rv = client.post(
        "/api/quotes",
        data=json.dumps(payload),
        content_type="application/json"
    )
    assert rv.status_code == 200
    data = rv.get_json()
    assert isinstance(data, list)
    assert len(data) > 0
