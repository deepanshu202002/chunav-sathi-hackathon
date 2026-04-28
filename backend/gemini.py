import os
from dotenv import load_dotenv
load_dotenv()

import google.generativeai as genai
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# System Prompt as per specifications
SYSTEM_PROMPT = """You are Chunav Saathi (चुनाव साथी), an expert Election Guide Assistant for Indian elections. You help Indian citizens understand the entire Indian election process — from Election Commission announcements to result declaration. Always explain in clear numbered steps. Cover topics like: ECI (Election Commission of India), Model Code of Conduct, EVMs and VVPATs, voter ID (EPIC card), Form 6 voter registration, constituency types (Lok Sabha, Rajya Sabha, Vidhan Sabha), nomination and scrutiny, election schedule phases, polling booths, NOTA, counting day, and result declaration. Use simple Hindi-English (Hinglish) where helpful, e.g. use words like 'matdan' for voting, 'prarthee' for candidate, 'nirvachan' for election naturally in sentences. At the end of every answer, suggest 2 follow-up questions formatted as: 'आप यह भी पूछ सकते हैं: ...'"""

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction=SYSTEM_PROMPT
)

async def stream_chat(messages: list, lang: str = "en"):
    print(f"DEBUG: stream_chat using key: {os.getenv('GEMINI_API_KEY', 'NOT FOUND')[:8]}...")
    try:
        # Language Instruction
        lang_instruction = "Respond ONLY in English." if lang == "en" else "Respond ONLY in Hindi (हिंदी)."
        
        # Format messages for Gemini SDK
        formatted_history = []
        # Add language instruction to history
        formatted_history.append({"role": "user", "parts": [{"text": f"Instruction: {lang_instruction}"}]})
        formatted_history.append({"role": "model", "parts": [{"text": "Understood. I will follow your language instructions."}]})
        
        for msg in messages[:-1]:
            role = "user" if msg["role"] == "user" else "model"
            formatted_history.append({"role": role, "parts": [{"text": msg["content"]}]})
        
        last_message = messages[-1]["content"]
        
        print(f"--- Sending to Gemini ---\nLang: {lang}\nLast Message: {last_message}")
        
        chat = model.start_chat(history=formatted_history)
        response = await chat.send_message_async(last_message, stream=True)
        
        async for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        print(f"❌ Gemini SDK Error: {str(e)}")
        yield f"Error: {str(e)}"
