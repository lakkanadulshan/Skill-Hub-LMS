import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors"; //

// Routers Imports
import authRouter from "./routers/authRouter.js";
import courseRoutes from "./routers/courseRouter.js";
import enrollRoutes from "./routers/enrollRouter.js";
import lessonRoutes from "./routers/lessonRouter.js";
import progressRoutes from "./routers/progressRouter.js";
import reviewRoutes from "./routers/reviewRouter.js";
import contactRoutes from "./routers/contactRoutes.js"; 
import adminRoutes from "./routers/adminRoutes.js";



// 2. Express App
const app = express();
const PORT = process.env.PORT || 3020;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body Parser Middleware
app.use(express.json());

// 4. API ROUTES SETUP
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/contact", contactRoutes); 
app.use("/api/admin", adminRoutes); 

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to SkillHub API!");
});

// 5. 404 ERROR HANDLER
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// 6. DATABASE CONNECTION & SERVER START
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });
