const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

module.exports.getBudgetPage = async (req, res) => {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const { category } = req.query;

  const budget = await Budget.findOne({ userId: req.session.userId, month });

  const allExpenses = await Expense.find({ userId: req.session.userId });
  const expenses = category
    ? allExpenses.filter(e => e.category === category)
    : allExpenses;

  const spent = allExpenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  const feedback = !budget
    ? "No budget set"
    : spent > budget.budgetAmount
    ? "You've overspent!"
    : "You're on track!";

  res.render("budget/budgetpage", {
    budget,
    expenses,
    spent,
    feedback,
    selectedCategory: category || "All",
    categoryTotal: category ? categoryTotal : spent,
  });
};


module.exports.setBudget = async (req, res) => {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  await Budget.findOneAndUpdate(
    { userId: req.session.userId, month },
    { ...req.body, userId: req.session.userId, month },
    { upsert: true }
  );
  res.redirect("/budget");
};

module.exports.addExpense = async (req, res) => {
  await Expense.create({ ...req.body, userId: req.session.userId });
  res.redirect("/budget");
};

module.exports.deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.redirect("/budget");
};

module.exports.resetBudget = async (req, res) => {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  await Expense.deleteMany({ userId: req.session.userId });
  await Budget.findOneAndUpdate(
    { userId: req.session.userId, month },
    { budgetAmount: 0 },
    { upsert: true }
  );
  res.redirect("/budget");
};
