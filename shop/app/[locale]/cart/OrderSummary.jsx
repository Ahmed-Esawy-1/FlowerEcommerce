"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { useFormatNumber } from "@/hooks/useFormatNumber";

import {
    ArrowRight,
    Lock,
    CreditCard,
    Banknote,
    Wallet,
    BadgeCheck,
} from "lucide-react";
import Link from "next/link";

const OrderSummary = memo(({ subtotal, packagingFee, total }) => {
    const t = useTranslations("cart");
    const { formatPrice } = useFormatNumber();

    return (
        <div className="lg:col-span-1">
            {/* ORDER SUMMARY CARD */}
            <div className="bg-white p-8 rounded-2xl border border-gold/20 shadow-lg sticky top-28">
                <h2 className="text-ink text-2xl font-bold mb-6">
                    {t("orderSummary")}
                </h2>

                {/* PRICE BREAKDOWN */}
                <div className="flex flex-col gap-4 text-slate-600">
                    <div className="flex justify-between items-center">
                        <span>{t("subtotal")}</span>
                        <span className="text-ink font-semibold">
                            {formatPrice(subtotal)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>{t("packaging")}</span>
                        <span className="text-ink font-semibold">
                            {formatPrice(packagingFee)}
                        </span>
                    </div>
                    <div className="h-px bg-gold/20 my-2"></div>
                    <div className="flex justify-between items-center text-ink text-xl font-extrabold">
                        <span>{t("total")}</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                </div>

                {/* CHECKOUT BUTTON */}
                <Link
                    href="/checkout"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl mt-8 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                >
                    <span>{t("checkout")}</span>
                    <ArrowRight className="rtl:rotate-180" />
                </Link>

                {/* SECURITY BADGES */}
                <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                        <Lock size={18} />
                        <span>{t("securePayment")}</span>
                    </div>
                    <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                        <CreditCard />
                        <Banknote />
                        <Wallet />
                    </div>
                </div>
            </div>

            {/* PROMISE CARD */}
            <div className="mt-6 p-6 rounded-xl bg-rose/10 border border-gold/20">
                <div className="flex gap-4 items-start">
                    <BadgeCheck className="text-primary shrink-0" />
                    <div>
                        <p className="text-ink font-bold text-sm uppercase tracking-wider">
                            {t("promiseTitle")}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                            {t("promiseDesc")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default OrderSummary;
