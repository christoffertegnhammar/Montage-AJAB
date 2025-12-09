import { GoogleGenAI, Type } from "@google/genai";
import { Job, RiskItem } from "../types";

// Initialize the API client using the environment variable exclusively.
// We assume process.env.API_KEY is available and valid as per strict guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRiskSuggestions = async (job: Job): Promise<RiskItem[]> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing. Please set API_KEY in environment variables.");
    return [];
  }

  try {
    const prompt = `
      Du är en säkerhetsexpert för portmontörer och industriarbete.
      Baserat på följande jobb-beskrivning, identifiera 3-5 specifika risker och förebyggande åtgärder.
      
      Jobb: ${job.description}
      Adress/Miljö: ${job.address}

      Returnera svaret strikt som JSON enligt schemat. Fokusera på specifika risker för just detta jobb (t.ex. höga höjder, trafik, kemikalier, el).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: "Kategori t.ex. 'Fallrisk', 'El', 'Omgivning'" },
              hazard: { type: Type.STRING, description: "Beskrivning av risken" },
              measure: { type: Type.STRING, description: "Förebyggande åtgärd" }
            },
            required: ["category", "hazard", "measure"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Transform to internal RiskItem type
    return rawData.map((item: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      category: item.category,
      hazard: item.hazard,
      measure: item.measure,
      checked: true, // Auto-check suggestions
      isAiSuggested: true
    }));

  } catch (error) {
    console.error("Error generating risk suggestions:", error);
    return [];
  }
};