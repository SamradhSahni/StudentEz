const User = require("../models/User");

module.exports.showSignup = (req, res) => {
  res.render("signup");
};

module.exports.handleSignup = async (req, res) => {
  const { username, password } = req.body;


  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.send("User already exists!");
  }

  const user = new User({ username, password });
  await user.save();

  res.redirect("/login");
};
