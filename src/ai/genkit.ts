import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GOOGLE_GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  const message = `
ERROR: GOOGLE_GEMINI_API_KEY or GOOGLE_API_KEY is not set in your environment.
Genkit AI features require this key to function.

Instructions:
1. Obtain an API key from Google AI Studio (https://aistudio.google.com/app/apikey).
2. For local development, create a .env.local file in the root of your project.
3. Add the following line to your .env.local file, replacing with your actual key:
   GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
4. For deployment, ensure this environment variable (GOOGLE_GEMINI_API_KEY) is set in your hosting environment's settings.

The application will not start correctly until this is configured.
  `;
  // This error will stop the application/Genkit from starting if the key is missing.
  throw new Error(message);
}

export const ai = genkit({
  plugins: [googleAI()],
});
