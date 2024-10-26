import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    name: localStorage.getItem("name") || null,
    email: localStorage.getItem("email") || null,
    token: localStorage.getItem("accessToken") || null,
  },
  reducers: {
    setAccessToken: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;

      localStorage.setItem("accessToken", accessToken);
    },
    setCredentials: (state, action) => {
      const { name, email } = action.payload;
      state.name = name;
      state.email = email;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
    },
    logOut: (state) => {
      state.email = null;
      state.token = null;
      state.name = null;

      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("accessToken");

      localStorage.removeItem("chats");
      localStorage.removeItem("chatId");
      localStorage.removeItem("messages");
    },
  },
});

export const { setAccessToken, setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
