const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

router.get("/", budgetController.getBudgetPage);
router.post("/set", budgetController.setBudget);
router.post("/expense/add", budgetController.addExpense);
router.post("/expense/delete/:id", budgetController.deleteExpense);
router.post("/reset", budgetController.resetBudget);

module.exports = router;
