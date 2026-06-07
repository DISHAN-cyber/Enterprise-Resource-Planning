import os
import json
from typing import Optional, Dict, Any

import joblib

# Store versioned models under ai-service/stored_models
MODEL_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', '..', 'stored_models'))
INDEX_PATH = os.path.join(MODEL_DIR, 'index.json')


def ensure_model_dir() -> None:
    os.makedirs(MODEL_DIR, exist_ok=True)


def _read_index() -> Dict[str, Any]:
    ensure_model_dir()
    if not os.path.exists(INDEX_PATH):
        return {'models': []}
    try:
        with open(INDEX_PATH, 'r') as f:
            return json.load(f)
    except Exception:
        return {'models': []}


def _write_index(data: Dict[str, Any]) -> None:
    with open(INDEX_PATH, 'w') as f:
        json.dump(data, f, indent=2)


def save_model(model, version: Optional[str] = None) -> str:
    """Save model with a version string. Returns the filename saved.

    If `version` is None a timestamp-based version will be generated.
    """
    ensure_model_dir()
    if version is None:
        import datetime

        version = datetime.datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')

    filename = f'isolation_forest_{version}.joblib'
    path = os.path.join(MODEL_DIR, filename)
    joblib.dump(model, path)

    index = _read_index()
    index['models'].append({'version': version, 'file': filename, 'timestamp': version})
    # keep only last 10 entries for hygiene
    index['models'] = index['models'][-10:]
    _write_index(index)
    return filename


def load_latest_model() -> Optional[object]:
    """Load the most recent model based on the index file."""
    index = _read_index()
    models = index.get('models', [])
    if not models:
        return None
    latest = models[-1]
    path = os.path.join(MODEL_DIR, latest['file'])
    if os.path.exists(path):
        return joblib.load(path)
    return None


def list_saved_models() -> Dict[str, Any]:
    return _read_index()
