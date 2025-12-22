const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date: String,
  category: String,
  amount: Number,
  note: String,
});
module.exports = mongoose.model("Expense", expenseSchema);
