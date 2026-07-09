import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { VoiceController } from './controllers/voice.controller';
import { AuthController } from './controllers/auth.controller';
import { requireAuth } from './middlewares/auth.middleware';
import { setDefaultResultOrder } from 'node:dns';

// Fix Node.js fetch failing on some networks with IPv6 for Google APIs
setDefaultResultOrder('ipv4first');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Configure middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // required for cookies
}));
app.use(express.json());
app.use(cookieParser());

// Configure Multer for in-memory uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Routes
// 1. Voice match endpoint
app.post('/api/match-voice', requireAuth, upload.single('audio'), VoiceController.handleAudioMatch);

// 2. Document simplify endpoint
app.post('/api/simplify-document', requireAuth, upload.single('document'), VoiceController.handleDocumentSimplify);

// 3. Chat endpoint
app.post('/api/chat', requireAuth, VoiceController.handleChat);

// 4. Reactive scheme recommendation endpoint
app.post('/api/recommend-schemes', requireAuth, VoiceController.handleRecommendSchemes);

// 5. Reactive document translation endpoint
app.post('/api/translate-markdown', requireAuth, VoiceController.handleTranslateMarkdown);

// 6. Auth endpoints
app.post('/api/auth/signup', AuthController.signup);
app.post('/api/auth/login', AuthController.login);
app.post('/api/auth/logout', AuthController.logout);
app.get('/api/auth/me', AuthController.me);

// Start Server
app.listen(port, () => {
  console.log(`[Yojana-Saathi API] Server is running on port ${port}`);
});
