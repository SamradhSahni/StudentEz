const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.session.userId = req.user._id; 
    res.redirect("/home");
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect("/login");
  });
});

module.exports = router;
