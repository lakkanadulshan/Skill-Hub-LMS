// controllers/authController.js
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

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


// controllers/authController.js
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, organization, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; 

    const user = await User.create({
      firstName,
      lastName,
      organization,
      email,
      password: hashedPassword,
      role: role || "student",
      otp,
      otpExpires,
      isVerified: false, 
    });

    await sendEmail(
      email,
      "SkillHub Verification OTP",
      `Hi ${firstName}, your verification OTP is: ${otp}.`
    );

    res.status(201).json({ 
      message: "Registration successful.",
      userId: user._id 
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// Login a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Verify user exists and password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      
      // Deny login if the account is not verified via OTP
      if (!user.isVerified) {
        return res.status(403).json({ message: "Account not verified. Please verify your OTP." });
      }

      // Return user details and JWT token upon successful login
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // Return error for invalid credentials
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    // Handle login errors
    res.status(500).json({ message: "Login failed", error: error.message });
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

    // ... ඉහත කොටස් එලෙසම ...

    if (!user) {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      // නම කොටස් දෙකකට වෙන් කිරීම (Google වෙතින් එන්නේ "John Doe" ලෙස නම්)
      const nameParts = name.split(" ");
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Not Provided";

      user = await User.create({
        firstName,      // Schema එකට අනුව නිවැරදි නම
        lastName,       // Schema එකට අනුව නිවැරදි නම
        email,
        role: "student", 
        password: hashedPassword, 
      });
    }

res.json({
  _id: user._id,
  firstName: user.firstName || name.split(" ")[0], 
  lastName: user.lastName || name.split(" ").slice(1).join(" ") || " ",
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

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP matches and not expired
    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.isVerified = true;
      user.otp = undefined; 
      user.otpExpires = undefined;
      await user.save();

      res.json({ message: "Account verified successfully! You can now login." });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};