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
          description: "A short, clear, and motivational notification message for this task, adhering to the user's requested tone. It should be an effective reminder."
        }
      },
      required: ["time", "task", "category", "duration", "notificationText"]
    }
};


const createPrompt = (userInput: string, specifications: string, tone: string): string => {
  return `You are an AI assistant named 'MOM' (Manager of Moments). Your role is to be a neutral, efficient, and motivating personal wellness coach for a student. Your goal is to create a daily plan that integrates productivity, physical movement, and mental wellness.

  User's input (syllabus, tasks, goals):
  ---
  ${userInput}
  ---

  Additional Specifications from the user (e.g., specific chapters, meeting times, constraints):
  ---
  ${specifications || 'None provided.'}
  ---
  
  Based on the user's input and specifications, create a structured daily schedule. Follow these rules:
  1.  Start the day around 9:00 AM.
  2.  Incorporate all user-provided specifications, such as fixed meeting times or specific tasks.
  3.  Schedule focused work blocks ('Productivity') for 60-90 minutes each.
  4.  After each focused work block, schedule a 5-10 minute break.
  5.  Alternate breaks between 'Physical' activities (e.g., 'Gentle neck stretches', 'Walk around and get water') and 'Mental' wellness activities (e.g., 'Mindful breathing for 3 minutes', 'Listen to a favorite calm song').
  6.  Include a longer lunch break.
  7.  The user has requested the notification tone to be: **'${tone}'**.
  8.  For each task, create a 'notificationText' that is clear, concise, and serves as an effective reminder, strictly adhering to the requested tone.
      - If tone is 'Neutral & Professional', be direct and clear (e.g., 'Scheduled block for Math assignment begins now.').
      - If tone is 'Firm & Motivating', be encouraging but direct (e.g., 'Let's go! Time to crush that Math assignment. You've got this.').
      - If tone is 'Gentle & Encouraging', be soft and supportive (e.g., 'It's time for your math assignment. Remember to be kind to yourself as you work.').
  9.  Output *only* a valid JSON array of objects that strictly adheres to the provided schema. Do not include markdown formatting or any text outside the JSON array.`;
};

export const generatePlan = async (userInput: string, specifications: string, tone: string): Promise<PlanItem[]> => {
  const prompt = createPrompt(userInput, specifications, tone);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: planSchema,
        temperature: 0.6,
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