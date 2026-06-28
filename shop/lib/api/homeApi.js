import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const homeApi = createApi({
   reducerPath: "homeApi",

   baseQuery: fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api",
      credentials: "include",
   }),

   endpoints: (builder) => ({
      login: builder.mutation({
         query: (credentials) => ({
            url: "/auth/login",
            method: "POST",
            body: credentials,
            credentials: "include",
         }),
      }),

      getMe: builder.query({
         query: () => ({
            url: "/auth/me",
            credentials: "include",
         }),
      }),

      getCategories: builder.query({
         query: () => "/categories",
      }),

      getOccasions: builder.query({
         query: () => "/occasions",
      }),

      getColors: builder.query({
         query: () => "/colors",
      }),

      getProducts: builder.query({
         query: (params) => ({
            url: "/products",
            params,
         }),
      }),

      getProduct: builder.query({
         query: (id) => `/products/${id}`,
      }),

      getPriceRange: builder.query({
         query: () => "/products/price-range",
      }),

      getBestSellers: builder.query({
         query: () => "/products/best-sellers",
      }),

      getSectionSummaries: builder.query({
         query: () => "/sections/summaries",
      }),

      getSectionProducts: builder.query({
         query: (sectionId) => `/sections/${sectionId}/products`,
      }),

      
   }),
});

export const {
   useLoginMutation,
   useGetMeQuery,
   useGetCategoriesQuery,
   useGetOccasionsQuery,
   useGetColorsQuery,
   useGetProductsQuery,
   useGetProductQuery,
   useGetPriceRangeQuery,
   useGetBestSellersQuery,
   useGetSectionSummariesQuery,
   useGetSectionProductsQuery,
} = homeApi;
