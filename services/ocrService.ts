import { GoogleGenAI } from "@google/genai";

export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    const mimeType = imageFile.type;

    const prompt = `Extract all visible text from this image. This appears to be handwritten or typed lecture notes. 
    
    Instructions:
    - Transcribe ALL text you can see, maintaining the original structure and formatting as much as possible
    - Preserve paragraph breaks and line breaks
    - If there are any diagrams or equations, describe them in [brackets]
    - If text is unclear, make your best guess and mark it with (?)
    - Output only the extracted text, no additional commentary
    
    Return the raw text content:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        temperature: 0.1,
      },
    });

    const extractedText = response.text;
    if (!extractedText) {
      throw new Error("No text extracted from image");
    }

    return extractedText.trim();
  } catch (error) {
    console.error("OCR Error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract text from image: ${error.message}`);
    }
    throw error;
  }
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
