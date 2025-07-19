import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function geminiTest(jobDesc: string) {
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

  const prompt = `
  Based on the following job description, write a **concise English summary** with the following structure. Make sure you don't leave out any information:
  
  [Main Responsibilities]
  - {responsibility 1}
  - {responsibility 2}
  ...
  
  [Preferred Qualifications and Benefits]
  - {qualification or benefit 1}
  - {qualification or benefit 2}
  ...
  
  Job Description (in Korean):
  "${jobDesc}"`


  const result = await model.generateContent(prompt);

  const response = await result.response;
  const text = await response.text();
  console.log("Response:\n", text);
  return text;
}
