import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api",
        credentials: "include",
        // prepareHeaders: (headers) => {
        //     const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        //     if (match) {
        //         headers.set("X-XSRF-TOKEN", decodeURIComponent(match[1]));
        //     }
        //     return headers;
        // },
    }),

    endpoints: (builder) => ({
        // Login
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
                credentials: "include",
            }),
        }),

        // Register
        register: builder.mutation({
            query: (user) => ({
                url: "/users/register",
                method: "POST",
                body: user,
            }),
        }),

        // Current User
        getMe: builder.query({
            query: () => ({
                url: "/auth/me",
                credentials: "include",
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
