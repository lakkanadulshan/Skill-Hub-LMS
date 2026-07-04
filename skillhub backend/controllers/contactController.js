import Contact from "../models/contact.js";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = await Contact.create({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: "Message received successfully",
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};