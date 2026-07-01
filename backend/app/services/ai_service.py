from app.repositories.base_repo import BaseRepository
from app.integrations.llm_provider import GeminiProvider
from app.services.timeline_service import TimelineService
from app.repositories.user_repo import UserRepository
from app.models.conversation import ConversationDoc, ChatMessage
from datetime import datetime
from typing import List, Dict, Any, Optional

class AIService:
    def __init__(self):
        self.conversation_repo = BaseRepository("ai_conversations")
        self.user_repo = UserRepository()
        self.timeline_service = TimelineService()
        self.llm_provider = GeminiProvider()

    async def get_or_create_conversation(self, user_id: str) -> Dict[str, Any]:
        """
        Retrieves existing chat session or creates a new one for the user.
        """
        convs = await self.conversation_repo.find(filter_query={"user_id": user_id}, limit=1)
        if convs:
            return convs[0]
            
        new_conv = ConversationDoc(user_id=user_id)
        return await self.conversation_repo.create(new_conv.model_dump())

    async def ask_health_assistant(self, user_id: str, user_message: str) -> str:
        """
        Interacts with the AI, feeding it the patient's personal background
        and prior timeline health events for hyper-personalized responses.
        """
        # Fetch patient clinical info for context injection
        profile = await self.user_repo.get_patient_profile(user_id)
        timeline = await self.timeline_service.get_user_timeline(user_id, limit=5)
        
        # Build contextual system prompt
        system_instruction = (
            "You are HealthHub AI, a world-class personalized medical assistant and clinical copilot. "
            "Your tone is calm, trustworthy, empathetic, and professional. "
            "Always structure your answer as follows: "
            "1. Short, concise answer (1-2 sentences). "
            "2. Detailed clinical explanation. "
            "3. Clear, recommended next actions. "
            "4. A safety warning note (e.g. consult a doctor if severe). "
            "NEVER prescribe medications directly. Use the patient context provided to personalize responses."
        )

        # Build context details
        context = ""
        if profile:
            context += f"Patient Profile: Blood Group {profile.get('blood_group') or 'Unknown'}, Allergies: {', '.join(profile.get('allergies', [])) or 'None'}.\n"
        if timeline:
            events_summary = [f"- {e.get('title')}: {e.get('description')}" for e in timeline]
            context += f"Recent Health Timeline:\n" + "\n".join(events_summary) + "\n"

        prompt = f"Patient context:\n{context}\nUser question: {user_message}"

        # Call Gemini Provider
        ai_response = await self.llm_provider.generate_response(prompt, system_instruction=system_instruction)

        # Save conversation history in MongoDB
        conv = await self.get_or_create_conversation(user_id)
        conv_id = str(conv["_id"])
        
        messages = conv.get("messages", [])
        messages.append(ChatMessage(sender="user", content=user_message).model_dump())
        messages.append(ChatMessage(sender="ai", content=ai_response).model_dump())
        
        await self.conversation_repo.update(conv_id, {
            "messages": messages,
            "updated_at": datetime.utcnow()
        })
        
        return ai_response

    async def summarize_uploaded_report(self, user_id: str, document_text: str) -> str:
        """
        Analyzes the text extracted from OCR/PDF reports and outputs an AI summary.
        """
        system_instruction = "You are an AI Clinical Pathologist. Summarize lab test values clearly, flags abnormal metrics in bold, and recommends follow-up tests."
        prompt = f"Summarize the following medical document contents:\n{document_text}"
        return await self.llm_provider.generate_response(prompt, system_instruction=system_instruction)
