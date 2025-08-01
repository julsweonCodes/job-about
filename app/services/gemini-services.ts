import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { JobPostPayload } from "@/types/employer";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function geminiTest(payload: JobPostPayload) {
  // Use the appropriate model
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
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
  Based on the following business information and job description, write a **concise and conversational English summary** with two following structure. 
  Make sure you don't leave out any information. Utilize given business information BUT do not repeat the information in the result:
  ** key names should be struct1 and struct2.**
  
  ##struct1
  [Main Responsibilities]
  - {responsibility 1}
  - {responsibility 2}
  ...
  
  [Preferred Qualifications and Benefits]
  - {qualification or benefit 1}
  - {qualification or benefit 2}
  ...
  
  ##struct2
  Write 'struct1' in full sentences.
  
  Business Information: jobTitle: "${payload.jobTitle}", jobType: "${payload.selectedJobType}", workType: ${payload.selectedWorkType}",  
  requiredSkills: "${payload.requiredSkills}", requiredWorkStyles: "${payload.requiredWorkStyles}",
  wage: "${payload.wage}", languageLevel: "${payload.languageLevel}"
  Job Description (in Korean):
  "${payload.jobDescription}"`


  const result = await model.generateContent(prompt);

  const response = await result.response;
  const text = await response.text();

  try {
    return text;
    // const parsed = JSON.parse(text);
    // return parsed;
  } catch (e) {
    console.error("Gemini response is not valid JSON:", text);
    throw e;
  }
}
