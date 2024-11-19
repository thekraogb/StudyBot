import { apiSlice } from "../../api/apislice";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query: (newMessage) => ({
        url: "/message",
        method: "POST",
        body: newMessage,
      }),
    }),
    fetchMessages: builder.query({
      query: (chatId) => `/message/${chatId}`,
    }),
  }),
});

export const { useCreateMessageMutation, useFetchMessagesQuery } =
  messageApiSlice;
