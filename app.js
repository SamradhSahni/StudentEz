require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("hbs");
const passport = require("passport");
const methodOverride = require("method-override");
const flash = require("connect-flash");
require("./passport");

const User = require("./models/User");

const app = express();

// Setup method-override for DELETE/PUT
app.use(methodOverride("_method"));

// View engine and static files
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/resumescreener', express.static(path.join(__dirname, 'public/resumescreener'))); // ✅ Added for resume uploads
app.use(express.static(path.join(__dirname, "public")));

// Register Handlebars helpers
hbs.registerHelper("eq", function (a, b) {
  return a === b;
});
hbs.registerHelper("formatDate", function (dateString) {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split("T")[0];
});
hbs.registerHelper("formatDateInput", function(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
});

// Body parser
app.use(express.urlencoded({ extended: false }));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Make user available in views
app.use(async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  } else if (req.session.userId) {
    try {
      const dbUser = await User.findById(req.session.userId);
      res.locals.user = dbUser;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// Public routes
const openRoutes = [
  "/login",
  "/signup",
  "/auth/google",
  "/auth/google/callback",
];

// Restrict other routes
app.use((req, res, next) => {
  if (!req.session.userId && !req.isAuthenticated() && !openRoutes.includes(req.path)) {
    return res.redirect("/login");
  }
  next();
});

// Routes
app.use("/signup", require("./routes/signup"));
app.use("/login", require("./routes/login"));
app.use("/home", require("./routes/home"));
app.use("/subjects", require("./routes/subjects"));
app.use("/attendance", require("./routes/attendance"));
app.use("/exams", require("./routes/exams"));
app.use("/budget", require("./routes/budget"));
app.use("/planner", require("./routes/planner"));
app.use("/auth", require("./routes/googleAuth"));
app.use("/workshops", require("./routes/workshop"));
app.use("/jobs", require("./routes/jobs"));
app.use("/", require("./routes/resumeRoutes")); // ✅ Handles `/resume/screener`

// Default routes
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/about", (req, res) => {
  res.render("about");
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logout error:", err);
      return res.redirect("/home");
    }
    res.redirect("/login");
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
