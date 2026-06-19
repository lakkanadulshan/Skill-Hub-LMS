// controllers/authController.js
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage",
);

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Ensure password is a string before hashing
  const hashedPassword = await bcrypt.hash(String(password), 10);

  const user = await User.create({
    name,
    email,
    role: "student", // default role
    password: hashedPassword,
  });

  const responseData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };

  res.json(responseData);

};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
    
  }
};



// Google Login
export const googleLogin = async (req, res) => {
  // Frontend එකෙන් එවන auth code එක ලබා ගැනීම
  const { token } = req.body; 

  try {
    // Google සේවාදායකයෙන් access සහ id tokens ලබා ගැනීම
    const { tokens } = await client.getToken({
      code: token,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "postmessage",
    });
    
    // console.log("TOKENS:", tokens);

    // ලැබුණු id_token එක පාවිච්චි කර පරිශීලකයාගේ විස්තර verify කිරීම
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token, // නිවැරදි ආරක්ෂිත id_token එක
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Verify කරපු token එකෙන් නම සහ ඊමේල් එක ලබා ගැනීම
    const { name, email } = ticket.getPayload();

    // මේ ඊමේල් එකෙන් දැනටමත් user කෙනෙක් දත්ත ගබඩාවේ ඉන්නවාද කියා බැලීම
    let user = await User.findOne({ email });

    if (!user) {
      // අලුත් පරිශීලකයෙක් නම්, අහඹු මුරපදයක් (Random Password) සාදා එය Hash කිරීම
      // Mongoose හි password අනිවාර්ය (required: true) නිසා මෙසේ කිරීම අත්‍යවශ්‍ය වේ
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      // අලුත් පරිශීලකයාව දත්ත ගබඩාවේ (Database) සේව් කිරීම
      user = await User.create({
        name,
        email,
        role: "student", 
        password: hashedPassword, // අහඹු ලෙස සෑදූ රහස්‍ය මුරපදය මෙතනට ලබාදීම
      });
    }

    // සාර්ථකව පිවිසි පසු පරිශීලකයාගේ විස්තර සහ අපේම JWT Token එක Frontend එකට යැවීම
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // System එක ඇතුලෙ වැඩ කරන්න දෙන අලුත් token එක
    });
  } catch (error) {
    console.log("========== GOOGLE ERROR ==========");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    }

    console.log("MESSAGE:", error.message);

    // Frontend එකට 401 (Unauthorized) error එකක් යැවීම
    res.status(401).json({
      message: "Google authentication failed",
    });
  }
};