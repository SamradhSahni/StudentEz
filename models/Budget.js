const mongoose = require("mongoose");
const budgetSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  month: String,
  budgetAmount: Number,
  savedLastMonth: Number,
});
module.exports = mongoose.model("Budget", budgetSchema);

