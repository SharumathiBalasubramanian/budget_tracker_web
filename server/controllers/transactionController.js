const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

// Helper to sanitize CSV field values against comma injection
const sanitizeCSV = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

// @desc    Create a new transaction
// @route   POST /api/transactions
const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, note } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Amount, type (income/expense), and category are required.',
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number greater than 0.',
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title: title || '',
      amount: Number(amount),
      type: type.toLowerCase().trim(),
      category,
      date: date ? new Date(date) : new Date(),
      note: note || '',
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transactions with pagination
// @route   GET /api/transactions
const getTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: transactions.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized access.',
      });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
const updateTransaction = async (req, res, next) => {
  try {
    if (req.body.amount && Number(req.body.amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero.',
      });
    }

    const updates = { ...req.body };
    if (updates.type) {
      updates.type = updates.type.toLowerCase().trim();
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized access.',
      });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized access.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Helper: build filter query for both filter and export endpoints
const buildFilterQuery = (userId, queryParams) => {
  const { category, type, startDate, endDate } = queryParams;
  const filter = { user: userId };

  if (category) {
    filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
  }
  if (type && ['income', 'expense'].includes(type.toLowerCase().trim())) {
    filter.type = type.toLowerCase().trim();
  }
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  return filter;
};

// @desc    Filter and sort transactions
// @route   GET /api/transactions/filter
const filterTransactions = async (req, res, next) => {
  try {
    const filter = buildFilterQuery(req.user._id, req.query);
    const sortBy =
      req.query.sortBy === 'amount'
        ? { amount: req.query.order === 'asc' ? 1 : -1 }
        : { date: req.query.order === 'asc' ? 1 : -1 };

    const transactions = await Transaction.find(filter).sort(sortBy);

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export filtered transactions to CSV
// @route   GET /api/transactions/export
const exportTransactions = async (req, res, next) => {
  try {
    const filter = buildFilterQuery(req.user._id, req.query);
    const transactions = await Transaction.find(filter).sort({ date: -1 });

    const headers = ['ID', 'Date', 'Type', 'Category', 'Title', 'Amount', 'Note'];
    const rows = transactions.map((t) => [
      sanitizeCSV(t._id),
      sanitizeCSV(t.date.toISOString().split('T')[0]),
      sanitizeCSV(t.type),
      sanitizeCSV(t.category),
      sanitizeCSV(t.title),
      t.amount.toFixed(2),
      sanitizeCSV(t.note),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=transactions-${Date.now()}.csv`
    );
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  filterTransactions,
  exportTransactions,
};