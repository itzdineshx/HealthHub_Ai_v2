from app.repositories.user_repo import UserRepository
from app.models.user import UserDoc, PatientProfileDoc, UserRole
from firebase_admin import auth as firebase_auth
from datetime import datetime

class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()

    async def sync_firebase_user(self, decoded_token: dict) -> dict:
        """
        Verify the Firebase user token details. If the user doesn't exist in MongoDB,
        we create their baseline User record. If they are new, we also setup
        a blank PatientProfileDoc.
        """
        uid = decoded_token.get("uid")
        email = decoded_token.get("email", "")
        name = decoded_token.get("name", email.split("@")[0] if email else "User")
        
        # Check if user already exists in MongoDB
        db_user = await self.user_repo.get_by_uid(uid)
        
        if not db_user:
            # Create baseline user document in MongoDB
            new_user = UserDoc(
                uid=uid,
                email=email,
                name=name,
                role=UserRole.patient, # Default role is patient
                profile_completed=False
            )
            db_user = await self.user_repo.create_user(new_user)
            
            # Setup a baseline blank patient profile for them
            new_profile = PatientProfileDoc(uid=uid)
            await self.user_repo.create_patient_profile(new_profile)
            
        return db_user

    async def get_user_role_and_status(self, uid: str) -> dict:
        """
        Retrieves user role, profile completion, and status details.
        """
        db_user = await self.user_repo.get_by_uid(uid)
        if not db_user:
            return {"role": None, "profile_completed": False, "status": "pending"}
        return {
            "role": db_user.get("role"),
            "profile_completed": db_user.get("profile_completed", False),
            "status": db_user.get("status", "active")
        }
