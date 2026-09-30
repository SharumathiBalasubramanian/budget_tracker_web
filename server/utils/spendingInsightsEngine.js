const { GoogleGenAI } = require('@google/genai');

/**
 * Rule-based fallback insight engine
 */
const generateRuleBasedInsights = (data) => {
  const { currentMonth, previousMonth, budgets, topExpenses } = data;
  const insights = [];

  // 1. Overall Month-over-Month Comparison
  if (previousMonth.totalExpense > 0) {
    const diff = currentMonth.totalExpense - previousMonth.totalExpense;
    const pct = ((diff / previousMonth.totalExpense) * 100).toFixed(1);
    if (diff > 0) {
      insights.push({
        type: 'warning',
        title: 'Spending Acceleration',
        message: `Your spending this month is up by ${pct}% compared to last month ($${currentMonth.totalExpense.toFixed(2)} vs $${previousMonth.totalExpense.toFixed(2)}).`,
      });
    } else {
      insights.push({
        type: 'success',
        title: 'Spending Reduced',
        message: `Great discipline! You have spent ${Math.abs(pct)}% less than last month so far.`,
      });
    }
  }

  // 2. Budget Alerts
  budgets.forEach((b) => {
    if (b.percentageUsed >= 100) {
      insights.push({
        type: 'danger',
        title: `Over-Budget: ${b.category}`,
        message: `You have exceeded your ${b.category} budget by $${(b.spent - b.limit).toFixed(2)} (${b.percentageUsed.toFixed(0)}% of $${b.limit}).`,
      });
    } else if (b.percentageUsed >= 80) {
      insights.push({
        type: 'warning',
        title: `Approaching Limit: ${b.category}`,
        message: `You've used ${b.percentageUsed.toFixed(0)}% of your ${b.category} budget ($${b.spent.toFixed(2)} of $${b.limit}). Only $${(b.limit - b.spent).toFixed(2)} remains.`,
      });
    }
  });

  // 3. Top Expense Category Warning
  if (topExpenses.length > 0 && currentMonth.totalExpense > 0) {
    const top = topExpenses[0];
    const topPct = ((top.total / currentMonth.totalExpense) * 100).toFixed(0);
    insights.push({
      type: 'tip',
      title: 'Top Expenditure',
      message: `${top.category} is your highest spending category this month, accounting for ${topPct}% ($${top.total.toFixed(2)}) of total expenses.`,
    });
  }

  // 4. Savings Ratio Insight
  if (currentMonth.totalIncome > 0) {
    const savings = currentMonth.totalIncome - currentMonth.totalExpense;
    const savingsRate = ((savings / currentMonth.totalIncome) * 100).toFixed(0);
    if (savings > 0) {
      insights.push({
        type: 'tip',
        title: 'Savings Potential',
        message: `Your current net savings rate is ${savingsRate}%. Setting aside $${(savings * 0.5).toFixed(2)} into savings will help build your safety net.`,
      });
    } else {
      insights.push({
        type: 'danger',
        title: 'Negative Cashflow',
        message: `Your expenses exceed your income this month by $${Math.abs(savings).toFixed(2)}. Review variable expenses to prevent a deficit.`,
      });
    }
  }

  return {
    source: 'rule-based',
    insights: insights.length > 0 ? insights : [
      {
        type: 'tip',
        title: 'Keep Tracking',
        message: 'Log more daily income and expense transactions to unlock deeper financial insights.',
      }
    ],
  };
};

/**
 * Primary AI generation orchestrator
 */
const generateSpendingInsights = async (analyticalData) => {
  if (!process.env.GEMINI_API_KEY) {
    return generateRuleBasedInsights(analyticalData);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `
You are a personal financial advisor analyzing user transaction data.
Analyze this structured budget and spending data:
${JSON.stringify(analyticalData, null, 2)}

Provide 3 to 5 actionable, personalized, human-readable insights.
Return ONLY valid JSON matching this schema:
[
  {
    "type": "warning" | "danger" | "success" | "tip",
    "title": "Short title (max 5 words)",
    "message": "Concrete observation citing actual numbers, dollar amounts, and categories from the provided data."
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsedInsights = JSON.parse(response.text.trim());
    return {
      source: 'gemini-ai',
      insights: parsedInsights,
    };
  } catch (err) {
    console.error(`[AI Service Fallback triggered]: ${err.message}`);
    return generateRuleBasedInsights(analyticalData);
  }
};

module.exports = { generateSpendingInsights, generateRuleBasedInsights };