from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_cashflow_forecast_basic():
    payload = {
        "months": 3,
        "current_balance": 1000.0,
        "monthly_revenue": 2000.0,
        "monthly_expense": 1500.0
    }
    resp = client.post("/forecast/cashflow", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert 'forecast' in data
    assert isinstance(data['forecast'], list)
    assert 'recommendation' in data
