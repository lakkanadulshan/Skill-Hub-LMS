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
    expiresIn: "3d",
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

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token, 
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {

      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);


      user = await User.create({
        name,
        email,
        role: "student", 
        password: hashedPassword, 
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), 
    });
  } catch (error) {
    console.log("========== GOOGLE ERROR ==========");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    }

    console.log("MESSAGE:", error.message);

    res.status(401).json({
      message: "Google authentication failed",
    });
  }
};