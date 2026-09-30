const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Transaction must belong to a user'],
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      lowercase: true,
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid transaction type (income or expense)',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [300, 'Note cannot exceed 300 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

// Compound index for user query performance
transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);