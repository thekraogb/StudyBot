import mongoose from "mongoose";
import Chat from "../models/chat.model.js"; 
import Message from "../models/message.model.js"; 

export const createChat = async (req, res) => {
    try {
      const userId = req.userId; 

      const newChat = new Chat({userId});
  
      await newChat.save();
  
      res.status(201).json({ success: true, chatId: newChat._id });
    } catch (error) {
      console.error("Error creating new chat:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  export const getChats = async (req, res) => {
	try {
    const userId = req.userId; 

		const chats = await Chat.find({userId});
		res.status(200).json({ success: true, data: chats });
	} catch (error) {
		console.log("error fetching chats :", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteChat = async (req, res) => {
  const { chatId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(404).json({ success: false, message: "Invalid chat ID" });
  }

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    if (chat.messages.length > 0) {
      await Message.deleteMany({ _id: { $in: chat.messages } });  
    }

    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({ success: true, message: "Chat deleted" });
  } catch (error) {
    console.log("Error deleting chat:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

  