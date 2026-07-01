from app.repositories.base_repo import BaseRepository
from app.integrations.firebase_storage import FirebaseStorageProvider
from app.models.report import DocumentFileDoc
from app.services.timeline_service import TimelineService
from datetime import datetime
from typing import Dict, Any

class UploadService:
    def __init__(self):
        self.repo = BaseRepository("document_files")
        self.storage_provider = FirebaseStorageProvider()
        self.timeline_service = TimelineService()

    async def upload_document(
        self, 
        user_id: str, 
        file_bytes: bytes, 
        file_name: str, 
        file_type: str, 
        file_size: int, 
        category: str, 
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Orchestrates uploading a document file to Firebase Storage,
        saves metadata in MongoDB, and logs a Timeline event.
        """
        # Define Firebase Storage target path
        timestamp_str = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        destination_path = f"users/{user_id}/documents/{timestamp_str}_{file_name}"
        
        # Upload to Firebase Storage
        storage_path = self.storage_provider.upload_file(file_bytes, destination_path, file_type)
        
        # Save metadata to MongoDB
        doc_metadata = DocumentFileDoc(
            user_id=user_id,
            file_name=file_name,
            file_path=storage_path,
            file_type=file_type,
            file_size=file_size,
            category=category,
            notes=notes
        )
        
        db_doc = await self.repo.create(doc_metadata.model_dump())
        
        # Generate Timeline Event
        await self.timeline_service.log_event(
            user_id=user_id,
            event_type="report_uploaded",
            title=f"New {category} Uploaded",
            description=f"Uploaded document '{file_name}' ({round(file_size/1024, 2)} KB)",
            metadata={"document_id": str(db_doc["_id"]), "category": category}
        )
        
        return db_doc
        
    async def get_download_url(self, document_id: str) -> str:
        """
        Gets a signed download URL for a document metadata ID.
        """
        doc = await self.repo.get_by_id(document_id)
        if not doc:
            raise ValueError("Document not found")
        return self.storage_provider.get_signed_url(doc["file_path"])
