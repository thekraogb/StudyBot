import { apiSlice } from "../../api/apislice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: () => ({
        url: "/chat",
        method: "POST",
      }),
    }),
    fetchChats: builder.query({
      query: () => "/chat",
    }),
    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `/chat/${chatId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateChatMutation,
  useFetchChatsQuery,
  useDeleteChatMutation,
} = chatApiSlice;
