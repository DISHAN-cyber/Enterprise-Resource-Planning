from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_fraud_detection_basic():
    payload = {
        "transactions": [
            {"id": "t1", "amount": 10.0},
            {"id": "t2", "amount": 12.0},
            {"id": "t3", "amount": 10000.0}
        ]
    }
    resp = client.post("/fraud/detect", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert 'flagged' in data
    assert isinstance(data['flagged'], list)
    assert 'summary' in data
