import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAccessToken, logOut } from "../slices/auth/authslice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", `application/json`);
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // send refresh token to get new access token if current access token expired
  if (result?.error?.originalStatus === 403 || result?.error?.status === 403) {
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
    if (refreshResult?.data) {
      api.dispatch(setAccessToken({ ...refreshResult.data }));
      // resend original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'rtkQueryService',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
