import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const homeApi = createApi({
   reducerPath: "homeApi",

   baseQuery: fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api",
   }),

   endpoints: (builder) => ({
      getCategories: builder.query({
         query: () => "/categories",
      }),

      getOccasions: builder.query({
         query: () => "/occasions",
      }),

      getProducts: builder.query({
         query: () => "/products",
      }),

      getBestSellers: builder.query({
         query: () => "/products/best-sellers",
      }),

      getSections: builder.query({
         query: () => "/sections",
         // only return active sections
         // transformResponse: (res) => res.filter((s) => s.isActive),
      }),

      // getProducts: builder.query({
      //    query: () => "/products",
      // }),
   }),
});

export const {
   useGetCategoriesQuery,
   useGetProductsQuery,
   useGetOccasionsQuery,
   useGetBestSellersQuery,
   useGetSectionsQuery,
} = homeApi;
