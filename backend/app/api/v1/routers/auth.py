from fastapi import APIRouter, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import AuthService
from app.core.firebase import verify_token
from app.core.exceptions import UnauthorizedException

router = APIRouter()
auth_service = AuthService()
security = HTTPBearer()

@router.post("/verify")
async def verify_and_sync_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Endpoint called by the client after authenticating with Firebase.
    Verifies the ID token with Firebase Admin SDK, syncs the user details
    to MongoDB, and returns role/profile completion metadata.
    """
    token = credentials.credentials
    try:
        decoded_token = await verify_token(credentials)
    except Exception as e:
        raise UnauthorizedException(detail=f"Token verification failed: {str(e)}")

    # Sync user details in MongoDB
    user_record = await auth_service.sync_firebase_user(decoded_token)
    
    # Determine dashboard redirect target based on role
    role = user_record.get("role", "patient")
    redirects = {
        "patient": "/dashboard",
        "doctor": "/doctor",
        "nurse": "/nurse",
        "hospital_admin": "/hospital",
        "super_admin": "/admin"
    }
    
    return {
        "uid": user_record.get("uid"),
        "email": user_record.get("email"),
        "name": user_record.get("name"),
        "role": role,
        "profile_completed": user_record.get("profile_completed", False),
        "status": user_record.get("status", "active"),
        "redirect_url": redirects.get(role, "/dashboard")
    }
