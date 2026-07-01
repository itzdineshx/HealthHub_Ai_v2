from fastapi import APIRouter
from app.api.v1.routers import auth, predictions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])

# Placeholder test route
@api_router.get("/health")
async def health_check():
    return {"status": "ok", "message": "API V1 is running"}
