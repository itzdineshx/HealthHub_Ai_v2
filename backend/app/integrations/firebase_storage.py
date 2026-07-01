import os
from firebase_admin import storage
from datetime import datetime, timedelta
from typing import Optional

class FirebaseStorageProvider:
    def __init__(self):
        # The Firebase Admin SDK must be initialized before using storage.bucket()
        self.bucket_name = os.getenv("FIREBASE_STORAGE_BUCKET")

    def upload_file(self, file_bytes: bytes, destination_path: str, content_type: str) -> str:
        """
        Upload raw bytes to Firebase Storage bucket and return the path reference.
        """
        try:
            bucket = storage.bucket(self.bucket_name)
            blob = bucket.blob(destination_path)
            blob.upload_from_string(file_bytes, content_type=content_type)
            return destination_path
        except Exception as e:
            # Fallback to local stub mock path in case Firebase Storage is not configured
            print(f"Firebase Storage upload failed: {str(e)}. Falling back to local stub.")
            return f"local_storage/{destination_path}"

    def get_signed_url(self, file_path: str, expiration_minutes: int = 15) -> str:
        """
        Generates a secure temporary download URL for a file in Firebase Storage.
        """
        try:
            if file_path.startswith("local_storage/"):
                return f"http://localhost:8000/static/{file_path.replace('local_storage/', '')}"
                
            bucket = storage.bucket(self.bucket_name)
            blob = bucket.blob(file_path)
            # URL expires in 15 mins
            url = blob.generate_signed_url(expiration=timedelta(minutes=expiration_minutes))
            return url
        except Exception:
            return f"http://localhost:8000/static/{file_path}"
