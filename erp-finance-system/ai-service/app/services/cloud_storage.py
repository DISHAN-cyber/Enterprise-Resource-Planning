import os
from pathlib import Path
from typing import Optional

import boto3
from botocore.exceptions import ClientError

try:
    from azure.storage.blob import BlobServiceClient
except ImportError:  # pragma: no cover
    BlobServiceClient = None


class CloudStorageError(Exception):
    pass


class CloudStorage:
    def __init__(self) -> None:
        self.azure_conn = os.environ.get('AZURE_STORAGE_CONNECTION_STRING')
        self.azure_container = os.environ.get('AZURE_STORAGE_CONTAINER') or os.environ.get('AZURE_CONTAINER')
        self.s3_bucket = os.environ.get('S3_BUCKET')
        self.provider = None
        self.client = None
        self.container_name = None

        if self.azure_conn:
            if BlobServiceClient is None:
                raise CloudStorageError('azure-storage-blob is required for Azure Blob support')
            self.provider = 'azure'
            self.client = BlobServiceClient.from_connection_string(self.azure_conn)
            self.container_name = self.azure_container or 'erp-ai-storage'
            self.container_client = self.client.get_container_client(self.container_name)
            self._ensure_azure_container()
        elif self.s3_bucket:
            self.provider = 's3'
            self.client = boto3.client('s3')

    def _ensure_azure_container(self) -> None:
        try:
            self.container_client.get_container_properties()
        except Exception:
            try:
                self.container_client.create_container()
            except Exception:
                pass

    def is_configured(self) -> bool:
        return self.provider is not None

    def download_prefix(self, prefix: str, destination: Path) -> bool:
        destination.mkdir(parents=True, exist_ok=True)
        if self.provider == 'azure':
            return self._download_prefix_azure(prefix, destination)
        if self.provider == 's3':
            return self._download_prefix_s3(prefix, destination)
        return False

    def upload_directory(self, source: Path, prefix: str) -> bool:
        if not source.exists():
            return False
        if self.provider == 'azure':
            return self._upload_directory_azure(source, prefix)
        if self.provider == 's3':
            return self._upload_directory_s3(source, prefix)
        return False

    def _download_prefix_azure(self, prefix: str, destination: Path) -> bool:
        blobs = list(self.container_client.list_blobs(name_starts_with=prefix))
        if not blobs:
            return False
        for blob in blobs:
            blob_path = Path(blob.name[len(prefix):].lstrip('/'))
            if not blob_path.name:
                continue
            local_path = destination / blob_path
            local_path.parent.mkdir(parents=True, exist_ok=True)
            with open(local_path, 'wb') as f:
                stream = self.container_client.get_blob_client(blob).download_blob()
                f.write(stream.readall())
        return True

    def _upload_directory_azure(self, source: Path, prefix: str) -> bool:
        if not source.exists():
            return False
        for file_path in source.rglob('*'):
            if not file_path.is_file():
                continue
            relative_path = file_path.relative_to(source).as_posix()
            blob_name = f"{prefix}/{relative_path}" if prefix else relative_path
            blob_client = self.container_client.get_blob_client(blob_name)
            with open(file_path, 'rb') as f:
                blob_client.upload_blob(f, overwrite=True)
        return True

    def _download_prefix_s3(self, prefix: str, destination: Path) -> bool:
        paginator = self.client.get_paginator('list_objects_v2')
        found = False
        for page in paginator.paginate(Bucket=self.s3_bucket, Prefix=prefix):
            for obj in page.get('Contents', []):
                key = obj['Key']
                relative = Path(key[len(prefix):].lstrip('/'))
                if not relative.name:
                    continue
                target_path = destination / relative
                target_path.parent.mkdir(parents=True, exist_ok=True)
                try:
                    self.client.download_file(self.s3_bucket, key, str(target_path))
                    found = True
                except ClientError:
                    continue
        return found

    def _upload_directory_s3(self, source: Path, prefix: str) -> bool:
        for file_path in source.rglob('*'):
            if not file_path.is_file():
                continue
            relative = file_path.relative_to(source).as_posix()
            key = f"{prefix}/{relative}" if prefix else relative
            self.client.upload_file(str(file_path), self.s3_bucket, key)
        return True

    def download_models(self, destination: Path) -> bool:
        return self.download_prefix('ai-service/stored_models', destination)

    def upload_models(self, source: Path) -> bool:
        return self.upload_directory(source, 'ai-service/stored_models')

    def download_data(self, destination: Path) -> bool:
        return self.download_prefix('data', destination)

    def upload_data(self, source: Path) -> bool:
        return self.upload_directory(source, 'data')
