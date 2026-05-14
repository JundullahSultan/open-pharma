const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", auth.redirectIfLoggedIn, (req, res) => {
  // If user is already logged in, redirect them
  if (req.cookies.token) {
    // Optional: Check role and redirect accordingly
    return res.redirect("/admin/dashboard");
  }

  // Redirect to the user login page instead of rendering 'home'
  res.redirect("/user/login");
});

router.get("/privacy", (req, res) => {
  res.render("privacy");
});

module.exports = router;
