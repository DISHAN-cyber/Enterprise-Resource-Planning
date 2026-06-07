from fastapi import FastAPI, Request
import logging
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST, Counter
from fastapi.responses import Response

from app.routes.forecast import router as forecast_router
from app.routes.fraud import router as fraud_router

logging.basicConfig(level=logging.INFO)

REQUEST_COUNT = Counter('erp_ai_requests_total', 'Total API requests', ['path', 'method', 'status'])

app = FastAPI(title="ERP AI Service", version="1.0.0")
app.include_router(forecast_router)
app.include_router(fraud_router)


@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    response = await call_next(request)
    try:
        REQUEST_COUNT.labels(path=request.url.path, method=request.method, status=str(response.status_code)).inc()
    except Exception:
        pass
    logging.info(f"{request.method} {request.url.path} -> {response.status_code}")
    return response


@app.get("/")
async def root():
    return {"message": "ERP AI Service is running"}


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ERP AI Service"}


@app.get("/metrics")
async def metrics():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)
