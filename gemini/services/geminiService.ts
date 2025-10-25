import { GoogleGenAI, Type } from '@google/genai';
import { PlanItem, PlanCategory } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const planSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        time: {
          type: Type.STRING,
          description: "The start time for the task, e.g., '9:00 AM'."
        },
        task: {
          type: Type.STRING,
          description: "A short, actionable description of the task."
        },
        category: {
          type: Type.STRING,
          enum: [PlanCategory.PRODUCTIVITY, PlanCategory.PHYSICAL, PlanCategory.MENTAL],
          description: "The category of the task."
        },
        duration: {
          type: Type.NUMBER,
          description: "The duration of the task in minutes."
        },
        notificationText: {
          type: Type.STRING,
          description: "A short, clear, and motivational notification message for this task. It should be an effective reminder. e.g., 'Time for a 5-minute stretch to reset your focus.' or 'Deep work block: Time to tackle that assignment.'"
        }
      },
      required: ["time", "task", "category", "duration", "notificationText"]
    }
};


const createPrompt = (userInput: string): string => {
  return `You are an AI assistant named 'MOM' (Manager of Moments). Your role is to be a neutral, efficient, and motivating personal wellness coach for a student. Your goal is to create a daily plan that integrates productivity, physical movement, and mental wellness.

  User's input (syllabus, tasks, goals):
  ---
  ${userInput}
  ---
  
  Based on the user's input, create a structured daily schedule. Follow these rules:
  1.  Start the day around 9:00 AM.
  2.  Schedule focused work blocks ('Productivity') for 60-90 minutes each.
  3.  After each focused work block, schedule a 5-10 minute break.
  4.  Alternate breaks between 'Physical' activities (e.g., 'Gentle neck stretches', 'Walk around and get water') and 'Mental' wellness activities (e.g., 'Mindful breathing for 3 minutes', 'Listen to a favorite calm song').
  5.  Include a longer lunch break.
  6.  Your tone should be clear, professional, and supportive. Use motivational language strategically to encourage focus and well-being at key moments.
  7.  For each task, create a 'notificationText' that is clear, concise, and serves as an effective reminder.
  8.  Output *only* a valid JSON array of objects that strictly adheres to the provided schema. Do not include markdown formatting or any text outside the JSON array.`;
};

export const generatePlan = async (userInput: string): Promise<PlanItem[]> => {
  const prompt = createPrompt(userInput);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: planSchema,
        temperature: 0.6, // Slightly lowered for more consistent, neutral tone
      }
    });
    
    const jsonText = response.text.trim();
    const plan = JSON.parse(jsonText);
    
    // Basic validation to ensure we have an array
    if (!Array.isArray(plan)) {
      throw new Error("API did not return a valid plan array.");
    }

    return plan as PlanItem[];
  } catch (error) {
    console.error("Error generating plan with Gemini:", error);
    throw new Error("Failed to parse or receive a valid plan from the AI.");
  }
};