import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const apiKey = process.env.API_KEY;

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: apiKey });

export const parseAndEnhanceResume = async (rawText: string): Promise<ResumeData> => {
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const modelId = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an expert JSON data extractor and professional resume architect. Your primary goal is to **ALWAYS** output a **VALID JSON object** that strictly adheres to the provided schema.

    Your task is to analyze the raw, potentially messy or unformatted resume text provided by the user and extract all relevant information into the specified JSON format.

    CRITICAL INSTRUCTIONS:
    1. **Preservation:** DO NOT skip or omit any work experience, education, or reference mentioned in the raw text. Ensure every entry is accounted for.
    2. **Accuracy:** Correct typos and grammatical errors (e.g., 'acadamics' -> 'Academics', 'CAtmon' -> 'Catmon', 'ornganize' -> 'organized', 'Domesitc' -> 'Domestic'). Ensure names are capitalized correctly (e.g., 'Shermine Leyma Moena').
    3. **Categorization:** 
       - If you see "Housekeeping NC II" or similar certifications, include them under the 'education' array as a 'degree'.
       - Separate work history into the 'experience' array.
       - Separate schools/certifications into the 'education' array.
       - Qualifications should be split into individual strings in the 'skills' array.
    4. **Dates:** Format dates consistently (e.g., "Oct 2019 - Dec 2019", "2008 - 2011").
    5. **Objective:** Generate a short, compelling professional objective based on the person's history (Domestic Helper, Housekeeping, etc.) if requested or if it's currently generic/placeholder. Ensure it's concise and impactful.
    6. **Description Formatting:** For 'experience.description', if bullet points are detected, ensure they are represented as a single string where each bullet point is separated by a newline character. If no specific bullet points are given, a brief summary of responsibilities can be generated based on the role.
    7. **Response Format:** Return ONLY the JSON object. No preamble, no markdown blocks.
    8. **IDs:** Generate stable, unique IDs for each list item (e.g., "exp-0", "edu-0", "ref-0").

    Output Schema must match the provided structure exactly.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: rawText,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalInfo: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              address: { type: Type.STRING },
            },
            required: ["name", "email", "phone", "address"],
          },
          objective: { type: Type.STRING },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                dates: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["id", "title", "company", "dates"],
            },
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                school: { type: Type.STRING },
                degree: { type: Type.STRING },
                dates: { type: Type.STRING },
                location: { type: Type.STRING },
              },
              required: ["id", "school", "degree", "dates"],
            },
          },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          references: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                contact: { type: Type.STRING },
                relation: { type: Type.STRING },
              },
              required: ["id", "name", "contact"],
            },
          },
        },
        required: ["personalInfo", "objective", "experience", "education", "skills", "references"],
      },
    },
  });

  const textResponse = response.text;
  if (!textResponse) {
    throw new Error("Failed to generate resume data: The AI response was empty.");
  }

  try {
    const parsedData = JSON.parse(textResponse) as ResumeData;
    
    // Ensure all required arrays exist
    parsedData.experience = Array.isArray(parsedData.experience) ? parsedData.experience : [];
    parsedData.education = Array.isArray(parsedData.education) ? parsedData.education : [];
    parsedData.skills = Array.isArray(parsedData.skills) ? parsedData.skills : [];
    parsedData.references = Array.isArray(parsedData.references) ? parsedData.references : [];

    // Map unique IDs if missing
    parsedData.experience = parsedData.experience.map((e, i) => ({ ...e, id: e.id || `exp-${i}` }));
    parsedData.education = parsedData.education.map((e, i) => ({ ...e, id: e.id || `edu-${i}` }));
    parsedData.references = parsedData.references.map((e, i) => ({ ...e, id: e.id || `ref-${i}` }));
    
    return parsedData;
  } catch (e: any) {
    console.error("JSON Parsing Error:", e);
    throw new Error(`The AI response was not valid JSON. Details: ${e.message}`);
  }
};