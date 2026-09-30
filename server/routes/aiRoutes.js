const express = require('express');
const router = express.Router();
const { generateContent } = require('../services/geminiService');

// Handles POST /api/insights/gemini
router.post('/gemini', async (req, res) => {
  try {
    const { transactions, budgets, prompt: userPrompt } = req.body;

    const systemInstruction =
      "You are a smart financial advisor. Analyze the user's budgets and recent transactions, then give concise, actionable tips.";

    const prompt =
      userPrompt ||
      `Here is my current financial status:
- Budgets: ${JSON.stringify(budgets || [])}
- Transactions: ${JSON.stringify(transactions || [])}

Provide 2-3 brief, helpful spending insights or recommendations based on this data.`;

    const reply = await generateContent(prompt, systemInstruction);

    return res.status(200).json({
      success: true,
      insights: reply,
      reply: reply,
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate insights.' });
  }
});

module.exports = router;