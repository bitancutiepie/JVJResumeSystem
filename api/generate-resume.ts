import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API Key not configured on server' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { rawText } = await req.json();

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `
        You are an expert JSON data extractor and professional resume architect. Your primary goal is to **ALWAYS** output a **VALID JSON object** that strictly adheres to the provided schema.

        Your task is to analyze the raw, potentially messy or unformatted resume text provided by the user and extract all relevant information into the specified JSON format.

        CRITICAL INSTRUCTIONS:
        1. **Preservation:** DO NOT skip or omit any work experience, education, or reference mentioned in the raw text. Ensure every entry is accounted for.
        2. **Accuracy:** Correct typos and grammatical errors. Ensure names are capitalized correctly.
        3. **Categorization:** 
           - If you see "Housekeeping NC II" or similar certifications, include them under the 'education' array as a 'degree'.
           - Separate work history into the 'experience' array.
           - Separate schools/certifications into the 'education' array.
           - Qualifications should be split into individual strings in the 'skills' array.
        4. **Dates:** Format dates consistently (e.g., "Oct 2019 - Dec 2019", "2008 - 2011").
        5. **Objective:** Generate a short, compelling professional objective based on the person's history.
        6. **Description Formatting:** For 'experience.description', if bullet points are detected, ensure they are represented as a single string where each bullet point is separated by a newline character.
        7. **Response Format:** Return ONLY the JSON object. No preamble, no markdown blocks.
        8. **IDs:** Generate stable, unique IDs for each list item (e.g., "exp-0", "edu-0", "ref-0").

        Output Schema must match the provided structure exactly.
      `,
        });

        const response = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: rawText }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        personalInfo: {
                            type: SchemaType.OBJECT,
                            properties: {
                                name: { type: SchemaType.STRING },
                                email: { type: SchemaType.STRING },
                                phone: { type: SchemaType.STRING },
                                address: { type: SchemaType.STRING },
                            },
                            required: ["name", "email", "phone", "address"],
                        },
                        objective: { type: SchemaType.STRING },
                        experience: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    id: { type: SchemaType.STRING },
                                    title: { type: SchemaType.STRING },
                                    company: { type: SchemaType.STRING },
                                    location: { type: SchemaType.STRING },
                                    dates: { type: SchemaType.STRING },
                                    description: { type: SchemaType.STRING },
                                },
                                required: ["id", "title", "company", "dates"],
                            },
                        },
                        education: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    id: { type: SchemaType.STRING },
                                    school: { type: SchemaType.STRING },
                                    degree: { type: SchemaType.STRING },
                                    dates: { type: SchemaType.STRING },
                                    location: { type: SchemaType.STRING },
                                },
                                required: ["id", "school", "degree", "dates"],
                            },
                        },
                        skills: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING },
                        },
                        references: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    id: { type: SchemaType.STRING },
                                    name: { type: SchemaType.STRING },
                                    contact: { type: SchemaType.STRING },
                                    relation: { type: SchemaType.STRING },
                                },
                                required: ["id", "name", "contact"],
                            },
                        },
                    },
                    required: ["personalInfo", "objective", "experience", "education", "skills", "references"],
                },
            },
        });

        const textResponse = response.response.text();
        const parsedData = JSON.parse(textResponse);

        // Ensure all required arrays exist
        parsedData.experience = Array.isArray(parsedData.experience) ? parsedData.experience : [];
        parsedData.education = Array.isArray(parsedData.education) ? parsedData.education : [];
        parsedData.skills = Array.isArray(parsedData.skills) ? parsedData.skills : [];
        parsedData.references = Array.isArray(parsedData.references) ? parsedData.references : [];

        // Map unique IDs if missing
        parsedData.experience = parsedData.experience.map((e: any, i: number) => ({ ...e, id: e.id || `exp-${i}` }));
        parsedData.education = parsedData.education.map((e: any, i: number) => ({ ...e, id: e.id || `edu-${i}` }));
        parsedData.references = parsedData.references.map((e: any, i: number) => ({ ...e, id: e.id || `ref-${i}` }));

        return new Response(JSON.stringify(parsedData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Failed to generate resume' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
