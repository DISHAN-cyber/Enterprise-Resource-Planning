import os
import numpy as np
from sklearn.ensemble import IsolationForest

from app.models.fraud import FraudDetectionRequest, FraudDetectionResponse, FraudAlert
from app.services.model_store import load_latest_model, save_model


def detect_fraud(request: FraudDetectionRequest) -> FraudDetectionResponse:
    if len(request.transactions) < 3:
        return FraudDetectionResponse(
            flagged=[],
            summary="Too few transactions to perform meaningful fraud detection. Submit 3 or more transactions."
        )

    amounts = np.array([[transaction.amount] for transaction in request.transactions], dtype=float)

    # Try to reuse a persisted model to avoid retraining on every request.
    model = load_latest_model()
    if model is None:
        # Train a new model on the provided batch and persist it for future requests.
        model = IsolationForest(contamination='auto', random_state=42)
        try:
            model.fit(amounts)
            # Persist model for later reuse (best-effort; if saving fails we continue)
            try:
                save_model(model)
            except Exception:
                pass
        except Exception:
            # Fallback: if training fails, return no alerts but clear guidance
            return FraudDetectionResponse(
                flagged=[],
                summary="Fraud detection currently unavailable due to model training error. Try again later."
            )

    labels = model.predict(amounts)
    scores = model.decision_function(amounts)

    alerts = []
    for transaction, label, score in zip(request.transactions, labels, scores):
        if int(label) == -1:
            alerts.append(
                FraudAlert(
                    transaction_id=transaction.id,
                    amount=transaction.amount,
                    score=round(float(score), 4),
                    reason="Anomaly detected based on transaction amount compared to recent behavior."
                )
            )

    summary = (
        f"{len(alerts)} out of {len(request.transactions)} transactions were flagged as potential anomalies. "
        "Review flagged transactions for unusual vendors, amounts, or categories."
    )

    return FraudDetectionResponse(flagged=alerts, summary=summary)
