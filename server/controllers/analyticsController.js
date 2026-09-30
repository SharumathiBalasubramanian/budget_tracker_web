const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

// @desc    Category-wise spend breakdown for pie chart
// @route   GET /api/analytics/category-breakdown
const getCategoryBreakdown = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const matchFilter = {
      user: req.user._id,
      type: 'expense',
    };

    if (startDate || endDate) {
      matchFilter.date = {};
      if (startDate) matchFilter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchFilter.date.$lte = end;
      }
    }

    const breakdown = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalAmount: { $round: ['$totalAmount', 2] },
          count: 1,
        },
      },
    ]);

    const totalExpense = breakdown.reduce((acc, curr) => acc + curr.totalAmount, 0);

    const breakdownWithPercentage = breakdown.map((item) => ({
      ...item,
      percentage: totalExpense > 0 ? Number(((item.totalAmount / totalExpense) * 100).toFixed(1)) : 0,
    }));

    res.status(200).json({
      success: true,
      totalExpense: Number(totalExpense.toFixed(2)),
      data: breakdownWithPercentage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Month-on-month income/expense trends (past 6-12 months)
// @route   GET /api/analytics/monthly-trends
const getMonthlyTrends = async (req, res, next) => {
  try {
    const monthsBack = parseInt(req.query.months, 10) || 6;
    const sinceDate = new Date();
    sinceDate.setMonth(sinceDate.getMonth() - monthsBack);
    sinceDate.setDate(1);
    sinceDate.setHours(0, 0, 0, 0);

    const trends = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: sinceDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: { year: '$_id.year', month: '$_id.month' },
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0],
            },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          period: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: [
                  { $lt: ['$_id.month', 10] },
                  { $concat: ['0', { $toString: '$_id.month' }] },
                  { $toString: '$_id.month' },
                ],
              },
            ],
          },
          income: { $round: ['$income', 2] },
          expense: { $round: ['$expense', 2] },
          netSavings: { $round: [{ $subtract: ['$income', '$expense'] }, 2] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      monthsTracked: monthsBack,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Income vs Expense totals and running balance
// @route   GET /api/analytics/summary
const getSummary = async (req, res, next) => {
  try {
    const summary = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach((item) => {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpense = item.total;
    });

    const runningBalance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      data: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpense: Number(totalExpense.toFixed(2)),
        runningBalance: Number(runningBalance.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategoryBreakdown, getMonthlyTrends, getSummary };