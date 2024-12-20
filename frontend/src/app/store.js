import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apislice";
import authReducer from "./slices/auth/authslice";
import chatReducer from "./slices/chat/chatslice";
import messageReducer from "./slices/message/messageslice";
import { chatApiSlice } from "./slices/chat/chatapislice";
import { messageApiSlice } from "./slices/message/messageapislice";
import { agentApiSlice } from "./slices/agent/agentapislice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [chatApiSlice.reducerPath]: chatApiSlice.reducer,
    [messageApiSlice.reducerPath]: messageApiSlice.reducer,
    [agentApiSlice.reducerPath]: agentApiSlice.reducer,
    auth: authReducer,
    chat: chatReducer,
    messages: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware),
  devTools: true,
});
