import mongoose from "mongoose";
import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import { setTitle } from "../utils/chatTitle.js";

export const createMessage = async (req, res) => {
  const message = req.body;

  if (!message.sender || !message.chatId) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid message data" });
  }

  try {
    const newMessage = new Message(message);
    await newMessage.save();

    const chat = await Chat.findById(message.chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    chat.messages.push(newMessage._id);

    chat.lastMessageAt = Date.now();

    await setTitle(chat);

    await chat.save();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error in Create message:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await Chat.findById(chatId).populate('messages'); 
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
  
    res.status(200).json({ success: true, data: chat.messages });
  } catch (error) {
    console.log("Error fetching chat messages:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
