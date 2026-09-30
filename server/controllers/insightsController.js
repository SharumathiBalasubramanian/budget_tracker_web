const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { generateSpendingInsights } = require('../utils/spendingInsightsEngine');

// @desc    Generate personalized AI insights from live transaction history
// @route   GET /api/insights
const getInsights = async (req, res, next) => {
  try {
    const now = new Date();
    const currentMonthNum = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const startOfCurrentMonth = new Date(currentYear, currentMonthNum - 1, 1);
    const startOfPrevMonth = new Date(currentYear, currentMonthNum - 2, 1);
    const endOfPrevMonth = new Date(currentYear, currentMonthNum - 1, 0, 23, 59, 59, 999);

    // 1. Current Month Totals
    const currentMonthAgg = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let currentExpense = 0;
    let currentIncome = 0;
    currentMonthAgg.forEach((item) => {
      if (item._id === 'expense') currentExpense = item.total;
      if (item._id === 'income') currentIncome = item.total;
    });

    // 2. Previous Month Totals
    const prevMonthAgg = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let prevExpense = 0;
    prevMonthAgg.forEach((item) => {
      if (item._id === 'expense') prevExpense = item.total;
    });

    // 3. Top Expense Categories This Month
    const topExpenses = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
        },
      },
    ]);

    // 4. Budgets and Progress
    const budgets = await Budget.find({
      user: req.user._id,
      month: currentMonthNum,
      year: currentYear,
    });

    const categorySpendMap = new Map();
    const currentCategoryExpenses = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
    ]);

    currentCategoryExpenses.forEach((c) => categorySpendMap.set(c._id.toLowerCase(), c.total));

    const budgetSnapshots = budgets.map((b) => {
      const spent = categorySpendMap.get(b.category.toLowerCase()) || 0;
      return {
        category: b.category,
        limit: b.monthlyLimit,
        spent,
        percentageUsed: (spent / b.monthlyLimit) * 100,
      };
    });

    const analysisPayload = {
      currentMonth: {
        totalIncome: currentIncome,
        totalExpense: currentExpense,
      },
      previousMonth: {
        totalExpense: prevExpense,
      },
      topExpenses,
      budgets: budgetSnapshots,
    };

    const results = await generateSpendingInsights(analysisPayload);

    res.status(200).json({
      success: true,
      timestamp: new Date(),
      ...results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getInsights };