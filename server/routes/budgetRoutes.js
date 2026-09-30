const express = require('express');
const router = express.Router();

const {
  getBudgets,
  setBudget,
  getBudgetById,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');

// If your auth middleware is in ../middleware/authMiddleware:
const { protect } = require('../middleware/authMiddleware');

// If you protect all budget routes:
if (protect) {
  router.use(protect);
}

// Routes
router.route('/')
  .get(getBudgets)
  .post(setBudget);

router.route('/:id')
  .get(getBudgetById)
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router;