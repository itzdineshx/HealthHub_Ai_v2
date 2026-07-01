from app.db.mongodb import get_db
from app.models.user import UserDoc, PatientProfileDoc, DoctorProfileDoc
from datetime import datetime

class UserRepository:
    def __init__(self):
        # We fetch the DB asynchronously during operations
        pass

    async def get_by_uid(self, uid: str) -> dict | None:
        db = await get_db()
        return await db.users.find_one({"uid": uid})

    async def create_user(self, user_in: UserDoc) -> dict:
        db = await get_db()
        user_dict = user_in.model_dump()
        await db.users.insert_one(user_dict)
        return user_dict

    async def update_user(self, uid: str, update_data: dict) -> dict | None:
        db = await get_db()
        update_data["updated_at"] = datetime.utcnow()
        result = await db.users.find_one_and_update(
            {"uid": uid},
            {"$set": update_data},
            return_document=True
        )
        return result

    async def create_patient_profile(self, profile_in: PatientProfileDoc) -> dict:
        db = await get_db()
        profile_dict = profile_in.model_dump()
        await db.patient_profiles.insert_one(profile_dict)
        return profile_dict

    async def get_patient_profile(self, uid: str) -> dict | None:
        db = await get_db()
        return await db.patient_profiles.find_one({"uid": uid})

    async def create_doctor_profile(self, profile_in: DoctorProfileDoc) -> dict:
        db = await get_db()
        profile_dict = profile_in.model_dump()
        await db.doctor_profiles.insert_one(profile_dict)
        return profile_dict

    async def get_doctor_profile(self, uid: str) -> dict | None:
        db = await get_db()
        return await db.doctor_profiles.find_one({"uid": uid})
