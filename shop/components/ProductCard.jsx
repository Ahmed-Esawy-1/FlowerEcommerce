"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useMemo } from "react";
import { useDispatch } from "react-redux";
import { encodeId } from "@/lib/hashId";
import { add } from "@/features/cart/cartSlice";
import { useLocale, useTranslations } from "next-intl";

// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { Heart } from "lucide-react";

function ProductCard({ product }) {
    const locale = useLocale();
    const t = useTranslations("common");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const dispatch = useDispatch();

    const imageUrl = useMemo(
        () => `${apiUrl}${product?.primaryImageUrl ?? ""}`,
        [apiUrl, product?.primaryImageUrl],
    );

    return (
        <div className="group bg-gradient-to-b from-marble-light to-rose/10 rounded-md overflow-hidden border border-gold/25 hover:border-gold hover:shadow-[0_16px_36px_-10px_rgba(139,32,64,0.35)] hover:-translate-y-1.5 transition-all duration-300">
            {/* IMAGE */}
            <div className="relative overflow-hidden h-56 bg-gradient-to-br from-rose/15 via-marble to-gold/10">
                {product?.status && (
                    <span className="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                        {product?.status}
                    </span>
                )}
                <Image
                    src={imageUrl}
                    alt={product?.nameEn}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                {/* gold sheen sweep on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* INFO */}
            <div className="p-4">
                <Link
                    href={`/products/${encodeId(product?.id)}`}
                    className="font-semibold text-ink text-base leading-tight hover:text-primary transition-colors block mb-3 truncate"
                >
                    {locale === "en" ? product?.nameEn : product?.nameAr}
                </Link>

                <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-primary text-lg">
                        {product?.price.toLocaleString()} {t("pound")}
                    </span>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center bg-rose/15 text-primary hover:bg-primary hover:text-white transition-colors">
                        <Heart />
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* <button className="min-w-32 flex-1 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white text-sm font-semibold py-2.5 rounded-full transition-all flex items-center justify-center gap-1 shadow-sm">
                        <ShoppingBagIcon fontSize="small" />
                        {t("shopNow")}
                    </button> */}
                    <button
                        className="min-w-32 flex-1 border border-primary text-primary hover:bg-primary hover:text-white text-sm font-semibold py-2.5 rounded-full transition-colors"
                        onClick={() =>
                            dispatch(
                                add({
                                    id: product.id,
                                    nameEn: product.nameEn,
                                    nameAr: product.nameAr,
                                    price: product.price,
                                    imageUrl: product.primaryImageUrl,
                                    quantity: product.quantity,
                                    hasColor: product.hasColor,
                                    colorNameEn:
                                        product?.productColors?.[0]?.nameEn,
                                    colorNameAr:
                                        product?.productColors?.[0]?.nameAr,
                                }),
                            )
                        }
                    >
                        {t("quickAdd")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(ProductCard);
