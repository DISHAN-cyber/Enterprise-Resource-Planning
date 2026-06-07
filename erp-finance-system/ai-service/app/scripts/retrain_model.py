"""Retraining script for the fraud IsolationForest model.

Usage:
    python -m app.scripts.retrain_model path/to/transactions.csv [--version VERSION]

CSV format: one header row with a column named `amount`. Other columns ignored.
"""
import argparse
import csv
import sys
import numpy as np
from sklearn.ensemble import IsolationForest

from app.services.model_store import save_model


def load_amounts_from_csv(path):
    amounts = []
    with open(path, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                amounts.append(float(row.get('amount', 0)))
            except Exception:
                continue
    return amounts


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('csv_path', help='Path to transactions CSV')
    parser.add_argument('--version', help='Optional version string to tag the model', default=None)
    args = parser.parse_args()

    path = args.csv_path
    amounts = load_amounts_from_csv(path)
    if not amounts:
        print('No valid amounts found in CSV; aborting.')
        sys.exit(1)

    X = np.array([[a] for a in amounts], dtype=float)
    model = IsolationForest(contamination='auto', random_state=42)
    model.fit(X)
    filename = save_model(model, version=args.version)
    print(f'Model retrained and saved as: {filename}')


if __name__ == '__main__':
    main()
