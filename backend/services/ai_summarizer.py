import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

class AI_Summarizer:
    """
    Generates natural language summaries using the Gemini API.
    This class is initialized once and does not load any data itself.
    """
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            print("WARNING: GEMINI_API_KEY environment variable not set. AI Summarizer will not work.")
        
        # --- THIS IS THE FIX 1: Use the correct, modern model name ---
        self.api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={self.api_key}"

    def generate_summary_from_details(self, risk_details):
        """
        Generates a summary from a dictionary of risk details for one person.
        """
        if not self.api_key or not risk_details:
            return "AI Summary generation is disabled or risk data is missing."

        # --- Gather facts for the prompt from the provided dictionary ---
        try:
            facts = []
            person_info = risk_details.get('person_details', {})
            risk_breakdown = risk_details.get('breakdown', {})

            facts.append(f"Subject Name: {person_info.get('full_name', 'N/A')}")
            facts.append(f"Declared Monthly Salary: INR {person_info.get('monthly_salary_inr', 0):,}")
            facts.append(f"Assigned Risk Score: {risk_details.get('final_risk_score', 0)} out of 100")

            triggered_risks = [f"- {details['label']} (Score: {details['score']})" for _, details in risk_breakdown.items() if details['score'] > 0]
            if triggered_risks:
                facts.append("\nKey risk factors triggered:")
                facts.extend(triggered_risks)

        except Exception as e:
            print(f"Error gathering facts for AI prompt: {e}")
            return "Error: Could not process the provided risk data to generate a summary."

        # --- Construct the prompt ---
        prompt_facts = "\n".join(facts)
        system_prompt = (
            "You are a world-class financial crimes analyst. Synthesize the following data points "
            "into a concise, professional, neutral-tone summary for an investigative case file. "
            "Do not use speculative language. Stick to the facts provided. Begin the summary directly."
        )
        user_prompt = f"Please generate a summary based on this case data:\n\n{prompt_facts}"

        # --- Call the Gemini API ---
        headers = {'Content-Type': 'application/json'}
        payload = {
            "contents": [{"parts": [{"text": user_prompt}]}],
            "systemInstruction": {"parts": [{"text": system_prompt}]}
        }

        try:
            response = requests.post(self.api_url, headers=headers, data=json.dumps(payload), timeout=20)
            response.raise_for_status()
            result = response.json()
            
            summary = result['candidates'][0]['content']['parts'][0]['text']
            return summary.strip()

        # --- THIS IS THE FIX 2: Graceful fallback on API failure ---
        except requests.exceptions.RequestException as e:
            print(f"API Request Error: {e}")
            return f"AI summary could not be generated. The AI service may be unavailable or the API key may be invalid. (Details: {e})"
        except (KeyError, IndexError) as e:
            print(f"API Response Parsing Error: {e}. Full Response: {response.text}")
            return "AI summary could not be generated due to an invalid response from the AI service."
