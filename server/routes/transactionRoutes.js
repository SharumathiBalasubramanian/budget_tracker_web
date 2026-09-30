const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  filterTransactions,
  exportTransactions,
} = require('../controllers/transactionController');

// All transaction routes are protected
router.use(protect);

router.get('/filter', filterTransactions);
router.get('/export', exportTransactions);

router.route('/')
  .post(createTransaction)
  .get(getTransactions);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;