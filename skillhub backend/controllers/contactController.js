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

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching messages", error: error.message });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const message = await Contact.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    message.isRead = isRead;
    await message.save();

    res.status(200).json({
      success: true,
      message: "Message status updated successfully",
      data: message
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error updating status", error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Contact.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message node not found" });
    }

    res.status(200).json({
      success: true,
      message: "Message purged from system logs"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error deleting message", error: error.message });
  }
};