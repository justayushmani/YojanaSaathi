import { GoogleGenerativeAI, Part } from '@google/generative-ai';

// Initialize the SDK with the environment variable
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export class GeminiService {
  /**
   * Transmits raw audio bytes straight to Gemini using system instructions to output a clean, standardized JSON format.
   * @param audioBuffer The raw audio buffer.
   * @param mimeType The mime type of the audio.
   * @returns A promise that resolves to a JSON string containing the profile.
   */
  static async extractProfileFromAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const audioPart: Part = {
      inlineData: {
        data: audioBuffer.toString('base64'),
        mimeType
      }
    };

    const prompt = `
      You are a precise data extraction assistant.
      Listen to the following audio and extract a profile.
      Output ONLY a clean, standardized JSON format containing exactly the following keys, with no additional text or formatting:
      - age (number or null)
      - income (number or null)
      - state (string or null)
      - occupation (string or null)
      - category (string or null)
      - original_language (string or null)
    `;

    try {
      const result = await model.generateContent([prompt, audioPart]);
      const response = await result.response;
      let text = response.text();
      
      // Clean markdown formatting if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return text;
    } catch (error) {
      console.error('Error in extractProfileFromAudio:', error);
      throw new Error('Failed to extract profile from audio');
    }
  }

  /**
   * Ingests complex legal or administrative documents, processes text alignment rules, and outputs a 3-bullet point markdown summary.
   * @param imageBuffer The raw image buffer.
   * @param mimeType The mime type of the image (e.g. image/png, image/jpeg).
   * @returns A promise that resolves to the simplified document output.
   */
  static async simplifyDocumentImage(imageBuffer: Buffer, mimeType: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const imagePart: Part = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType
      }
    };

    const prompt = `
      You are an AI civic literacy assistant for Jan-Sahayak.
      Review the attached legal notice, FIR record, or administrative document.
      You must output exactly a 3-bullet point markdown summary outlining:
      - What happened
      - User rights
      - Exact next action steps
      
      At the end of your response, you MUST append the following legal disclaimer EXACTLY as written:
      
      > **Disclaimer:** I am an AI civic literacy assistant, not a lawyer. This information is for educational purposes and does not constitute legal advice. Please consult a qualified legal professional for your specific situation.
    `;

    try {
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in simplifyDocumentImage:', error);
      throw new Error('Failed to simplify document image');
    }
  }
}
