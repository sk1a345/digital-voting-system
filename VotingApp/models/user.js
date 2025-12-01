const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.AADHAAR_SECRET_KEY; // must be 32 chars
const IV_LENGTH = 16;

// Encrypt Aadhaar Number (non-deterministic)
function encryptAadhaar(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

// Deterministic HMAC for lookup/uniqueness
function aadhaarHmac(text) {
  return crypto.createHmac('sha256', ENCRYPTION_KEY).update(text).digest('hex');
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    match: [
      /^\S+@\S+\.\S+$/,
      "Please enter a valid email address",
    ],
  },

  aadhaarNumber: {
  type: String,
  required: true,
  validate: {
    validator: function (v) {
      // Only validate when the field is being SET (plain number)
      return this.isModified("aadhaarNumber") 
        ? /^[0-9]{12}$/.test(v)
        : true; // skip validation if encrypted value already stored
    },
    message: "Aadhaar Number must be exactly 12 digits"
  }
},


  aadhaarHash:{
    type: String,
    // required: true, // will always be set in pre-save
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password must be at least 6 characters"],
  },

  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [18, "You must be at least 18 to register"],
  },
  role: {
    type: String,
    default: 'user'
  },
  votedFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    default: null // user has not voted yet
  }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Encrypt Aadhaar and compute aadhaarHash before saving
userSchema.pre("save", function (next) {
  if (this.isModified("aadhaarNumber")) {
    const plain = this.aadhaarNumber.toString().trim();
    // store deterministic hash for lookup
    this.aadhaarHash = aadhaarHmac(plain);
    // store encrypted Aadhaar for confidentiality
    this.aadhaarNumber = encryptAadhaar(plain);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
