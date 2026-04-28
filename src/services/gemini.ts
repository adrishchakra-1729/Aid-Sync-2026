import { GoogleGenAI, Type } from "@google/genai";
import { Need, Volunteer } from "@/src/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function matchVolunteerWithNeed(need: Need, volunteers: Volunteer[]) {
  const prompt = `
    Task: Match the most suitable volunteer to a community crisis report.
    
    Need Details:
    - Title: ${need.title}
    - Description: ${need.description}
    - Location: ${need.location}
    - Urgency: ${need.urgency}
    
    Available Volunteers:
    ${volunteers.map((v, i) => `${i + 1}. Name: ${v.displayName}, Bio: ${v.bio}, Skills: ${v.skills.join(", ")}`).join("\n")}
    
    Instructions:
    1. Analyze the need requirements and compare them with volunteer skills and profiles.
    2. Select the single best volunteer.
    3. Provide a clear reasoning for why they are the best fit.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bestVolunteerId: { type: Type.STRING, description: "The ID of the volunteer (index + 1 from list)" },
            bestVolunteerName: { type: Type.STRING },
            reasoning: { type: Type.STRING, description: "Why this person was chosen" }
          },
          required: ["bestVolunteerId", "bestVolunteerName", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Match Error:", error);
    throw error;
  }
}
