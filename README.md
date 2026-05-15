# ⚡ ExpenseAI : AI-Powered Expense Tracker

An intelligent, full-stack financial application built with the MERN stack that serves as both a personal expense tracker and a shared bill-splitter. Powered by Google's Gemini AI, ExpenseAI eliminates manual data entry and acts as a personal financial advisor.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![Tailwind v4](https://img.shields.io/badge/CSS-Tailwind_v4-38B2AC?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-FF6F00?style=for-the-badge)

## ✨ Core Features

* **🤖 Magic AI Entry:** Type natural language like *"I spent $45 on pizza with John"* and the Gemini AI engine automatically extracts the amount, categorizes it as "Food & Drink," and calculates the perfect split.
* **🧠 AI Financial Advisor:** The backend dynamically calculates your out-of-pocket spending across categories and generates personalized, contextual financial insights using Gemini 2.5 Flash.

* **👤 Unified Ledger:** Seamlessly handles complex group splits, 1-on-1 friend debts, and solitary "Personal Only" expenses in a single, high-performance database schema.
* **📊 Real-Time Telemetry:** Dashboard features interactive SVG charts (`recharts`) and instant net-balance calculations.

## 🛠️ Technology Stack

**Frontend Architecture:**
* React.js (Vite)
* Tailwind CSS v4 (CSS-first architecture)
* Zustand (Global State Management)
* React Hook Form (High-performance form validation)
* Recharts & Lucide React

**Backend & AI Architecture:**
* Node.js & Express.js
* MongoDB & Mongoose (NoSQL Database)
* JSON Web Tokens (JWT) for secure authentication
* `@google/generative-ai` SDK (Gemini AI Integration)

---

## 🚀 Local Setup & Installation

### 1. Prerequisites
Make sure you have Node.js and MongoDB installed on your machine. You will also need a free [Google Gemini API Key](https://aistudio.google.com/).

### 2. Clone the Repository
\`\`\`bash
git clone https://github.com/Amanjadaun01/SplitSense.git
cd splitsense
\`\`\`

### 3. Backend Setup
Navigate to the backend directory, install dependencies, and set up your environment variables.
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` folder and add the following:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 4. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies.
\`\`\`bash
cd frontend
npm install
\`\`\`
Create a `.env` file in the `frontend` folder to connect to your local backend:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`
Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

## 📂 System Architecture Highlights

* **Zero-Shot NLP Parsing:** The backend utilizes strict JSON schemas with the Gemini model to guarantee perfectly structured database payloads from unstructured user text.
* **Flexible Data Modeling:** The MongoDB Schema is designed to handle both multi-user group transactions and isolated personal expenses without requiring duplicate collections.
* **Stateless Authentication:** Secure route protection using HTTP-only strategies and JWTs for seamless user sessions.

## 🔮 Future Enhancements
* Cloudinary integration for user avatar uploads.
* PDF receipt scanning using Google Cloud Vision.
* Automated email notifications for pending debts.

---
*Designed and engineered by Aman Jadaun.*
