import express from "express";
import { 
  sendMessage, 
  getAllMessages, 
  deleteMessage, 
  updateMessageStatus 
} from "../controllers/contactController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", sendMessage); 

router.get("/all", protect, admin, getAllMessages);

router.put("/:id/status", protect, admin, updateMessageStatus);

router.delete("/:id", protect, admin, deleteMessage);

export default router;