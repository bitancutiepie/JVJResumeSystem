import type { ResumeData } from "../types";

/**
 * Service to parse raw resume text and enhance it using Google's Gemini AI.
 * This calls a server-side API route to keep the API key secure.
 */
export const parseAndEnhanceResume = async (rawText: string): Promise<ResumeData> => {
  try {
    const response = await fetch('/api/generate-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rawText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate resume');
    }

    const data = await response.json();
    return data as ResumeData;
  } catch (error: any) {
    console.error('Resume generation error:', error);
    throw new Error(error.message || 'Failed to generate resume. Please try again.');
  }
};