const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Protected Profile Route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

module.exports = router;

module.exports = router;