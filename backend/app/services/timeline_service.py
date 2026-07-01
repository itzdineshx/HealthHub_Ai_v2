from app.repositories.base_repo import BaseRepository
from app.models.timeline import TimelineEventDoc
from datetime import datetime
from typing import List, Dict, Any

class TimelineService:
    def __init__(self):
        self.repo = BaseRepository("timeline")

    async def log_event(self, user_id: str, event_type: str, title: str, description: str, metadata: Dict[str, Any] = {}) -> Dict[str, Any]:
        """
        Logs a new health timeline event for a user.
        """
        event = TimelineEventDoc(
            user_id=user_id,
            event_type=event_type,
            title=title,
            description=description,
            metadata=metadata,
            timestamp=datetime.utcnow()
        )
        return await self.repo.create(event.model_dump())

    async def get_user_timeline(self, user_id: str, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Retrieve timeline events for a specific user, sorted newest first.
        """
        return await self.repo.find(
            filter_query={"user_id": user_id},
            skip=skip,
            limit=limit,
            sort_by="timestamp",
            sort_desc=True
        )
