import { apiSlice } from "../../api/apislice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: ({ name, email, password }) => ({
        url: "/user/register",
        method: "POST",
        body: { name, email, password },
      }),
    }),
  }),
});

export const { useRegisterUserMutation } = authApiSlice;
