import os
import google.generativeai as genai
from typing import Optional

class GeminiProvider:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL_NAME", "gemini-1.5-flash")
        self.client_ready = False
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.client_ready = True

    async def generate_response(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """
        Generates text using Google Gemini API. Falls back to mock responses
        if api key is not set.
        """
        if not self.client_ready:
            print("Gemini API key not configured. Returning fallback placeholder response.")
            return "This is a placeholder AI response. Please configure GEMINI_API_KEY in your .env file to enable live AI consultations."

        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_instruction
            )
            # Running in standard blocking mode but we could wrap in threadpool if async is strict
            # For simplicity, running direct call
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error contacting AI Provider: {str(e)}"
