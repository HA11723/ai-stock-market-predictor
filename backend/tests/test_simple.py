import json
import pytest
from app import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as c:
        yield c


def test_health_endpoint(client):
    """Test that health endpoint returns 200"""
    rv = client.get('/health')
    assert rv.status_code == 200


def test_ping_endpoint(client):
    """Test that ping endpoint returns 200"""
    rv = client.get('/api/ping')
    assert rv.status_code == 200


def test_predict_endpoint_basic(client):
    """Test that predict endpoint responds (even if no models)"""
    payload = {"ticker": "AAPL", "window": 60}
    rv = client.post(
        "/api/predict",
        data=json.dumps(payload),
        content_type="application/json"
    )
    # Should either return 200 (success) or 404 (no model)
    assert rv.status_code in [200, 404]


def test_quotes_endpoint_basic(client):
    """Test that quotes endpoint responds"""
    payload = {"tickers": ["AAPL"]}
    rv = client.post(
        "/api/quotes",
        data=json.dumps(payload),
        content_type="application/json"
    )
    assert rv.status_code == 200


def test_invalid_json_handling(client):
    """Test that invalid JSON is handled gracefully"""
    rv = client.post(
        "/api/predict",
        data="invalid json",
        content_type="application/json"
    )
    assert rv.status_code == 400
