const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Send OTP via email
const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP Verification",
    text: `Welcome to the Book Store Application! \n\nYour OTP code for Book Store Sign-Up Verification is: ${otp}. \n\nIf you did not request this, please report it to ${process.env.EMAIL}.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Unable to send OTP email");
  }
};

// Signup logic
exports.signup = async (req, res) => {
  const { name, email, phone, password, confirmPassword, admin, address } =
    req.body;

  // verify password
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "confirmPassword is not matching" });
  }

  // Validate password (at least 8 characters, one uppercase letter, one symbol)
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      msg: "Password must be at least 8 characters long, contain one uppercase letter, and one symbol",
    });
  }

  // Validate input
  if (!name || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Create a new user
    user = new User({ name, email, phone, password, admin, address });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;

    // Save user and send OTP
    await user.save();
    await sendOTP(email, otp);
    res.status(201).json({ msg: "Signup successful, OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// verify OTP 
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({ msg: "Email and OTP are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email" });

    // Track OTP verification attempts
    if (!user.otpAttempts) {
      user.otpAttempts = 0;
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      user.otpAttempts += 1; 

      // If user exceeds 5 failed attempts, delete the user
      if (user.otpAttempts > 5) {
        await User.findByIdAndDelete(user._id); 
        return res.status(400).json({ msg: "Too many failed attempts. User deleted." });
      }

      // Save the updated user with the new attempt count
      await user.save();
      return res.status(400).json({ 
        msg: `Invalid OTP. You have ${5 - user.otpAttempts} attempts remaining.` 
      });
    }

    // Reset OTP and verification attempts if successful
    user.otp = null;
    user.otpAttempts = 0; 
    await user.save(); 

    res.status(200).json({ msg: "SignUp Successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};



// Login Logic
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Create and return JWT
      const payload = {
        user: {
          id: user.id,
          email: user.email,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Generate admin token if the user is an admin
      let adminToken = null;
      if (user.admin) {
        adminToken = jwt.sign(
          { id: user._id, role: "admin" },
          process.env.JWT_SECRET
          // { expiresIn: "1h" }
        );
      }

      // Set tokens in cookies
      res.cookie("token", token);
      if (adminToken) {
        res.cookie("adminToken", adminToken);
      }

      return res.status(200).json({ msg: "Login Completed" });
    } else {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};
