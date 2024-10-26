import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: JSON.parse(localStorage.getItem("messages")) || [
    {
      message: "Hi! Ask me any question related to STEM.",
      sender: "ChatGPT",
    },
  ],
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      localStorage.setItem("messages", JSON.stringify(state.messages));
    },
    setMessages: (state, action) => {
      state.messages = [
        {
          message: "Hi! Ask me any question related to STEM.",
          sender: "ChatGPT",
        },
        ...action.payload,
      ];
      localStorage.setItem("messages", JSON.stringify(state.messages));
    },
    clearMessages: (state) => {
      state.messages = [
        {
          message: "Hi! Ask me any question related to STEM.",
          sender: "ChatGPT",
        },
      ];
      localStorage.removeItem("messages");
    },
  },
});

export const { addMessage, setMessages, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;
