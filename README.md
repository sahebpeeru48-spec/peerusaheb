# 🩺 HealthAI – Your Smart Healthcare Assistant

> **AI-Powered Healthcare Assistance Platform** designed for accessibility, emergency triage safety, clinical guidance, verified healthcare discovery, and personal health records.

![HealthAI Dashboard Preview](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 1. Project Overview

**HealthAI** is a modern, responsive, full-stack healthcare web application built to empower users with reliable health information, evidence-based symptom triage with emergency red-flag detection, interactive facility mapping, and personal health records management.

Built specifically with **patient safety**, **clinical accuracy**, and **hackathon presentation excellence** in mind, HealthAI ensures:
- **Zero delay in emergency situations**: Instant red-flag detection for life-threatening symptoms (stroke, heart attack, anaphylaxis).
- **No medical hallucination**: Transparent clinical heuristics with clear disclaimers that AI responses do not replace professional medical diagnosis.
- **Data privacy & patient control**: Full GDPR compliance with data export (JSON) and one-click data purge.
- **Hackathon Demo Ready**: Pre-seeded with a comprehensive demo profile (Sarah Jenkins, 34yo) and one-click login for hackathon judges.

---

## 🚀 2. Core Features

### A. 🤖 AI Health Chatbot
- **Interactive Conversational AI**: Ask questions about physical wellness, diagnostic lab results, and preventive healthcare.
- **Medical Terminology Explanations**: Clear, plain-language breakdowns of concepts like *Hypertension*, *HbA1c*, *Triglycerides*, and *Electrolytes*.
- **Configurable LLM Integration**: Directly supports **Google Gemini 1.5 Flash** or **OpenAI** when API keys are placed in `.env`.
- **Built-in Clinical Knowledge Engine**: If no API key is provided, HealthAI automatically activates its comprehensive fallback engine with evidence-based reasoning, follow-up questions, and safety disclaimers.

### B. 🩺 Symptom Checker & Triage
- **Multi-Factor Triage Assessment**: Collects symptoms, duration, severity (1–10 slider), age group, and pre-existing conditions.
- **🚨 Instant Emergency Red-Flag Detection**: Automatically recognizes potential acute coronary syndromes, stroke symptoms (BE-FAST), respiratory failure, and anaphylaxis.
- **Never Delays Emergency Guidance**: Alerts users immediately with direct 911 / 112 dialing and first-responder instructions before asking any additional questions.
- **Possible Explanations**: Suggests evidence-based differential possibilities with likelihood ratings without claiming definitive diagnosis.
- **Next-Step Recommendations**: Clear categorization into **Self-Care**, **Routine Medical Consultation**, **Urgent Care (12-24 Hours)**, or **Immediate Emergency**.

### C. 📍 Nearby Healthcare Finder & Interactive Map
- **Interactive Leaflet / OpenStreetMap**: Custom-themed pins for **Hospitals (24/7 ER)**, **Urgent Care / Clinics**, **Pharmacies**, and **Diagnostic Laboratories**.
- **Real GPS Geolocation**: Calculates exact distance in miles and kilometers from user's coordinates.
- **Emergency Filter**: 1-click toggle for facilities with 24/7 emergency departments.
- **No Invented Data**: Verified addresses, operating hours, phone numbers, and direct Google Maps navigation links.

### D. 📊 Personal Health Dashboard
- **Welcome Header**: Personalized display with patient vitals overview.
- **Summary Cards**: Real-time readings for Blood Pressure, Resting Heart Rate, Fasting Blood Glucose, and Daily Hydration.
- **Prominent "Ask HealthAI" Bar**: Direct prompt bar to jump straight into the assistant from anywhere on the dashboard.
- **Clear Information Attribution**: Badges clearly distinguishing `[User Recorded]` vs `[AI Triage / Guidance]`.

### E. 🌿 Preventive Healthcare & Habits
- **Interactive Water Tracker**: 8-glass water gauge with `+` / `-` logging and percentage completion.
- **Sleep & Recovery Log**: Duration tracker with quality rating (Poor, Fair, Good, Excellent).
- **Daily Wellness Habits Checklist**: Interactive checklist with celebratory confetti when all goals are achieved.
- **Educational Condition Library**: Comprehensive guides for Hypertension, Type 2 Diabetes, Asthma, GERD, and Insomnia.

### F. 📅 Appointment Assistance & Records
- **Consultation Request Workflow**: Select provider, department, preferred date/time, facility, and visit format (In-Person or Video Telehealth).
- **Status Distinction**: Clearly differentiates between **Requested (Pending Confirmation)** and **Confirmed** appointments.
- **Health Records Repository**: Track blood pressure, blood sugar, medications with refill alerts, and allergies with severity indicators.
- **Physician Visit Clinical Summary**: 1-click printable / PDF export formatted for doctor appointments.

### G. 🛡️ Safety, Privacy & Settings
- **Medical Disclaimer**: Present on all views, explaining that HealthAI is informational and not a substitute for clinical care.
- **Patient Rights (GDPR)**: One-click JSON data export and permanent data purge options.
- **Demo Environment Reset**: Instant button to reset data for clean judging demonstrations.

---

## 🛠️ 3. Technology Stack

- **Frontend**: React 18 with TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React icons, Inter typography
- **Maps**: Leaflet & OpenStreetMap (zero paid API keys required, works globally)
- **Backend**: Node.js, Express REST API
- **Persistence**: File-based local JSON database (`server/data/store.json`) with auto-seeding
- **AI Engine**: Google Gemini API ready + built-in medical reasoning fallback engine

---

## ⚙️ 4. Quick Setup & Run Instructions

### Prerequisites
- Node.js (version 18+ or 20+ recommended)
- npm or yarn

### Installation

1. Open your terminal in the project directory:
   ```bash
   cd "c:\Users\Peeru\Desktop\Alpha squad"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables in `.env`:
   ```bash
   # If you have a Google Gemini API key:
   GEMINI_API_KEY=your_gemini_api_key_here

   # Port configuration
   PORT=5000
   ```
   *Note: If `GEMINI_API_KEY` is not provided, HealthAI seamlessly uses its built-in Clinical AI Engine without any errors.*

4. Start both backend and frontend concurrently:
   ```bash
   npm run dev
   ```

5. Open your browser:
   - **Frontend App**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🏆 5. Hackathon Demonstration Flow (Judging Script)

For a compelling 3-minute hackathon presentation, follow this sequence:

1. **The Problem & Solution (30s)**:
   - Start on the **Landing Page**. Highlight how fragmented healthcare information is, and how patients often panic or delay critical care.
   - Click **"Launch Interactive Demo"** (instantly signs into Sarah Jenkins's demo profile).

2. **The Dashboard & Chatbot (45s)**:
   - Show the **Dashboard**: Highlight the clean medical UI, vitals summary cards, upcoming appointment badges (Requested vs Confirmed), and the prominent search bar.
   - Enter a query: *"What are the warning signs of dehydration?"* or click **AI Assistant**. Show how clear, conversational, and medically responsible the answer is.

3. **Symptom Checker & Emergency Red-Flag Triage (60s)**:
   - Go to **Symptom Checker**.
   - **Demo Emergency Safety**: Type *"Severe crushing chest pain radiating to left arm"* or select *Chest Pain*. Click Analyze. Show how HealthAI immediately triggers the **Critical Emergency Banner with 911 Dialing**, refusing to delay emergency care.
   - **Demo Routine Triage**: Reset and select *"Mild cough, throat irritation"* (Severity 3, 2 days). Show the resulting triage category (*Self-Care*), possible explanations, and doctor questions.

4. **Healthcare Finder & Map (30s)**:
   - Open **Find Healthcare**. Demonstrate the interactive Leaflet map, filter by *Hospitals (24/7 ER)*, and show driving distance calculations.

5. **Records, Wellness & Privacy (15s)**:
   - Open **Health Records** and click **Export Doctor's Summary** to show the printable clinical report.
   - Point out the GDPR data export and purge in **Settings**.

---

## ⚖️ 6. Medical & Regulatory Disclaimer

HealthAI is an educational and organizational prototype developed for hackathon demonstration. It is not approved by the FDA or medical regulatory bodies as a medical diagnostic device. It does not provide medical diagnoses or prescribe treatment plans. Users experiencing acute medical emergencies must contact local emergency services (911 / 112 / 999) or present to an emergency department.
