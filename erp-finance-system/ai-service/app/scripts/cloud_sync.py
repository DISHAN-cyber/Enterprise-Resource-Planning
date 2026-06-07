"""Sync models and data with configured cloud storage."""
import argparse
from pathlib import Path

from app.services.cloud_storage import CloudStorage, CloudStorageError


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Sync AI service data/models with cloud storage')
    parser.add_argument('--download-models', action='store_true', help='Download stored models from cloud storage')
    parser.add_argument('--upload-models', action='store_true', help='Upload stored models to cloud storage')
    parser.add_argument('--download-data', action='store_true', help='Download training and validation data from cloud storage')
    parser.add_argument('--upload-data', action='store_true', help='Upload training and validation data to cloud storage')
    parser.add_argument('--models-dir', default='stored_models', help='Local stored models directory')
    parser.add_argument('--data-dir', default='data', help='Local training/validation data directory')
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        storage = CloudStorage()
    except CloudStorageError as exc:
        print(f'Cloud storage configuration invalid: {exc}')
        return 1

    if not storage.is_configured():
        print('No cloud storage provider configured; skipping sync.')
        return 0

    if args.download_models:
        downloaded = storage.download_models(Path(args.models_dir))
        print(f'Downloaded models: {downloaded}')

    if args.download_data:
        downloaded = storage.download_data(Path(args.data_dir))
        print(f'Downloaded data: {downloaded}')

    if args.upload_models:
        uploaded = storage.upload_models(Path(args.models_dir))
        print(f'Uploaded models: {uploaded}')

    if args.upload_data:
        uploaded = storage.upload_data(Path(args.data_dir))
        print(f'Uploaded data: {uploaded}')

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
