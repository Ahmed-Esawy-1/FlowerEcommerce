"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLocale, useTranslations } from "next-intl";

import { useFormatNumber } from "@/hooks/useFormatNumber";
import { add } from "@/features/cart/cartSlice";
import { useGetProductQuery } from "@/lib/api/homeApi";
import { decodeId } from "@/lib/hashId";
import AppSwiper from "@/components/AppSwiper";

import { Plus, Expand } from "lucide-react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Product() {
    const { formatPrice } = useFormatNumber();

    const locale = useLocale();
    const t = useTranslations("product");
    const dispatch = useDispatch();

    const { id: hashedId } = useParams();
    const realId = decodeId(hashedId);

    const [selectedColor, setSelectedColor] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [descIsOpen, setdescIsOpen] = useState(false);

    if (realId === null) {
        return;
    }

    const { data: product = [] } = useGetProductQuery(realId);

    // ---- DEFAULT (COLOR & MAIN IMAGE) -------------------------------------------------
    useEffect(() => {
        if (product) {
            if (product?.hasColor && product?.productColors?.length) {
                setSelectedColor(product.productColors[0]);
                setMainImage(product.productColors[0]?.images?.[0]?.imageUrl);
            } else {
                setMainImage(product.primaryImageUrl);
            }
        }
    }, [product]);

    // ---- IMAGES --------------------------------------------------
    const images =
        product?.hasColor && selectedColor
            ? selectedColor.images
            : product?.images || [];

    return (
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* PRODUCT IMAGES */}
                <div className="lg:col-span-7 space-y-4">
                    {/* MAIN IMAGE */}
                    <div className="relative w-full max-h-[65vh] sm:max-h-[500px] lg:max-h-none lg:aspect-square bg-marble rounded-xl overflow-hidden border border-gold/20">
                        <img
                            alt={`${product?.nameEn} thumbnail`}
                            className="w-full h-full max-h-[65vh] sm:max-h-[500px] lg:max-h-none object-cover"
                            src={
                                apiUrl + (mainImage || product?.primaryImageUrl)
                            }
                        />
                    </div>

                    {/* THUMBNAILS */}
                    <div className="relative">
                        <AppSwiper
                            items={images}
                            breakpoints={{
                                0: { slidesPerView: 3 },
                                640: { slidesPerView: 4 },
                                1024: { slidesPerView: 4 },
                            }}
                            renderSlide={(img) => (
                                <div
                                    onClick={() => setMainImage(img.imageUrl)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                                        mainImage === img.imageUrl
                                            ? "border-primary ring-2 ring-primary/20 ring-offset-2"
                                            : "border-gold/20 hover:border-gold/50"
                                    }`}
                                >
                                    <img
                                        alt="thumbnail"
                                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                                        src={apiUrl + img.imageUrl}
                                    />
                                </div>
                            )}
                        />
                    </div>
                </div>

                {/* PRODUCT DETAILS */}
                <div className="lg:col-span-5 space-y-8">
                    {/* NAME */}

                    <h1 className="text-ink text-3xl lg:text-4xl font-accent font-medium leading-tight  space-y-4">
                        {locale === "en" ? product.nameEn : product.nameAr}
                    </h1>

                    {/* COLORS */}
                    {product?.hasColor &&
                        product?.productColors?.length > 0 && (
                            <div className="p-6 border border-gold/20 rounded-xl bg-marble/50">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                    {t("selectColor")}
                                </label>

                                <div className="flex flex-wrap gap-3">
                                    {product.productColors.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => {
                                                setSelectedColor(color);
                                                setMainImage(
                                                    color.images?.[0]?.imageUrl,
                                                );
                                            }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                                                selectedColor?.id === color.id
                                                    ? "border-primary bg-white shadow-sm"
                                                    : "border-gold/20 bg-marble hover:bg-white hover:border-gold/50"
                                            }`}
                                        >
                                            <span
                                                className="w-4 h-4 rounded-full border border-black/10"
                                                style={{
                                                    backgroundColor:
                                                        color.hexCode,
                                                }}
                                            />
                                            <span className="text-sm font-medium text-ink">
                                                {locale === "en"
                                                    ? color.nameEn
                                                    : color.nameAr}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                    {/* PRICE + CART */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 p-6 border border-gold/20 rounded-xl bg-marble/50 flex flex-col justify-center">
                            <span className="text-xs text-slate-400 uppercase tracking-tighter">
                                {t("priceIncludesVat")}
                            </span>
                            <span className="text-3xl font-bold text-primary">
                                {formatPrice(product?.price)}
                            </span>
                        </div>

                        <button
                            onClick={() =>
                                dispatch(
                                    add({
                                        id: product.id,
                                        nameEn: product.nameEn,
                                        nameAr: product.nameAr,
                                        price: product.price,
                                        imageUrl: product.primaryImageUrl,
                                        hasColor: product.hasColor,
                                        quantity: product.quantity,
                                        colorNameEn: selectedColor?.nameEn,
                                        colorNameAr: selectedColor?.nameAr,
                                    }),
                                )
                            }
                            className="flex-[1.5] bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-lg rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 py-4 sm:py-0"
                        >
                            <Plus />
                            {t("addToCart")}
                        </button>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="pt-4">
                        <button
                            onClick={() => setdescIsOpen(!descIsOpen)}
                            className="w-full py-4 border border-gold/20 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-marble/50 hover:border-gold/40 transition-colors text-ink"
                        >
                            {t("description")}
                            <Expand
                                className={`transition-transform duration-200 ${descIsOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                descIsOpen
                                    ? "max-h-96 opacity-100 py-4"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <div className="text-slate-600 text-sm leading-relaxed">
                                {(locale === "en"
                                    ? product.descriptionEn
                                    : product.descriptionAr) ||
                                    t("noDescription")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RELATED PRODUCTS */}
            <section className="mt-32 mb-20">
                <h2 className="text-3xl font-bold mb-12 text-ink">
                    {t("relatedTitle")}
                </h2>
            </section>
        </main>
    );
}
