AidSync AI - GDG Solution Challenge 2026
🌍 The Problem
Urban crises (natural disasters, fires, or medical emergencies) often suffer from "Information Siloing." Reports from the field are messy, unstructured, and come in faster than human coordinators can process. This leads to delayed responses and inefficient resource allocation, particularly in densely populated areas.

🚀 Our Solution: AidSync AI
AidSync AI is a rapid-response coordination platform that transforms chaotic field data into actionable intelligence. By leveraging Gemini 1.5 Flash, the system instantly analyzes crisis reports and matches them with the most qualified available volunteers in real-time.

Key Features
Intelligent Dispatch: Automatically ranks volunteers based on skill-relevance and proximity.

Automated Summarization: Converts long, panicked user reports into concise "Situation Briefs" for first responders.

Real-time Dashboard: A unified view for NGOs to monitor active crises and volunteer status.

🎯 UN SDG Alignment: Goal 11
This project directly addresses UN Sustainable Development Goal 11: Sustainable Cities and Communities.

Specifically, we target Target 11.5:

"By 2030, significantly reduce the number of deaths and the number of people affected... caused by disasters, including water-related disasters, with a focus on protecting the poor and people in vulnerable situations."

By reducing the response time from report to dispatch, AidSync AI increases urban resilience and helps protect vulnerable populations during humanitarian crises.

🤖 Build with AI: Technical Implementation
We used the Google AI Studio and Gemini 1.5 Flash to power the core logic of our application.

Why Gemini 1.5 Flash?
We chose Gemini 1.5 Flash because crisis coordination requires low latency and high-volume throughput.

Context Window: Flash easily handles large lists of volunteer skills and historical crisis data to make informed matching decisions.

Reasoning: Unlike simple keyword matching, Gemini understands the nuance of a crisis (e.g., matching a "downed power line" report to a volunteer with "Electrical Engineering" skills rather than just "General Labor").

Tech Stack
Frontend: React / Tailwind CSS (Vite)

Backend: Firebase (Firestore & App Hosting)

AI Engine: Gemini 1.5 Flash API

Auth: Google Sign-In via Firebase Auth

🛠️ Setup Instructions
Clone the Repo:

Bash
git clone https://github.com/adrishchakra-1729/Aid-Sync-2026.git
cd Aid-Sync-2026
Environment Variables:
Create a .env file and add your Gemini API Key:

Plaintext
VITE_GEMINI_API_KEY=your_key_here
Install & Run:

Bash
npm install
npm run dev
👥 The Team
Adrish Chakraborty - Lead Developer & AI Integration
Adrika Brahma - Powerpoint & Graphics Section
