"""Evaluate the newly trained model against the previous model.

Usage:
    python -m app.scripts.evaluate_model --data ai-service/data/validation.csv [--prev-file path] [--threshold 0.2]

Compares anomaly rates (fraction of -1 predictions) between new and previous models.
If the absolute difference exceeds `threshold`, exits with code 0 but prints JSON indicating degradation.
"""
import argparse
import json
import os
import sys
import numpy as np

from app.services.model_store import load_latest_model, list_saved_models


def load_amounts_from_csv(path):
    import csv

    amounts = []
    with open(path, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                amounts.append(float(row.get('amount', 0)))
            except Exception:
                continue
    return np.array([[a] for a in amounts], dtype=float)


def evaluate(new_model, prev_model, X):
    result = {'new_anomaly_rate': None, 'prev_anomaly_rate': None, 'diff': None, 'degraded': False}
    if X.size == 0:
        return result

    new_labels = new_model.predict(X)
    new_rate = float((new_labels == -1).sum()) / len(new_labels)
    result['new_anomaly_rate'] = new_rate

    if prev_model is not None:
        prev_labels = prev_model.predict(X)
        prev_rate = float((prev_labels == -1).sum()) / len(prev_labels)
        result['prev_anomaly_rate'] = prev_rate
        result['diff'] = abs(new_rate - prev_rate)
    else:
        result['prev_anomaly_rate'] = None
        result['diff'] = None

    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', required=True, help='Validation CSV path (amount column)')
    parser.add_argument('--prev-file', help='Optional previous model path (joblib)')
    parser.add_argument('--threshold', type=float, default=0.2, help='Degradation threshold')
    args = parser.parse_args()

    if not os.path.exists(args.data):
        print(json.dumps({'error': 'validation data not found', 'path': args.data}))
        sys.exit(2)

    X = load_amounts_from_csv(args.data)
    new_model = load_latest_model()
    if new_model is None:
        print(json.dumps({'error': 'no trained model available for evaluation'}))
        sys.exit(2)

    prev_model = None
    if args.prev_file and os.path.exists(args.prev_file):
        import joblib

        try:
            prev_model = joblib.load(args.prev_file)
        except Exception:
            prev_model = None

    result = evaluate(new_model, prev_model, X)

    degraded = False
    if result['diff'] is not None and result['diff'] > args.threshold:
        degraded = True
        result['degraded'] = True

    print(json.dumps(result))
    # Do not exit non-zero; workflow will parse result and send alert if needed.
    sys.exit(0)


if __name__ == '__main__':
    main()
