import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function geminiTest() {
  // Use the appropriate model
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      // Add more safety settings if needed
    ],
  });

  const prompt = "List a few popular cookie recipes, and include the amounts of ingredients.";

  const result = await model.generateContent(prompt);

  const response = await result.response;
  const text = await response.text();
  console.log("Response:\n", text);
  return response;
}
