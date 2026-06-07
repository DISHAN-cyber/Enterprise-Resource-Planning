from fastapi import APIRouter

from app.models.fraud import FraudDetectionRequest, FraudDetectionResponse
from app.services.fraud_service import detect_fraud

router = APIRouter(prefix="/fraud", tags=["fraud"])

@router.post("/detect", response_model=FraudDetectionResponse)
async def fraud_detection(payload: FraudDetectionRequest) -> FraudDetectionResponse:
    """Detect anomalous transactions using a lightweight isolation forest model."""
    return detect_fraud(payload)
