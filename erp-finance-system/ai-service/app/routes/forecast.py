from fastapi import APIRouter

from app.models.forecast import CashflowRequest, CashflowResponse
from app.services.forecast_service import generate_cashflow_forecast

router = APIRouter(prefix="/forecast", tags=["forecast"])

@router.post("/cashflow", response_model=CashflowResponse)
async def cashflow_forecast(payload: CashflowRequest) -> CashflowResponse:
    """Generate a simple cashflow forecast based on the request values."""
    return generate_cashflow_forecast(payload)
