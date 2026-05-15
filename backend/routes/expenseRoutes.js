const express = require('express');
const router = express.Router();

const { 
  addExpense, 
  getExpenses,
  getBalances, 
  settleUp,
  parseExpenseWithAI,
  getAIInsights
} = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').post(protect, addExpense).get(protect, getExpenses);
router.route('/balances').get(protect, getBalances);
router.route('/settle').post(protect, settleUp);
router.post('/parse', protect, parseExpenseWithAI);
router.get('/insights', protect, getAIInsights);

module.exports = router;