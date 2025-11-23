import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HeirInput, CalculationResult } from "../types";
import { Language } from "../utils/translations";

const calculateInheritance = async (
  estateValue: number,
  heirs: HeirInput[],
  language: Language
): Promise<CalculationResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });

  const langName = language === 'ar' ? 'Arabic' : 'English';

  const prompt = `
    Act as an expert Islamic Inheritance Law (Mirath) scholar and mathematician.
    Calculate the inheritance distribution for a total estate value of ${estateValue}.
    
    The heirs present are (Heir Code: Count):
    ${heirs.map((h) => `- ${h.type}: ${h.count}`).join("\n")}
    
    Language Preference: ${langName}
    
    Rules to apply strictly:
    1. Apply standard Sunni Islamic inheritance rules (Faraid).
    2. Handle exclusions (Hajb) correctly.
    3. Handle strict shares (Ashab al-Furud) first.
    4. Handle residuary shares (Asaba) next.
    5. Handle 'Awl (increase in denominator) if shares exceed 1.
    6. Handle Radd (return) if shares are less than 1 and no residuary.
    
    IMPORTANT OUTPUT INSTRUCTIONS:
    - The keys 'heirType', 'description', and 'explanation' MUST be in ${langName}.
    - For 'heirType', use the standard ${langName} term for the relative (e.g., "Son" or "ابن").
    - Ensure strict mathematical accuracy for shareAmount.
    
    Return the result strictly in the specified JSON format.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      shares: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            heirType: { type: Type.STRING, description: `The type of heir in ${langName}` },
            count: { type: Type.NUMBER, description: "Number of heirs of this type" },
            shareFraction: { type: Type.STRING, description: "The fractional share (e.g., '1/8')" },
            sharePercentage: { type: Type.NUMBER, description: "The percentage of the total estate (0-100)" },
            shareAmount: { type: Type.NUMBER, description: "The calculated monetary value" },
            description: { type: Type.STRING, description: `Short reason for this share in ${langName}` },
          },
          required: ["heirType", "count", "shareFraction", "sharePercentage", "shareAmount", "description"],
        },
      },
      totalEstate: { type: Type.NUMBER },
      remainingEstate: { type: Type.NUMBER, description: "Any undistributed amount" },
      explanation: { type: Type.STRING, description: `A summary of the calculation logic applied in ${langName}.` },
    },
    required: ["shares", "totalEstate", "remainingEstate", "explanation"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI");
    }
    
    return JSON.parse(text) as CalculationResult;
  } catch (error) {
    console.error("Inheritance calculation failed", error);
    throw error;
  }
};

export { calculateInheritance };
