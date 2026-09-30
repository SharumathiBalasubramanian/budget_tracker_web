const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// Helper to extract numeric limit from different field name variations
const extractLimit = (body) => {
  return (
    body.monthlyLimit ??
    body.budgetLimit ??
    body.limit ??
    body.amount ??
    body.monthly_limit
  );
};

// @desc    Get all budgets for logged-in user (with actual spend calculated)
// @route   GET /api/budgets
const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });

    // Calculate current month's start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Aggregate monthly expense per category for the current user
    const expenses = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          type: 'expense',
          date: { $gte: startOfMonth,$lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: { $toLower: '$category' },
          totalSpent: { $sum: '$amount' },
        },
      },
    ]);

    const expenseMap = {};
    expenses.forEach((item) => {
      expenseMap[item._id] = item.totalSpent;
    });

    const enrichedBudgets = budgets.map((b) => {
      const spent = expenseMap[b.category.toLowerCase().trim()] || 0;
      const remaining = Math.max(0, b.monthlyLimit - spent);
      const percentageUsed = b.monthlyLimit > 0 ? ((spent / b.monthlyLimit) * 100).toFixed(2) : 0;

      return {
        ...b.toObject(),
        spent,
        remaining,
        percentageUsed: Number(percentageUsed),
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedBudgets.length,
      data: enrichedBudgets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update a budget (upsert by category)
// @route   POST /api/budgets
const setBudget = async (req, res, next) => {
  try {
    const category = req.body.category;
    const rawLimit = extractLimit(req.body);

    if (!category || rawLimit === undefined || rawLimit === null || rawLimit === '') {
      return res.status(400).json({
        success: false,
        message: 'Category and monthlyLimit are required.',
      });
    }

    const limitNumber = Number(rawLimit);
    if (isNaN(limitNumber) || limitNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: 'monthlyLimit must be a positive number greater than 0.',
      });
    }

    const trimmedCategory = category.trim();

    // Upsert: updates monthlyLimit if exists for this user & category, otherwise creates new
    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        category: { $regex: new RegExp(`^${trimmedCategory}$`, 'i') },
      },
      {
        $set: {           category: trimmedCategory,           monthlyLimit: limitNumber,         },$setOnInsert: {
          user: req.user._id,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Budget saved successfully.',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single budget by ID
// @route   GET /api/budgets/:id
const getBudgetById = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized access.',
      });
    }

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a budget by ID
// @route   PUT /api/budgets/:id
const updateBudget = async (req, res, next) => {
  try {
    const { category } = req.body;
    const rawLimit = extractLimit(req.body);

    const updates = {};
    if (category) updates.category = category.trim();

    if (rawLimit !== undefined && rawLimit !== null && rawLimit !== '') {
      const limitNumber = Number(rawLimit);
      if (isNaN(limitNumber) || limitNumber <= 0) {
        return res.status(400).json({
          success: false,
          message: 'monthlyLimit must be a positive number greater than 0.',
        });
      }
      updates.monthlyLimit = limitNumber;
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized access.',
      });
    }

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized access.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudgets,
  setBudget,
  getBudgetById,
  updateBudget,
  deleteBudget,
};