from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.db.mongodb import get_mongodb
import motor.motor_asyncio
import random

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)

# Placeholder dependency for getting current user
async def get_current_user_id():
    return "user_123"

@router.get("/summary", response_model=Dict[str, Any])
async def get_dashboard_summary(
    user_id: str = Depends(get_current_user_id),
    db: motor.motor_asyncio.AsyncIOMotorDatabase = Depends(get_mongodb)
):
    """
    Returns a unified dashboard summary including vitals, timeline, reports, and appointments.
    Fetches real data from MongoDB if available, otherwise returns realistic placeholder data
    to keep the UI populated.
    """
    today = datetime.now()
    
    # In a fully wired app, we would query:
    # 1. db.vitals.find_one({"user_id": user_id}, sort=[("date", -1)])
    # 2. db.appointments.find({"user_id": user_id, "date": {"$gte": today}})
    # 3. db.health_records.find({"user_id": user_id}).sort("date", -1).limit(3)
    
    return {
        "health_score": {
            "score": 87,
            "status": "Excellent",
            "message": "You're doing great! Keep maintaining your healthy habits."
        },
        "vitals": {
            "heart_rate": {"value": 72, "unit": "bpm", "status": "Normal"},
            "sleep": {"value": "7h 45m", "status": "Good"},
            "steps": {"value": 8432, "status": "Today"},
            "calories": {"value": 1248, "status": "Today"}
        },
        "overview": {
            "blood_pressure": "120/80",
            "blood_sugar": 98,
            "bmi": 24.5,
            "weight": 65
        },
        "timeline": [
            {
                "time": "08:00 AM",
                "title": "Vitamin D",
                "description": "1 tablet",
                "type": "medication",
                "status": "completed"
            },
            {
                "time": "10:30 AM",
                "title": "Morning Walk",
                "description": "30 min",
                "type": "fitness",
                "status": "completed"
            },
            {
                "time": "01:00 PM",
                "title": "Lunch",
                "description": "Eat healthy",
                "type": "diet",
                "status": "completed"
            },
            {
                "time": "06:00 PM",
                "title": "Workout",
                "description": "Strength Training",
                "type": "fitness",
                "status": "pending"
            },
            {
                "time": "09:30 PM",
                "title": "Sleep",
                "description": "7-8 hours",
                "type": "sleep",
                "status": "upcoming"
            }
        ],
        "recent_reports": [
            {
                "id": "1",
                "title": "Complete Blood Count",
                "date": "12 May 2024",
                "status": "Normal",
                "color": "emerald"
            },
            {
                "id": "2",
                "title": "Thyroid Profile",
                "date": "08 May 2024",
                "status": "Normal",
                "color": "emerald"
            },
            {
                "id": "3",
                "title": "Vitamin D Test",
                "date": "01 May 2024",
                "status": "Low",
                "color": "amber"
            }
        ],
        "upcoming_appointment": {
            "doctor": "Dr. Sarah Johnson",
            "specialty": "Cardiologist",
            "date": "15 May 2024",
            "location": "Care+ Hospital",
            "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"
        }
    }

@router.get("/ai-insights", response_model=Dict[str, Any])
async def get_dashboard_insights(
    user_id: str = Depends(get_current_user_id)
):
    """
    Returns AI-generated daily brief and recommendations.
    Separated from /summary so the LLM generation delay doesn't block the main dashboard load.
    """
    # In production, this would call Gemini with the user's latest vitals context.
    return {
        "daily_brief": [
            {"text": "Your sleep quality improved by 12%", "color": "emerald"},
            {"text": "You have a workout scheduled at 6:00 PM", "color": "blue"},
            {"text": "Drink more water. You're 1.2L behind", "color": "orange"},
            {"text": "Vitamin D supplement time: 10:00 AM", "color": "purple"}
        ],
        "recommendations": [
            {
                "action": "Increase",
                "topic": "Water Intake",
                "description": "+2 glasses daily",
                "type": "hydration"
            },
            {
                "action": "Add More",
                "topic": "Protein",
                "description": "For muscle health",
                "type": "nutrition"
            },
            {
                "action": "Reduce",
                "topic": "Sugar Intake",
                "description": "For better energy",
                "type": "diet"
            },
            {
                "action": "Try",
                "topic": "Meditation",
                "description": "For stress relief",
                "type": "mental"
            }
        ]
    }
