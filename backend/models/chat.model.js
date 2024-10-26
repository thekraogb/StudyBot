import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    title: {
        type: String,
        required: false, 
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message", 
      },
    ],
    startedAt: {
      type: Date,
      default: Date.now,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
