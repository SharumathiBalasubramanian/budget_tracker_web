const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    monthlyLimit: {
      type: Number,
      required: [true, 'Please add a monthly limit'],
      min: [1, 'Limit must be greater than 0'],
    },
  },
  { timestamps: true }
);

// One budget per category per user
budgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);