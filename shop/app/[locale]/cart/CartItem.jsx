"use client";

import { memo } from "react";
import { useLocale } from "next-intl";
import { useDispatch } from "react-redux";
import { remove, increase, decrease } from "@/features/cart/cartSlice";
import { apiUrl } from "@/lib/apiUrl";
import { useFormatNumber } from "@/hooks/useFormatNumber";
import Image from "next/image";

import { Minus, Plus, Trash2 } from "lucide-react";

const CartItem = memo(({ item }) => {
    const locale = useLocale();
    const { formatPrice } = useFormatNumber();
    const dispatch = useDispatch();

    const isMinQuantity = item.quantity === 1;
    const isMaxQuantity = item.quantity === 3;

    return (
        <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl border border-gold/15 shadow-sm">
            {/* IMAGE */}
            <div className="aspect-square w-full md:w-40 min-h-40 max-h-60 shrink-0 relative rounded-xl overflow-hidden">
                <Image
                    src={`${apiUrl}${item.imageUrl}`}
                    alt={`${item.nameEn} thumbnail`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 160px"
                    priority={false}
                />
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 flex-col justify-between py-1">
                {/* TITLE & PRICE */}
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="text-ink text-xl font-bold">
                            {locale === "en" ? item.nameEn : item.nameAr}
                            {item.hasColor && (
                                <p className="text-ink text-sm font-normal">
                                    | (
                                    {locale === "en"
                                        ? item.colorNameEn
                                        : item.colorNameAr}
                                    )
                                </p>
                            )}
                        </h3>
                        <p className="text-primary font-semibold text-lg mt-1">
                            {formatPrice(item.price)}
                        </p>
                    </div>

                    {/* DELETE BUTTON */}
                    <button
                        className="text-slate-400 hover:text-primary transition-colors cursor-pointer p-2"
                        onClick={() => dispatch(remove(item.id))}
                        aria-label="Remove item"
                    >
                        <Trash2 />
                    </button>
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="flex items-center gap-3 bg-rose/10 rounded-lg p-1 border border-gold/20 w-fit mt-4">
                    {/* DECREASE */}
                    <button
                        className={`flex h-8 w-8 items-center justify-center rounded-md transition-all shadow-sm ${
                            isMinQuantity
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-white text-primary hover:bg-primary hover:text-white cursor-pointer"
                        }`}
                        onClick={() => dispatch(decrease(item.id))}
                        disabled={isMinQuantity}
                        aria-label="Decrease quantity"
                    >
                        <Minus size={22} />
                    </button>

                    {/* QUANTITY */}
                    <span className="text-ink font-bold w-4 text-center">
                        {item.quantity}
                    </span>

                    {/* INCREASE */}
                    <button
                        className={`flex h-8 w-8 items-center justify-center rounded-md transition-all shadow-sm ${
                            isMaxQuantity
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-white text-primary hover:bg-primary hover:text-white cursor-pointer"
                        }`}
                        onClick={() => dispatch(increase(item.id))}
                        disabled={isMaxQuantity}
                        aria-label="Increase quantity"
                    >
                        <Plus size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
});

export default CartItem;
