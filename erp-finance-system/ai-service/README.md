# ERP AI Service

This service exposes AI-backed endpoints for cashflow forecasting and fraud detection.

## Run locally

1. Create a virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Start the server:
   ```powershell
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

## Endpoints

- `GET /` — health check
- `GET /health` — service status
- `POST /forecast/cashflow` — cashflow forecast
- `POST /fraud/detect` — fraud/anomaly detection

Additional endpoints:
- `GET /metrics` — Prometheus metrics for monitoring

Retraining the fraud model
-------------------------
You can retrain the IsolationForest fraud model from a CSV of historical transactions:

CSV must include a header column named `amount`.

Run:
```powershell
python -m app.scripts.retrain_model path\to\transactions.csv
```

Testing and CI
--------------
Run tests locally:
```powershell
pip install -r requirements.txt
pytest -q
```

The repository includes a GitHub Actions workflow `.github/workflows/ci.yml` that runs tests and builds a Docker image.

Automated retraining
--------------------
There is a scheduled GitHub Actions workflow at `.github/workflows/retrain.yml` that runs daily (02:00 UTC) and will retrain the fraud model if training and validation CSV files are available.

What it does:
- Retrains an IsolationForest using the `amount` column in the CSV.
- Saves a versioned model into `ai-service/stored_models/` and updates `index.json`.
- Syncs model artifacts and data between local storage and cloud storage.
- Evaluates the newly trained model against the previous model and sends a Slack alert if degradation is detected.

Cloud storage options
---------------------
The workflow supports either AWS S3 or Azure Blob Storage:
- For AWS S3, set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `S3_BUCKET`.
- For Azure Blob Storage, set `AZURE_STORAGE_CONNECTION_STRING` and optionally `AZURE_STORAGE_CONTAINER`.

The sync process is implemented in `app/scripts/cloud_sync.py` and uses cloud storage configuration to download training data/model artifacts before retraining and upload them again afterward.

Required GitHub secrets for the workflow:
- `SLACK_WEBHOOK`

AWS S3 optional secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET`

Azure Blob optional secrets:
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_STORAGE_CONTAINER` (defaults to `erp-ai-storage` when unset)

To provide training and validation data for scheduled runs, place CSV files in the configured cloud storage container or bucket under `data/transactions.csv` and `data/validation.csv`.

Retrieving model artifacts
-------------------------
The scheduled workflow syncs versioned model files to the configured cloud storage location under `ai-service/stored_models/`. The local `ai-service/stored_models/index.json` file tracks the saved model versions.
