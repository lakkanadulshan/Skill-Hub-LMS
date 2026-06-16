import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routers/authRouter.js";
import courseRoutes from "./routers/courseRouter.js";
import enrollRoutes from "./routers/enrollRouter.js";
import lessonRoutes from "./routers/lessonRouter.js";
import progressRoutes from "./routers/progressRouter.js";
import reviewRoutes from "./routers/reviewRouter.js";

dotenv.config({ debug: true });

const app = express();
const PORT = process.env.PORT || 3020;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
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
  

app.use("/api/auth", authRouter);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/reviews", reviewRoutes);



app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
}); 

app.get("/", (req, res) => {
  res.send("Welcome to SkillHub API!");
});

