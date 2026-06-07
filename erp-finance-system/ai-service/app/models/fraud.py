from __future__ import annotations

from pydantic import BaseModel, Field
from typing import List, Optional


class TransactionItem(BaseModel):
    id: str = Field(..., description="Transaction identifier")
    amount: float = Field(..., description="Transaction amount")
    vendor: Optional[str] = Field(None, description="Transaction vendor or merchant")
    category: Optional[str] = Field(None, description="Transaction category")


class FraudDetectionRequest(BaseModel):
    transactions: List[TransactionItem]


class FraudAlert(BaseModel):
    transaction_id: str
    amount: float
    score: float
    reason: str


class FraudDetectionResponse(BaseModel):
    flagged: List[FraudAlert]
    summary: str
