import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const homeApi = createApi({
    reducerPath: "homeApi",

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api",
        credentials: "include",
        // prepareHeaders: (headers) => {
        //     // Only run in browser, not on server
        //     if (typeof document !== "undefined") {
        //         const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        //         if (match) {
        //             headers.set("X-XSRF-TOKEN", decodeURIComponent(match[1]));
        //         }
        //     }
        //     return headers;
        // },
    }),

    tagTypes: ["Categories", "Occasions", "Products", "SectionProducts"],

    endpoints: (builder) => ({
        // Collections
        getCategories: builder.query({
            query: () => "/categories",
            providesTags: ["Categories"],
        }),

        getOccasions: builder.query({
            query: () => "/occasions",
            providesTags: ["Occasions"],
        }),

        getColors: builder.query({
            query: () => "/colors",
        }),

        // Products
        getProducts: builder.query({
            query: (params) => ({
                url: "/shop/products",
                params,
            }),
            // providesTags: (result) =>
            //     result
            //         ? [
            //               ...result.map(({ id }) => ({
            //                   type: "Products",
            //                   id,
            //               })),
            //               "Products",
            //           ]
            //         : ["Products"],
        }),

        // Specific Product
        getProduct: builder.query({
            query: (id) => `/shop/products/${id}`,
            providesTags: (result, error, id) => [{ type: "Products", id }],
        }),

        getPriceRange: builder.query({
            query: () => "/shop/products/price-range",
            // Cache for 5 minutes
        }),

        // Section Products - optimized for lazy loading
        getSectionProducts: builder.query({
            query: (sectionId) => ({
                url: `/sections/${sectionId}/products`,
            }),
            providesTags: (result, error, sectionId) => [
                { type: "SectionProducts", id: sectionId },
            ],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetOccasionsQuery,
    useGetColorsQuery,
    useGetProductsQuery,
    useGetProductQuery,
    useGetPriceRangeQuery,
    useGetSectionProductsQuery,
} = homeApi;
