"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
   useGetCategoriesQuery,
   useGetColorsQuery,
   useGetOccasionsQuery,
   useGetPriceRangeQuery,
   useGetProductsQuery,
} from "@/lib/api/homeApi";

import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/loading/ProductSkeleton";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const safeNumber = (v) => {
   const n = Number(v);
   return Number.isFinite(n) ? n : null;
};

export default function Products() {
   const t = useTranslations("productsPage");
   const searchParams = useSearchParams();

   const category = searchParams.get("category");
   const occasion = searchParams.get("occasion");

   const [filtersOpen, setFiltersOpen] = useState(false);

   const [filters, setFilters] = useState({
      categoryIds: [],
      occasionIds: [],
      colorIds: [],
      minPrice: null,
      maxPrice: null,
   });

   const [page, setPage] = useState(0);
   const [allProducts, setAllProducts] = useState([]);

   const { data: categories = [], isLoading: categoriesLoading } =
      useGetCategoriesQuery();
   const { data: occasions = [], isLoading: occasionsLoading } =
      useGetOccasionsQuery();
   const { data: colors = [], isLoading: colorsLoading } = useGetColorsQuery();
   const { data: priceRange = {}, isLoading: priceLoading } =
      useGetPriceRangeQuery();

   const { data: productsInfo = [], isFetching } = useGetProductsQuery({
      page,
      size: 12,
      categoryIds: filters.categoryIds,
      occasionIds: filters.occasionIds,
      colorIds: filters.colorIds,
      ...(safeNumber(filters.minPrice) != null
         ? { minPrice: safeNumber(filters.minPrice) }
         : {}),
      ...(safeNumber(filters.maxPrice) != null
         ? { maxPrice: safeNumber(filters.maxPrice) }
         : {}),
   });

   const filtersLoading =
      categoriesLoading || occasionsLoading || colorsLoading || priceLoading;

   // reset products when filters change
   useEffect(() => {
      setPage(0);
      setAllProducts([]);
   }, [filters]);

   // sync URL params
   useEffect(() => {
      setFilters((prev) => ({
         ...prev,
         categoryIds: category ? [Number(category)] : [],
         occasionIds: occasion ? [Number(occasion)] : [],
      }));
   }, [category, occasion]);

   // append products
   useEffect(() => {
      if (productsInfo?.content) {
         setAllProducts((prev) => {
            if (page === 0) return productsInfo.content;
            return [...prev, ...productsInfo.content];
         });
      }
   }, [productsInfo]);

   // init price range
   useEffect(() => {
      if (priceRange?.minPrice != null && priceRange?.maxPrice != null) {
         setFilters((prev) => ({
            ...prev,
            minPrice: Number(priceRange.minPrice),
            maxPrice: Number(priceRange.maxPrice),
         }));
      }
   }, [priceRange]);

   const hasMore = productsInfo?.totalPages
      ? page + 1 < productsInfo.totalPages
      : false;

   // Prevent Scroll when Filter in Small Screen
   useEffect(() => {
      if (filtersOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "auto";
      }

      return () => {
         document.body.style.overflow = "auto";
      };
   }, [filtersOpen]);

   return (
      <div className="min-h-screen flex flex-col lg:flex-row gap-8">
         {/* Filters */}
         {filtersLoading ? (
            <div className="hidden lg:flex w-64 items-center justify-center">
               <div className="w-8 h-8 border-4 border-stone-200 border-t-primary rounded-full animate-spin" />
            </div>
         ) : (
            <Filters
               open={filtersOpen}
               setOpen={setFiltersOpen}
               data={{ categories, occasions, colors, priceRange }}
               filters={filters}
               setFilters={setFilters}
            />
         )}

         <main className="flex-1 pt-20 px-4 lg:px-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
               <div>
                  <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400 mb-2">
                     <Link href="/" className="hover:text-stone-600">
                        {t("breadcrumbHome")}
                     </Link>
                     <ChevronRightIcon className="rtl:rotate-180" />
                     <span>{t("breadcrumbShop")}</span>
                  </nav>
                  <h1 className="font-serif text-4xl text-rose-900">
                     {t("title")}
                  </h1>
               </div>
               <span className="text-xs text-stone-400">
                  {productsInfo?.totalElements ?? 0} {t("products")}
               </span>
            </div>

            {/* Filter Button (Small Screen) */}
            <div className="lg:hidden mb-6">
               <button
                  onClick={() => setFiltersOpen(true)}
                  className="px-4 py-2 border rounded-md text-sm"
               >
                  {t("filters")}
               </button>
            </div>

            {/* Products */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
               {isFetching && allProducts.length === 0
                  ? Array.from({ length: 12 }).map((_, i) => (
                       <ProductSkeleton key={i} />
                    ))
                  : allProducts.map((product) => (
                       <ProductCard key={product.id} product={product} />
                    ))}
            </div>

            {/* Load More */}
            {hasMore && (
               <div className="flex justify-center mt-10 mb-15">
                  <button
                     disabled={isFetching}
                     onClick={() => setPage((p) => p + 1)}
                     className="px-6 py-3 border rounded-md hover:bg-primary hover:text-white transition"
                  >
                     {isFetching ? "..." : t("loadMore")}
                  </button>
               </div>
            )}
         </main>
      </div>
   );
}
