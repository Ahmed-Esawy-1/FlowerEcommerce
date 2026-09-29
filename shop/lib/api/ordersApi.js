import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
    reducerPath: "ordersApi",

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

    tagTypes: ["Order"],

    endpoints: (build) => ({
        // Create Order
        createOrder: build.mutation({
            query: (orderData) => ({
                url: "/orders",
                method: "POST",
                body: orderData,
            }),
            invalidatesTags: ["Order"],
        }),

        // Get Order By Id
        getOrder: build.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: "Order", id }],
        }),

        // Get All Orders (Summary, paginated)
        getOrders: build.query({
            query: (params) => ({
                url: "/orders",
                params,
            }),
            providesTags: ["Order"],
        }),
    }),
});

export const { useCreateOrderMutation, useGetOrderQuery, useGetOrdersQuery } =
    ordersApi;
