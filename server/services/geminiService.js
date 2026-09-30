const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateContent = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("[Gemini] Error:", error.message);

    if (error.status === 429) {
      return "AI service quota exceeded. Please try again later.";
    }

    if (error.status === 503) {
      return "AI service is temporarily unavailable. Please try again later.";
    }

    return "Unable to generate AI response.";
  }
};

module.exports = { generateContent };