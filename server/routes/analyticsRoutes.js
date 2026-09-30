const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getCategoryBreakdown,
  getMonthlyTrends,
  getSummary,
} = require('../controllers/analyticsController');

router.use(protect);

router.get('/category-breakdown', getCategoryBreakdown);
router.get('/monthly-trends', getMonthlyTrends);
router.get('/summary', getSummary);

module.exports = router;