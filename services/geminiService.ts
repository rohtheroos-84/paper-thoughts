import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse } from "../types";

const MOOD_DESCRIPTIONS = `
1. Confused: Questions, "idk", "wtf", "recheck", self-doubt, hesitant language.
2. Confident: Summary tone, "therefore", "key point", "definition", direct structure.
3. Bored: "boring", "useless", "skip", "blah blah", dismissive repetitive words.
4. Alert: "important", "exam question", "remember this", "imp", dense key terms.

Fallback Rules:
- If content-heavy/focused but ambiguous -> Alert.
- Otherwise -> Confused.
`;

export const analyzeNotes = async (text: string): Promise<AnalysisResponse> => {
  // 1. Pre-processing: Split by double newline to ensure we control the chunks
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) {
    return {
      paragraphs: [],
      summary: { confused: 0, confident: 0, bored: 0, alert: 0 },
      studyPlan: { topConfusedIndices: [], topConfidentIndices: [], suggestion: "" },
      tldr: ""
    };
  }

  const apiKey = process.env.API_KEY;
  console.log("API Key exists:", !!apiKey);
  console.log("API Key length:", apiKey?.length);
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      paragraphs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            mood: { type: Type.STRING, enum: ["confused", "confident", "bored", "alert"] },
            importance: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["text", "mood", "importance", "keywords"],
        },
      },
      summary: {
        type: Type.OBJECT,
        properties: {
          confused: { type: Type.INTEGER },
          confident: { type: Type.INTEGER },
          bored: { type: Type.INTEGER },
          alert: { type: Type.INTEGER },
        },
        required: ["confused", "confident", "bored", "alert"],
      },
      studyPlan: {
         type: Type.OBJECT,
         properties: {
            topConfusedIndices: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: "Indices of the top 2-3 most confused paragraphs." },
            topConfidentIndices: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: "Indices of 1-2 confident/alert paragraphs." },
            suggestion: { type: Type.STRING, description: "One sentence study suggestion." }
         }
      },
      tldr: { 
        type: Type.STRING, 
        description: "A concise 2-3 sentence summary (TL;DR) of the entire lecture note content. Capture the main topics and key takeaways." 
      }
    },
    required: ["paragraphs", "summary", "studyPlan", "tldr"],
  };

  const prompt = `
    Analyze the following list of lecture note paragraphs.
    
    Tasks:
    1. Assign one mood per paragraph: confused, confident, bored, or alert.
    2. Assign importance level: Low, Medium, High.
    3. Extract up to 4 keywords/phrases per paragraph.
    4. Create a study plan summarizing the most critical areas.
    5. Generate a concise TL;DR (2-3 sentences) summarizing the main topics and key takeaways of this entire lecture.
    
    Mood Rules:
    ${MOOD_DESCRIPTIONS}

    Return strict JSON.
    
    Paragraphs:
    ${JSON.stringify(paragraphs)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const parsed = JSON.parse(resultText) as Omit<AnalysisResponse, 'paragraphs'> & { paragraphs: any[] };
    
    // Inject unique IDs for React keys/DnD
    const processedParagraphs = parsed.paragraphs.map((p, index) => ({
        ...p,
        id: `para-${Date.now()}-${index}`
    }));

    return {
        ...parsed,
        paragraphs: processedParagraphs
    };

  } catch (error) {
    console.error("AI Analysis Error:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error) {
      throw new Error(`Failed to analyze notes: ${error.message}`);
    }
    throw error;
  }
};