# Yojana-Saathi - AI Civic & Legal Empowerment Platform

Yojana-Saathi is an end-to-end multimodal platform engineered for India's Next Billion Users. It features a Neo-Pop Brutalist UI, a Voice Scheme Matcher, and an AI-driven Document Simplifier using Google's Gemini 2.5 Flash model.

## Project Architecture
This project is built as an npm workspace monorepo containing:
- **`apps/web`**: The Next.js 14 (App Router) client app with Tailwind CSS 4.
- **`apps/api-server`**: The Express.js backend using TypeScript, Multer, and the Google GenAI SDK.

---
## Complete Setup Guide

Follow these instructions to run the project locally on your PC.

### 1. Prerequisites
Ensure you have the following installed on your PC:
- **Node.js** (v20+ recommended)
- **npm** (Node Package Manager)
- A **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))
- (Optional) **Qdrant** instance if you plan on fully implementing the vector database.

### 2. Environment Setup

First, you need to configure the environment variables for the API Server.

1. Navigate to the API Server directory:
   \`\`\`bash
   cd apps/api-server
   \`\`\`
2. Create a `.env` file in the `apps/api-server` folder with the following contents:
   \`\`\`env
   PORT=4000
   GEMINI_API_KEY=your_gemini_api_key_here
   QDRANT_URL=http://localhost:6333
   QDRANT_API_KEY=your_qdrant_api_key_here
   \`\`\`
   *(Replace `your_gemini_api_key_here` with your actual Gemini API key. Qdrant variables can be left to default for testing as it is mocked in the current controller)*

### 3. Installing Dependencies

From the **root folder of the project** (the directory containing this `readMe.md` and `package.json`), install all dependencies for the entire workspace:

\`\`\`bash
npm install
\`\`\`

### 4. Running the Backend API Server

The API server needs to be running to process voice matches and document simplifications.

1. Open a terminal.
2. Navigate to the API server directory:
   \`\`\`bash
   cd apps/api-server
   \`\`\`
3. Start the server using `ts-node` (for development):
   \`\`\`bash
   npx ts-node src/index.ts
   \`\`\`
   *(You should see `[Jan-Sahayak API] Server is running on port 4000`)*

### 5. Running the Frontend Next.js Client

Open a **new, separate terminal** so the backend keeps running.

1. Navigate to the Next.js web client directory:
   \`\`\`bash
   cd apps/web
   \`\`\`
2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Open your browser and go to: **[http://localhost:3000](http://localhost:3000)**

---

## Features Built
- **Voice Matcher:** Native HTML5 `MediaRecorder` audio capture streamed via Multipart form data to Gemini Flash.
- **Document Simplifier:** Drag-and-drop React interface that uploads `.png` and `.jpeg` legal documents to Gemini for bullet-point summarization.
- **Neo-Pop Brutalism Design:** Accessible UI optimized with high-contrast sharp borders, offset shadows, and large physical touch targets for all interactive components.
