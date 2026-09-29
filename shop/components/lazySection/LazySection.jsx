"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import useInView from "./useInView";
import { useGetSectionProductsQuery } from "@/lib/api/homeApi";
import ProductSkeleton from "../loading/ProductSkeleton";
import ProductCard from "../ProductCard";

import { useLocale, useTranslations } from "next-intl";

import { ArrowRight } from "lucide-react";

const MIN_PRODUCTS = 5;

const AppSwiper = dynamic(() => import("../AppSwiper"), {
    ssr: false,
    loading: () => (
        <div className="h-40 animate-pulse bg-slate-200 rounded-xl" />
    ),
});

export default function LazySection({ section }) {
    const locale = useLocale();
    const tCommon = useTranslations("common");
    const { ref, isVisible } = useInView();

    const {
        data: products = [],
        isFetching,
        isSuccess,
    } = useGetSectionProductsQuery(section.id, { skip: !isVisible });

    if (isSuccess && products.length < MIN_PRODUCTS) {
        return null;
    }

    return (
        <section ref={ref} className="py-20" style={{ minHeight: "320px" }}>
            <div className="container mx-auto px-6">
                <div className="flex justify-between mb-10">
                    <h2 className="text-4xl">
                        {locale === "en" ? section.nameEn : section.nameAr}
                    </h2>
                    <Link
                        href={`/products${section.urlVisit}`}
                        className="text-primary font-bold flex items-center gap-1"
                    >
                        {tCommon("viewAll")}
                        <ArrowRight size={18} className="rtl:rotate-180" />
                    </Link>
                </div>

                {!isVisible && <ProductSkeleton />}
                {isVisible && isFetching && <ProductSkeleton />}
                {isVisible && !isFetching && (
                    <AppSwiper
                        items={products}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 4 },
                        }}
                        renderSlide={(item) => <ProductCard product={item} />}
                    />
                )}
            </div>
        </section>
    );
}
