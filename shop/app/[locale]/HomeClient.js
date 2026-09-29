"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

const AppSwiper = dynamic(() => import("@/components/AppSwiper"), {
    ssr: false,
    loading: () => <div className="h-40 animate-pulse bg-rose/10 rounded-xl" />,
});

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function HomeClient({ categories, occasions }) {
    const t = useTranslations("home");
    const tCommon = useTranslations("common");
    const locale = useLocale();

    // Occasions
    const renderOccasionSlide = useCallback(
        (o) => (
            <Link key={o.id} href={`/occasions/${o.id}`}>
                <div className="rounded-3xl p-6 bg-marble-light border border-gold/20 hover:border-gold/50 hover:shadow-lg transition mb-8">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
                        <Image
                            alt={`${o.nameEn} thumbnail`}
                            src={encodeURI(`${apiUrl}${o.imageUrl}`)}
                            className="object-cover"
                            fill
                            loading="lazy"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    </div>
                    <p className="text-center font-bold text-ink">
                        {locale === "en" ? o.nameEn : o.nameAr}
                    </p>
                </div>
            </Link>
        ),
        [locale, apiUrl],
    );

    // Categories
    const renderCategorySlide = useCallback(
        (cat) => (
            <Link
                href={`/categories/${cat.id}`}
                className="group cursor-pointer block"
                key={cat.id}
            >
                <div className="relative aspect-square rounded-full overflow-hidden mb-4 bg-marble-light shadow-sm ring-1 ring-gold/25 group-hover:ring-gold group-hover:shadow-xl transition-all">
                    <Image
                        src={encodeURI(`${apiUrl}${cat.imageUrl}`)}
                        alt={`${cat.nameEn} thumbnail`}
                        fill
                        loading="lazy"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 16vw"
                    />
                </div>
                <p className="text-center font-bold text-sm uppercase tracking-wider text-ink">
                    {locale === "en" ? cat.nameEn : cat.nameAr}
                </p>
            </Link>
        ),
        [locale, apiUrl],
    );

    return (
        <>
            {/* OCCASIONS */}
            {occasions.length > 0 && (
                <section className="py-20 bg-gradient-to-b from-rose/10 to-marble">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-4xl mb-2 font-heading text-ink">
                                    {t("occasionsTitle")}
                                </h2>
                                <p className="text-text">
                                    {t("occasionsDesc")}
                                </p>
                            </div>
                            <Link
                                className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
                                href="/categories"
                            >
                                {tCommon("viewAll")}
                                <ArrowRight
                                    size={18}
                                    className="rtl:rotate-180"
                                />
                            </Link>
                        </div>

                        <AppSwiper
                            items={occasions}
                            breakpoints={{
                                0: { slidesPerView: 2 },
                                768: { slidesPerView: 3 },
                                1024: { slidesPerView: 4 },
                            }}
                            renderSlide={renderOccasionSlide}
                        />
                    </div>
                </section>
            )}

            {/* CATEGORIES */}
            {categories.length > 0 && (
                <section className="py-20 bg-gradient-to-b from-marble to-rose/10">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-4xl mb-2 font-heading text-ink">
                                    {t("categoriesTitle")}
                                </h2>
                                <p className="text-text">
                                    {t("categoriesDesc")}
                                </p>
                            </div>
                            <Link
                                className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
                                href="/categories"
                            >
                                {tCommon("viewAll")}
                                <ArrowRight
                                    size={18}
                                    className="rtl:rotate-180"
                                />
                            </Link>
                        </div>

                        <AppSwiper
                            items={categories}
                            breakpoints={{
                                0: { slidesPerView: 2 },
                                768: { slidesPerView: 4 },
                                1024: { slidesPerView: 6 },
                            }}
                            renderSlide={renderCategorySlide}
                            centerInsufficientSlides={true}
                        />
                    </div>
                </section>
            )}
        </>
    );
}

export default memo(HomeClient);
