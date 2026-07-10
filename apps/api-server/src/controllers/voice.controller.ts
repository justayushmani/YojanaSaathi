import { Request, Response } from 'express';
import { GeminiService } from '../services/gemini.service';
import { QdrantClient } from '@qdrant/js-client-rest';

// Initialize Qdrant Client (Mock or real depending on env)
const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY,
  checkCompatibility: false
});

export class VoiceController {
  /**
   * Intercepts multi-part audio form data, extracts the runtime buffer array, triggers the Gemini Service extraction method, 
   * parses the resulting JSON, runs an vector embedding request, queries the Qdrant instance for matching schemes, 
   * and maps the unified response dataset back to the web view.
   */
  static async handleAudioMatch(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: 'No audio file provided.' });
        return;
      }

      // Step 1: Extract Profile from Audio
      const language = req.body.language || 'English';
      const profileJsonStr = await GeminiService.extractProfileFromAudio(file.buffer, file.mimetype, language);
      
      let profile;
      try {
        profile = JSON.parse(profileJsonStr);
      } catch (parseError) {
        console.error('Failed to parse Gemini output:', profileJsonStr);
        res.status(500).json({ 
          error: 'Could not extract a valid profile from the audio. Please try speaking clearly and providing necessary details.',
          raw: profileJsonStr 
        });
        return;
      }
      
      // Check if profile is completely empty
      const isProfileEmpty = !profile.age && !profile.income && !profile.occupation && !profile.state;

      // Step 2: Use Gemini to recommend schemes based on the profile
      let schemes: any[] = [];
      try {
        if (!isProfileEmpty) {
          schemes = await GeminiService.recommendSchemes(profile, language);
        }
      } catch (geminiError) {
        console.error('Gemini Scheme Recommendation Error:', geminiError);
        // Fallback if Gemini fails
        schemes = [{ 
          title: 'Error Loading Schemes', 
          description: 'Could not fetch personalized recommendations at this time.', 
          matchReason: 'Service Unavailable',
          fullDetails: 'Please try again later or consult your local panchayat office.',
          howToApply: 'N/A',
          documentsRequired: [],
          portalLink: ''
        }];
      }

      // Step 3: Return unified response
      res.status(200).json({
        success: true,
        profile,
        matchedSchemes: schemes
      });

    } catch (error: any) {
      console.error('Error in VoiceController.handleAudioMatch:', error);
      res.status(500).json({
        success: false,
        error: 'An internal error occurred while processing the audio. Details: ' + error.message,
        details: error.message
      });
    }
  }

  /**
   * Controller for Reactive Scheme Translation
   */
  static async handleRecommendSchemes(req: Request, res: Response): Promise<void> {
    try {
      const { profile, language } = req.body;
      if (!profile) {
        res.status(400).json({ error: 'Profile is required.' });
        return;
      }

      const schemes = await GeminiService.recommendSchemes(profile, language || 'English');

      res.status(200).json({
        success: true,
        schemes
      });
    } catch (error: any) {
      console.error('Error in VoiceController.handleRecommendSchemes:', error);
      res.status(500).json({
        success: false,
        error: 'Could not fetch scheme recommendations. Details: ' + error.message,
        details: error.message
      });
    }
  }

  /**
   * Controller for Reactive Markdown Translation
   */
  static async handleTranslateMarkdown(req: Request, res: Response): Promise<void> {
    try {
      const { markdown, language } = req.body;
      if (!markdown) {
        res.status(400).json({ error: 'Markdown text is required.' });
        return;
      }

      const translatedMarkdown = await GeminiService.translateMarkdown(markdown, language || 'English');

      res.status(200).json({
        success: true,
        markdown: translatedMarkdown
      });
    } catch (error: any) {
      console.error('Error in VoiceController.handleTranslateMarkdown:', error);
      res.status(500).json({
        success: false,
        error: 'Could not translate markdown. Details: ' + error.message,
        details: error.message
      });
    }
  }

  /**
   * Controller for Document Simplifier Tab
   */
  static async handleDocumentSimplify(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: 'No document image provided.' });
        return;
      }

      const language = req.body.language || 'English';
      const simplifiedMarkdown = await GeminiService.simplifyDocumentImage(file.buffer, file.mimetype, language);

      res.status(200).json({
        success: true,
        markdown: simplifiedMarkdown
      });

    } catch (error: any) {
      console.error('Error in VoiceController.handleDocumentSimplify:', error);
      res.status(500).json({
        success: false,
        error: 'Could not process the document image. Details: ' + error.message,
        details: error.message
      });
    }
  }

  /**
   * Controller for Saathi AI Chat
   */
  static async handleChat(req: Request, res: Response): Promise<void> {
    try {
      const { message, history = [], language = 'English' } = req.body;
      
      if (!message) {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      const responseText = await GeminiService.processChat(message, history, language);

      res.status(200).json({
        success: true,
        response: responseText
      });

    } catch (error: any) {
      console.error('Error in VoiceController.handleChat:', error);
      res.status(500).json({
        success: false,
        error: 'Could not process chat message. Details: ' + error.message,
        details: error.message
      });
    }
  }
}
