"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { selectCartItems, selectCartLoading } from "@/features/cart/cartSlice";

import Spinner from "@/components/loading/spinner";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";

const CartContent = () => {
    const t = useTranslations("cart");

    const cartItems = useSelector(selectCartItems); // Items
    const cartLoading = useSelector(selectCartLoading); // Loading

    // Sub Totals
    const subtotal = useMemo(
        () =>
            cartItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0,
            ),
        [cartItems],
    );

    const packagingFee = 15;
    const total = Number(subtotal) + packagingFee; // Total

    const isEmpty = !cartLoading && cartItems.length === 0; // Empty

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* LOADING */}
                {cartLoading && <Spinner />}

                {/* EMPTY  */}
                {isEmpty && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gold/15">
                        <h2 className="text-2xl font-bold text-ink mb-2">
                            {t("emptyTitle")}
                        </h2>
                        <p className="text-slate-500">{t("emptyDesc")}</p>
                    </div>
                )}

                {/* ITEMS LIST */}
                {!cartLoading &&
                    cartItems.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
            </div>

            {/* ORDER SUMMARY  */}
            <OrderSummary
                subtotal={subtotal}
                packagingFee={packagingFee}
                total={total}
            />
        </div>
    );
};

export default CartContent;
