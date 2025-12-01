const User = require("../models/user");
const AdminInfo = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Rendering Authentication Pages

module.exports.getUserLogin = (req, res, next) => {
  res.render("users/userLogin", {
    pageTitle: 'User-login-page',
    currentPage: "login",
  });
};

// Rendering Signup Page
module.exports.getUserSignup = (req, res, next) => {
  res.render("users/userSignup", {
    pageTitle: 'user-signup-page',
    currentPage: "signup",
  });
};

// Handling User Post Requrest for Login

module.exports.postUserLogin = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const COOKIE_NAME = process.env.COOKIE_NAME || "authToken";
  const COOKIE_EXPIRES_DAYS = process.env.COOKIE_EXPIRES_DAYS || 7;
  const AADHAAR_SECRET_KEY = process.env.AADHAAR_SECRET_KEY;

  try {
    const { email, password } = req.body;
    const input = email.trim(); // Could be email or Aadhaar

    if (!input || !password) {
      return res.status(400).send("Email/Aadhaar and password are required");
    }

    let user;

    // CASE 1: User entered EMAIL
    if (input.includes("@")) {
      user = await User.findOne({ email: input.toLowerCase() });
    }

    // CASE 2: User entered AADHAAR NUMBER
    else if (/^\d{12}$/.test(input)) {
      const crypto = require("crypto");
      const aadhaarHash = crypto
        .createHmac("sha256", AADHAAR_SECRET_KEY)
        .update(input)
        .digest("hex");

      user = await User.findOne({ aadhaarHash });
    }

    // If no match
    if (!user) {
      return res.status(400).send("Invalid email/Aadhaar or password");
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid email/Aadhaar or password");
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id, role: "user" }, JWT_SECRET, {
      expiresIn: `${COOKIE_EXPIRES_DAYS}d`,
    });

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      maxAge: COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      // secure: true  // enable only on HTTPS
    };

    // Set cookie
    res.cookie(COOKIE_NAME, token, cookieOptions);

    // Redirect to dashboard
    return res.redirect("/users/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Internal server error");
  }
};
// Handling User Post Request for Signup
// controllers/authController.js (only postUserSignup shown)

module.exports.postUserSignup = async (req, res) => {
  try {
    const { name, email, password, age, aadhaarNumber } = req.body;

    // Light server-side validation
    if (!name || !email || !password || !age || !aadhaarNumber) {
      return res.status(400).send("All fields are required");
    }
    if (
      String(aadhaarNumber).length !== 12 ||
      !/^\d{12}$/.test(aadhaarNumber)
    ) {
      return res.status(400).send("Aadhaar must be 12 digits");
    }
    if (Number(age) < 18) {
      return res.status(400).send("You must be at least 18 to register");
    }

    // Check existing by email
    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
      return res.status(400).send("Email already registered");
    }

    // Check existing by aadhaarHash (we compute HMAC same as model)
    const crypto = require("crypto");
    const ENCRYPTION_KEY = process.env.AADHAAR_SECRET_KEY;
    const aadhaarHash = crypto
      .createHmac("sha256", ENCRYPTION_KEY)
      .update(String(aadhaarNumber).trim())
      .digest("hex");

    const existingByAadhaar = await User.findOne({ aadhaarHash });
    if (existingByAadhaar) {
      return res.status(400).send("Aadhaar already registered");
    }

    // Create user (model pre-save will encrypt Aadhaar and hash password)
    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      age: Number(age),
      aadhaarNumber: String(aadhaarNumber).trim(),
    });

    await user.save();

    // Redirect to dashboard or respond JSON
    // After signup → go to login page
    return res.redirect("/users/login");
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).send("Internal server error");
  }
};

// Handling User Logout
module.exports.getUserLogout = (req, res, next) => {
  res.clearCookie(process.env.COOKIE_NAME || "authToken");
  res.redirect("/");
};

// Rendering Admin Login Page
module.exports.getAdminLogin = (req, res, next) => {
  res.render("admin/adminLogin", {
    pageTitle: 'AdminLogin',
    currentPage: "login",
  });
};

// handling admin Login Post Request
module.exports.postAdminLogin = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const COOKIE_NAME = process.env.COOKIE_NAME || "authToken";
  const COOKIE_EXPIRES_DAYS = 7;

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const user = await AdminInfo.findOne({ username });
    if (!user) {
      return res.status(400).send("Invalid username or password");
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid username or password");
    }

    // Create token
    const token = jwt.sign({ userId: user._id, role: "admin" }, JWT_SECRET, {
      expiresIn: `${COOKIE_EXPIRES_DAYS}d`,
    });

    // Set cookie
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    return res.redirect("/admin/dashboard");
  } catch (error) {
    console.log("Admin Login Error: ", error);
    return res.status(500).send("Internal server error");
  }
};

// handling admin Logout
module.exports.getAdminLogout = (req, res, next) => {
  res.clearCookie(process.env.COOKIE_NAME || "authToken");
  res.redirect("/");
};
