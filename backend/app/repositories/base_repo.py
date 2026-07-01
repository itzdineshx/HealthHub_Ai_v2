from bson import ObjectId
from app.db.mongodb import get_db
from typing import List, Dict, Any, Optional

class BaseRepository:
    def __init__(self, collection_name: str):
        self.collection_name = collection_name

    async def get_collection(self):
        db = await get_db()
        return db[self.collection_name]

    async def get_by_id(self, doc_id: str) -> Optional[Dict[str, Any]]:
        collection = await self.get_collection()
        try:
            return await collection.find_one({"_id": ObjectId(doc_id)})
        except Exception:
            # Handle invalid ObjectId formats gracefully
            return await collection.find_one({"_id": doc_id})

    async def find(self, filter_query: Dict[str, Any] = {}, skip: int = 0, limit: int = 100, sort_by: Optional[str] = None, sort_desc: bool = True) -> List[Dict[str, Any]]:
        collection = await self.get_collection()
        cursor = collection.find(filter_query).skip(skip).limit(limit)
        if sort_by:
            direction = -1 if sort_desc else 1
            cursor = cursor.sort(sort_by, direction)
        return await cursor.to_list(length=limit)

    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        collection = await self.get_collection()
        result = await collection.insert_one(data)
        data["_id"] = result.inserted_id
        return data

    async def update(self, doc_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        collection = await self.get_collection()
        try:
            query = {"_id": ObjectId(doc_id)}
        except Exception:
            query = {"_id": doc_id}
            
        result = await collection.find_one_and_update(
            query,
            {"$set": update_data},
            return_document=True
        )
        return result

    async def delete(self, doc_id: str) -> bool:
        collection = await self.get_collection()
        try:
            query = {"_id": ObjectId(doc_id)}
        except Exception:
            query = {"_id": doc_id}
            
        result = await collection.delete_one(query)
        return result.deleted_count > 0
