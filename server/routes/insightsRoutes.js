const express = require("express");
const { generateContent } = require("../services/geminiService");

const router = express.Router();

// Handles POST /api/insights/gemini
router.post("/gemini", async (req, res) => {
  try {
    const { transactions = [], budgets = [] } = req.body;

    // Filter to last 20 transactions to avoid huge payloads
    const recentTx = transactions.slice(0, 20);

    const prompt = `
You are a friendly, encouraging personal finance advisor. 
Analyze the user's recent budget and transaction data:

Transactions:
${JSON.stringify(recentTx, null, 2)}

Budgets:
${JSON.stringify(budgets, null, 2)}

Provide 3 concise, actionable, and formatted bullet points to help them optimize their spending and savings this month. Use Markdown bolding for emphasis.
`;

    const insightsText = await generateContent(prompt);

    return res.status(200).json({
      success: true,
      insights: insightsText,
    });
  } catch (error) {
    console.error("Error generating Gemini insights:", error.message || error);

    // Send 200 with fallback text so frontend doesn't throw uncaught error
    return res.status(200).json({
      success: false,
      insights:
        "Unable to generate AI recommendations right now. Please try clicking 'Refresh' again shortly.",
    });
  }
});

module.exports = router;