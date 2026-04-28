# Chunav Saathi (चुनाव साथी) - Indian Election Guide Assistant

An expert AI-powered assistant designed to help Indian citizens understand the election process, from voter registration to result declaration.

## Features
- **Real-time Streaming**: Instant responses via SSE from Gemini 2.5 Flash.
- **Interactive Timeline**: Step-by-step guide to the Indian election cycle.
- **Topic Library**: Quick access to essential election topics (EVM, NOTA, Form 6, etc.).
- **Tricolor Theme**: Premium dark UI inspired by the Indian National Flag.
- **Mobile First**: Fully responsive design with an intuitive mobile bottom sheet.

## Live Link
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Chunav%20Sathi-blue)](https://election-guide-frontend-461702816191.asia-south1.run.app)

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: FastAPI (Python), Google Gemini 1.5 Pro.

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `backend/`: FastAPI application and Gemini integration.
- `frontend/`: Next.js application and UI components.
- `frontend/components/`: Reusable React components (Timeline, ChatBox, etc.).
- `frontend/lib/`: API utilities and helper functions.
