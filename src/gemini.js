import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCetoYZ9jnuCclU1fQWzlWdTlOKtIvRsu4" 
});

async function run(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",  
     contents: `You are a helpful assistant your name is zara .maximum  2 lines 
User prompt: ${prompt}`,
      generationConfig: {
        maxOutputTokens: 50,  
      }
  });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}

export default run;