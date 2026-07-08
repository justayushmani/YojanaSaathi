import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { VoiceController } from './controllers/voice.controller';
import { setDefaultResultOrder } from 'node:dns';

// Fix Node.js fetch failing on some networks with IPv6 for Google APIs
setDefaultResultOrder('ipv4first');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Configure middlewares
app.use(cors());
app.use(express.json());

// Configure Multer for in-memory uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Routes
// 1. Voice match endpoint
app.post('/api/match-voice', upload.single('audio'), VoiceController.handleAudioMatch);

// 2. Document simplify endpoint
app.post('/api/simplify-document', upload.single('document'), VoiceController.handleDocumentSimplify);

// 3. Chat endpoint
app.post('/api/chat', VoiceController.handleChat);

// 4. Reactive scheme recommendation endpoint
app.post('/api/recommend-schemes', VoiceController.handleRecommendSchemes);

// 5. Reactive document translation endpoint
app.post('/api/translate-markdown', VoiceController.handleTranslateMarkdown);

// Start Server
app.listen(port, () => {
  console.log(`[Jan-Sahayak API] Server is running on port ${port}`);
});
