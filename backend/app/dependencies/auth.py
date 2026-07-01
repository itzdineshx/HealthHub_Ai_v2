from fastapi import Depends, HTTPException, status
from typing import List
from app.core.firebase import get_current_user
from app.db.mongodb import get_db
from app.core.exceptions import UnauthorizedException, ForbiddenException

# Note: In a real system, you would fetch the user from MongoDB here based on the Firebase UID
async def get_current_db_user(uid: str = Depends(get_current_user), db = Depends(get_db)):
    """
    Fetch the corresponding MongoDB user record for the given Firebase UID.
    """
    user = await db.users.find_one({"uid": uid})
    if not user:
        raise UnauthorizedException(detail="User profile not found in database. Please complete registration.")
    
    # Check if account is active/suspended
    if user.get("status") == "suspended":
        raise ForbiddenException(detail="Account is suspended. Please contact support.")
        
    return user

def require_role(allowed_roles: List[str]):
    """
    Dependency factory to check if the current user has one of the required roles.
    """
    async def role_checker(user: dict = Depends(get_current_db_user)):
        if user.get("role") not in allowed_roles:
            raise ForbiddenException(detail=f"Operation requires one of the following roles: {', '.join(allowed_roles)}")
        return user
    return role_checker

# Pre-defined dependencies for common roles
require_patient = require_role(["patient", "admin", "super_admin"])
require_doctor = require_role(["doctor", "admin", "super_admin"])
require_nurse = require_role(["nurse", "admin", "super_admin"])
require_admin = require_role(["admin", "super_admin"])
require_super_admin = require_role(["super_admin"])
