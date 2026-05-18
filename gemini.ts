export const MODELS = {
  gemini: "gemini-3-flash-preview",
};

interface AIResponse {
  text: string;
  sources: { uri: string; title: string }[];
}

/**
 * Generate Content via Backend Proxy
 */
async function getAIResponse(prompt: string, options: { json?: boolean; system?: string } = {}) {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        options,
        model: MODELS.gemini
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server responded with ${response.status}`);
    }

    const data: AIResponse = await response.json();
    return data.text || "";
  } catch (error: any) {
    console.error("Frontend AI Error:", error);
    throw error;
  }
}

export async function generateStudyPlan(topic: string) {
  const prompt = `Generate a detailed study plan for: ${topic}. Format as a JSON array of objects with 'title' and 'description'.`;
  const response = await getAIResponse(prompt, { json: true });
  try {
    return JSON.parse(response);
  } catch {
    return [];
  }
}

export async function explainConcept(concept: string, level: "eli5" | "standard" | "expert" = "standard") {
  const instruction = level === "eli5" ? "Explain like I'm 5." : level === "expert" ? "Explain at a university level with technical details." : "Explain clearly and concisely.";
  return getAIResponse(`${instruction} Concept: ${concept}`);
}

export async function generateFlashcards(text: string) {
  const prompt = `Generate 5 flashcards from this text: "${text}". Return a JSON array of objects with 'question' and 'answer' fields.`;
  const response = await getAIResponse(prompt, { json: true });
  try {
    return JSON.parse(response);
  } catch {
    return [];
  }
}
