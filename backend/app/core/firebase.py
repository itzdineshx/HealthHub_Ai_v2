import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

# Setup Firebase Admin
# Requires setting FIREBASE_CREDENTIALS_PATH in .env to the path of your service account json
creds_path = os.getenv("FIREBASE_CREDENTIALS_PATH")

try:
    if creds_path and os.path.exists(creds_path):
        cred = credentials.Certificate(creds_path)
        firebase_admin.initialize_app(cred)
    else:
        # For development purposes, if no credentials, we still initialize it but won't be able to verify properly
        # Make sure to add credentials in production!
        firebase_admin.initialize_app()
except ValueError:
    # Already initialized
    pass

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verify Firebase auth token and return the decoded token containing user info.
    """
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(decoded_token: dict = Depends(verify_token)):
    """
    Dependency to get the current user ID.
    Returns the Firebase uid.
    """
    uid = decoded_token.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid token: no UID")
    return uid
