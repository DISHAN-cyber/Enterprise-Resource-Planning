from __future__ import annotations

from pydantic import BaseModel, Field
from typing import List


class CashflowInput(BaseModel):
    month: int
    revenue: float
    expense: float
    balance: float


class CashflowProjection(BaseModel):
    month: int = Field(..., description="Forecast month index")
    projected_balance: float = Field(..., description="Projected account balance at the end of the month")
    revenue: float = Field(..., description="Revenue expected for the month")
    expense: float = Field(..., description="Expense expected for the month")


class CashflowRequest(BaseModel):
    months: int = Field(6, ge=1, description="Forecast horizon in months")
    current_balance: float = Field(..., description="Current cash balance")
    monthly_revenue: float = Field(..., ge=0, description="Average monthly revenue")
    monthly_expense: float = Field(..., ge=0, description="Average monthly expense")
    revenue_growth_rate: float = Field(0.0, description="Expected monthly revenue growth rate")
    expense_growth_rate: float = Field(0.0, description="Expected monthly expense growth rate")
    seasonality: List[float] = Field(default_factory=list, description="Optional month-by-month seasonality factors")


class CashflowResponse(BaseModel):
    forecast: List[CashflowProjection]
    recommendation: str
