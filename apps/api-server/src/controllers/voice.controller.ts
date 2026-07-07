import { Request, Response } from 'express';
import { GeminiService } from '../services/gemini.service';
import { QdrantClient } from '@qdrant/js-client-rest';

// Initialize Qdrant Client (Mock or real depending on env)
const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY
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
      const profileJsonStr = await GeminiService.extractProfileFromAudio(file.buffer, file.mimetype);
      
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

      // Step 2: In a real system, we would embed this profile to a vector. 
      // For this architecture, we will mock the embedding or query Qdrant directly with filters.
      // We simulate querying Qdrant for matching schemes.
      let schemes = [];
      try {
        // Mock query - in production, we would convert the profile to a vector first
        // const vector = await getEmbedding(JSON.stringify(profile));
        // const searchResult = await qdrantClient.search('schemes', { vector, limit: 3 });
        
        // Simulating matching schemes based on extracted profile
        schemes = [
          {
            id: 'scheme_1',
            title: 'PM Kisan Samman Nidhi',
            description: 'Income support of Rs.6000/- per year in three equal installments to all land holding farmer families.',
            matchReason: `Matched occupation: ${profile.occupation || 'Farmer'}`
          },
          {
            id: 'scheme_2',
            title: 'Ayushman Bharat Yojana',
            description: 'Health insurance coverage of Rs.5 lakhs per family per year for secondary and tertiary care hospitalization.',
            matchReason: `Matched income profile: ${profile.income || 'Low Income'}`
          }
        ];
      } catch (qdrantError) {
        console.error('Qdrant Query Error:', qdrantError);
        // Fallback if Qdrant fails
        schemes = [{ id: 'error', title: 'Could not load schemes', description: 'Database unavailable' }];
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
        error: 'An internal error occurred while processing the audio.',
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

      const simplifiedMarkdown = await GeminiService.simplifyDocumentImage(file.buffer, file.mimetype);

      res.status(200).json({
        success: true,
        markdown: simplifiedMarkdown
      });

    } catch (error: any) {
      console.error('Error in VoiceController.handleDocumentSimplify:', error);
      res.status(500).json({
        success: false,
        error: 'Could not process the document image.',
        details: error.message
      });
    }
  }
}
