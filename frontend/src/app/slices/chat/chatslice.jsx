import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: JSON.parse(localStorage.getItem("chats")) || [],
  chatId: localStorage.getItem("chatId") || "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatId: (state, action) => {
      state.chatId = action.payload;
      localStorage.setItem("chatId", action.payload);
    },
    setChats: (state, action) => {
      state.chats = action.payload;
      localStorage.setItem("chats", JSON.stringify(state.chats));
    },
    removeChat: (state, action) => {
      state.chats = state.chats.filter((chat) => chat._id !== action.payload);
      localStorage.setItem("chats", JSON.stringify(state.chats));
    },
    clearChats: (state) => {
      state.chats = [];
      state.chatId = "";
      localStorage.removeItem("chats");
      localStorage.removeItem("chatId");
    },
  },
});

export const { setChatId, setChats, removeChat, clearChats } =
  chatSlice.actions;

export default chatSlice.reducer;
