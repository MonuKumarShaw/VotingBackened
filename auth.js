const express = require("express");
const router = express.Router();
const User = require("./User");

const otpStore = {}; // Simple in-memory OTP store

// Registration
router.post("/register", async (req, res) => {
  const { name, dob, voterNumber, phone, email, address } = req.body;
  try {
    const userExists = await User.findOne({ voterNumber });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, dob, voterNumber, phone, email, address });
    await user.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login - verify voterNumber & dob
router.post("/login", async (req, res) => {
  const { voterNumber, dob } = req.body;
  try {
    const user = await User.findOne({ voterNumber, dob });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.hasVoted) {
      return res.status(403).json({ message: "You already voted. Access denied." });
    }

    // Generate OTP - here hardcoded "1234" for demo
    otpStore[voterNumber] = "1234";

    res.json({
      message: "Enter OTP to continue",
      voterNumber: user.voterNumber,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// OTP verification
router.post("/verify-otp", async (req, res) => {
  const { voterNumber, otp } = req.body;
  const storedOtp = otpStore[voterNumber];

  if (storedOtp && storedOtp === otp) {
    delete otpStore[voterNumber];

    try {
      const user = await User.findOne({ voterNumber });
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({
        message: "OTP verified successfully",
        name: user.name,
        email: user.email,
        phone: user.phone,
        voterNumber: user.voterNumber,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

// Vote submission route
router.post("/vote", async (req, res) => {
  const { voterNumber, party } = req.body;

  try {
    const user = await User.findOne({ voterNumber });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.hasVoted) return res.status(403).json({ message: "You have already voted" });

    user.hasVoted = true;
    await user.save();

    // Optionally log or store the vote somewhere

    res.json({ message: "Vote submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Vote failed" });
  }
});

module.exports = router;
