from fastapi import APIRouter
# Import actual routers here when they are migrated
# from app.api.v1.routers import auth, users, patients, doctors

api_router = APIRouter()

# Example inclusion for when routers are migrated:
# api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])

# Placeholder test route
@api_router.get("/health")
async def health_check():
    return {"status": "ok", "message": "API V1 is running"}
