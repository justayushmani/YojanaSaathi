import { GoogleGenerativeAI, Part, Content } from '@google/generative-ai';

export class GeminiService {
  /**
   * Executes a given model operation with an automatic fallback mechanism across multiple API keys.
   */
  private static async executeWithFallback<T>(operation: (model: any) => Promise<T>): Promise<T> {
    const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
    const keys = rawKeys.split(",").map(k => k.trim()).filter(Boolean);
    
    if (keys.length === 0) {
      throw new Error("No GEMINI_API_KEYS provided in .env");
    }

    let lastError: any;

    for (let i = 0; i < keys.length; i++) {
      try {
        const genAI = new GoogleGenerativeAI(keys[i]);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); 
        return await operation(model);
      } catch (error: any) {
        console.warn(`[API Fallback] Key ${i + 1} failed: ${error.message}`);
        lastError = error;
        // If it's a structural error (e.g., bad request), we still try the next key just in case it's an account restriction issue.
      }
    }
    
    throw new Error(`All API keys exhausted. Last error: ${lastError?.message}`);
  }

  /**
   * Transmits raw audio bytes straight to Gemini using system instructions to output a clean, standardized JSON format.
   */
  static async extractProfileFromAudio(audioBuffer: Buffer, mimeType: string, language: string = 'English'): Promise<string> {
    const audioPart: Part = {
      inlineData: {
        data: audioBuffer.toString('base64'),
        mimeType
      }
    };

    const prompt = `
      You are a precise data extraction assistant.
      Listen to the following audio and extract a profile.
      The user prefers to communicate in ${language}.
      Output ONLY a clean, standardized JSON format containing exactly the following keys, with no additional text or formatting:
      - age (number or null)
      - income (number or null)
      - state (string or null)
      - occupation (string or null)
      - category (string or null)
      - original_language (string or null)
    `;

    return this.executeWithFallback(async (model) => {
      const result = await model.generateContent([prompt, audioPart]);
      const response = await result.response;
      let text = response.text();
      
      // Clean markdown formatting if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return text;
    });
  }

  /**
   * Ingests complex legal or administrative documents, processes text alignment rules, and outputs a 3-bullet point markdown summary.
   */
  static async simplifyDocumentImage(imageBuffer: Buffer, mimeType: string, language: string = 'English'): Promise<string> {
    const imagePart: Part = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType
      }
    };

    const prompt = `
      You are an AI civic literacy assistant for YojanaSaathi.
      Review the attached legal notice, administrative document, or certificate.
      You MUST respond entirely in the ${language} language.
      You must output exactly a 3-section markdown summary outlining:
      
      ### Summary
      [Brief explanation of the document]
      
      ### Eligibility Criteria
      [List of key conditions or requirements found]
      
      ### Potential Red Flags / Missing Documents
      [Any missing items or warnings]
      
      At the end of your response, you MUST append the following legal disclaimer EXACTLY as written (translated to ${language} if appropriate):
      
      > **Disclaimer:** I am an AI civic literacy assistant, not a lawyer. This information is for educational purposes and does not constitute legal advice. Please consult a qualified professional for your specific situation.
    `;

    return this.executeWithFallback(async (model) => {
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    });
  }

  /**
   * Processes a chat message for Saathi AI Chat.
   */
  static async processChat(message: string, history: any[], language: string = 'English'): Promise<string> {
    // Map history to GoogleGenerativeAI format
    const contents: Content[] = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    // Add the system context instruction to the current message
    const prompt = `
      [SYSTEM CONTEXT: You are Saathi, a helpful AI welfare companion for the YojanaSaathi platform. 
      You help citizens of India understand government schemes (Yojanas), their eligibility, and required documents. 
      Keep your answers brief, empathetic, and strictly respond in ${language}.]
      
      User Message: ${message}
    `;
    
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    return this.executeWithFallback(async (model) => {
      const result = await model.generateContent({ contents });
      const response = await result.response;
      return response.text();
    });
  }
  /**
   * Recommends specific government schemes based on the extracted profile.
   */
  static async recommendSchemes(profile: any, language: string = 'English'): Promise<any[]> {
    const prompt = `
      You are an expert on Indian Government Schemes (Yojanas) for YojanaSaathi.
      Recommend 2-3 specific government schemes for a citizen with this profile:
      Age: ${profile.age || 'Unknown'}
      Income: ${profile.income || 'Unknown'}
      Occupation: ${profile.occupation || 'Unknown'}
      State: ${profile.state || 'Unknown'}

      Output ONLY a JSON array of objects, with NO markdown formatting (do not include \`\`\`json), strictly adhering to this schema:
      [
        {
          "title": "Scheme Name",
          "description": "Short 1 sentence summary",
          "matchReason": "Why this matches the user",
          "fullDetails": "A paragraph explaining the scheme in detail",
          "howToApply": "A step-by-step guide on how to apply",
          "documentsRequired": ["Doc 1", "Doc 2"],
          "portalLink": "URL to official government website"
        }
      ]
      The output MUST be written entirely in the ${language} language.
    `;
    
    return this.executeWithFallback(async (model) => {
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse Gemini JSON output for schemes:", text);
        return [];
      }
    });
  }

  /**
   * Translates an existing markdown document to the target language.
   */
  static async translateMarkdown(markdown: string, language: string): Promise<string> {
    const prompt = `
      Translate the following markdown document into ${language}.
      You MUST preserve all markdown formatting (headers, lists, bolding, blockquotes) exactly as they are.
      Do not add any new conversational text, just return the translated markdown.
      
      MARKDOWN TO TRANSLATE:
      ${markdown}
    `;

    return this.executeWithFallback(async (model) => {
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      return response.text();
    });
  }
}
