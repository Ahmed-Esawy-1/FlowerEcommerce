"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    useGetCategoriesQuery,
    useGetColorsQuery,
    useGetOccasionsQuery,
    useGetPriceRangeQuery,
    useGetProductsQuery,
} from "@/lib/api/homeApi";

import Filters from "./components/Filters";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/loading/ProductSkeleton";

import { ChevronRight } from "lucide-react";

const safeNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

export default function Products({ sortBy = null, pageTitle = null }) {
    const t = useTranslations("shop");

    const searchParams = useSearchParams();
    const categoryIdsParam = searchParams.get("categoryIds");
    const occasionIdsParam = searchParams.get("occasionIds");

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
        ...(sortBy ? { sortBy } : {}),
        ...(safeNumber(filters.minPrice) != null
            ? { minPrice: safeNumber(filters.minPrice) }
            : {}),
        ...(safeNumber(filters.maxPrice) != null
            ? { maxPrice: safeNumber(filters.maxPrice) }
            : {}),
    });

    const filtersLoading =
        categoriesLoading || occasionsLoading || colorsLoading || priceLoading;

    useEffect(() => {
        setPage(0);
        setAllProducts([]);
    }, [filters, sortBy]);

    const parseIds = (param) => {
        if (!param) return [];
        return param
            .split(",")
            .map((v) => Number(v))
            .filter((n) => Number.isFinite(n));
    };

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            categoryIds: parseIds(categoryIdsParam),
            occasionIds: parseIds(occasionIdsParam),
        }));
    }, [categoryIdsParam, occasionIdsParam]);

    useEffect(() => {
        if (productsInfo?.content) {
            setAllProducts((prev) => {
                if (page === 0) return productsInfo.content;
                return [...prev, ...productsInfo.content];
            });
        }
    }, [productsInfo]);

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
            {/* FILTERS */}
            {filtersLoading ? (
                <div className="hidden lg:flex w-64 items-center justify-center">
                    <div className="w-8 h-8 border-4 border-rose/20 border-t-primary rounded-full animate-spin" />
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
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text mb-2">
                            <Link href="/" className="hover:text-primary">
                                {t("breadcrumbHome")}
                            </Link>
                            <ChevronRight className="rtl:rotate-180" />
                            <span>{pageTitle ?? t("breadcrumbShop")}</span>
                        </nav>
                        <h1 className="font-serif text-4xl text-primary">
                            {t("title")}
                        </h1>
                    </div>
                    <span className="text-xs text-text">
                        {productsInfo?.totalElements ?? 0} {t("products")}
                    </span>
                </div>

                {/* FILTER BUTTON (Small Screen) */}
                <div className="lg:hidden mb-6">
                    <button
                        onClick={() => setFiltersOpen(true)}
                        className="px-4 py-2 border border-gold/40 rounded-md text-sm text-ink"
                    >
                        {t("filters")}
                    </button>
                </div>

                {/* PRODUCTS */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                    {isFetching && allProducts.length === 0
                        ? Array.from({ length: 12 }).map((_, i) => (
                              <ProductSkeleton key={i} />
                          ))
                        : allProducts.map((product) => (
                              <ProductCard key={product.id} product={product} />
                          ))}
                </div>

                {/* LOAD MORE */}
                {hasMore && (
                    <div className="flex justify-center mt-10 mb-15">
                        <button
                            disabled={isFetching}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-6 py-3 border border-primary rounded-md text-primary hover:bg-primary hover:text-white transition-colors"
                        >
                            {isFetching ? "..." : t("loadMore")}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
