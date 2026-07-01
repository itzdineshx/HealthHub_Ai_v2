from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.core.config import settings
from app.db.mongodb import client
from app.api.v1.api import api_router

# Import existing routers so we don't break backward compatibility during migration
from routers import auth as legacy_auth, users, doctor, admin, appointments, health_records, fitness, diet, risk_assessment, disease_predictor, ai_chat, dashboard

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for HealthHub health management platform with MongoDB & Firebase Auth",
    version=settings.VERSION
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",  
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    pass # MongoDB client connects automatically via motor

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Mount new V1 API
app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount SQLAlchemy database routers
app.include_router(legacy_auth.router)
app.include_router(users.router)
app.include_router(doctor.router)
app.include_router(admin.router)
app.include_router(appointments.router)
app.include_router(health_records.router)
app.include_router(fitness.router)
app.include_router(diet.router)
app.include_router(risk_assessment.router)
app.include_router(disease_predictor.router)
app.include_router(ai_chat.router)
app.include_router(dashboard.router)
@app.get("/")
async def root():
    return {"message": "Welcome to HealthHub API powered by MongoDB and Firebase"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
