import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routers/authRoutes.js";
import courseRoutes from "./routers/courseRouter.js";
import enrollRoutes from "./routers/enrollRouter.js";

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
  

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollRoutes);

