"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, clear } from "@/features/cart/cartSlice";
import { useCreateOrderMutation } from "@/lib/api/ordersApi";
import { useFormatNumber } from "@/hooks/useFormatNumber";

import {
    MapPin,
    CheckCircle,
    Banknote,
    Truck,
    Wallet,
    CreditCard,
    ArrowLeft,
    ArrowRight,
} from "lucide-react";

const STEPS = ["info", "review", "payment"];

const PAYMENT_METHODS = [
    { value: "CASH_ON_DELIVERY", labelKey: "cod", icon: Truck },
    { value: "CREDIT_CARD", labelKey: "card", icon: CreditCard },
    {
        value: "MOBILE_WALLET",
        labelKey: "wallet",
        icon: Wallet,
    },
];

export default function CheckoutPage() {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("checkout");
    const dispatch = useDispatch();
    const { formatPrice } = useFormatNumber();

    const cartItems = useSelector(selectCartItems);
    const userId = useSelector((state) => state.auth?.user?.id); // adjust to your auth slice

    const [stepIndex, setStepIndex] = useState(0);
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [error, setError] = useState(null);

    const [createOrder, { isLoading }] = useCreateOrderMutation();

    const subtotal = useMemo(
        () =>
            cartItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0,
            ),
        [cartItems],
    );
    const packagingFee = 15;
    const total = subtotal + packagingFee;

    const step = STEPS[stepIndex];

    const canGoNext = () => {
        if (step === "info") return address.trim().length > 5;
        if (step === "review") return cartItems.length > 0;
        return true;
    };

    const goNext = () => {
        if (!canGoNext()) return;
        setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    };
    const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

    const handlePlaceOrder = async () => {
        if (!paymentMethod) return;
        setError(null);

        try {
            const payload = {
                userId,
                address,
                paymentMethod,
                items: cartItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            const order = await createOrder(payload).unwrap();
            dispatch(clear());
            router.push(`/checkout/confirmation?orderId=${order.id}`);
        } catch (err) {
            setError(err?.data?.message || t("orderFailed"));
        }
    };

    return (
        <div className="flex-1 px-6 md:px-20 py-10 bg-marble-light">
            <div className="max-w-4xl mx-auto">
                {/* STEPPER HEADER */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center gap-4">
                            <div
                                className={`flex items-center gap-2 ${
                                    i <= stepIndex
                                        ? "text-primary"
                                        : "text-slate-300"
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                                        i <= stepIndex
                                            ? "bg-primary text-white border-primary"
                                            : "border-slate-200"
                                    }`}
                                >
                                    {i + 1}
                                </div>
                                <span className="text-sm font-semibold hidden sm:inline">
                                    {t(`steps.${s}`)}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className="w-8 h-px bg-gold/30" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gold/15 shadow-sm">
                    {/* STEP 1: INFO */}
                    {step === "info" && (
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin className="text-primary" />
                                <h2 className="text-ink text-2xl font-bold">
                                    {t("shippingInfo")}
                                </h2>
                            </div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                                {t("address")}
                            </label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={4}
                                placeholder={t("addressPlaceholder")}
                                className="w-full rounded-xl border border-gold/20 p-4 text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>
                    )}

                    {/* STEP 2: REVIEW */}
                    {step === "review" && (
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <CheckCircle className="text-primary" />
                                <h2 className="text-ink text-2xl font-bold">
                                    {t("reviewOrder")}
                                </h2>
                            </div>

                            <div className="flex flex-col gap-4 mb-6">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center border-b border-gold/10 pb-3"
                                    >
                                        <div>
                                            <p className="text-ink font-semibold">
                                                {locale === "en"
                                                    ? item.nameEn
                                                    : item.nameAr}
                                            </p>
                                            <p className="text-slate-500 text-sm">
                                                {t("qty")}: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-ink font-semibold">
                                            {formatPrice(
                                                item.price * item.quantity,
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between text-slate-600 mb-1">
                                <span>{t("subtotal")}</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 mb-3">
                                <span>{t("packaging")}</span>
                                <span>{formatPrice(packagingFee)}</span>
                            </div>
                            <div className="flex justify-between text-ink text-xl font-extrabold pt-3 border-t border-gold/20">
                                <span>{t("total")}</span>
                                <span>{formatPrice(total)}</span>
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-rose/10 border border-gold/20">
                                <p className="text-ink text-sm font-semibold">
                                    {t("shipTo")}
                                </p>
                                <p className="text-slate-500 text-sm mt-1">
                                    {address}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: PAYMENT */}
                    {step === "payment" && (
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Banknote className="text-primary" />
                                <h2 className="text-ink text-2xl font-bold">
                                    {t("choosePayment")}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {PAYMENT_METHODS.map(
                                    ({ value, labelKey, icon: Icon }) => (
                                        <button
                                            key={value}
                                            onClick={() =>
                                                setPaymentMethod(value)
                                            }
                                            className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all cursor-pointer ${
                                                paymentMethod === value
                                                    ? "border-primary bg-primary/5"
                                                    : "border-gold/20 hover:border-primary/40"
                                            }`}
                                        >
                                            <Icon
                                                className={
                                                    paymentMethod === value
                                                        ? "text-primary"
                                                        : "text-slate-400"
                                                }
                                            />
                                            <span className="text-ink font-semibold text-sm">
                                                {t(
                                                    `paymentMethods.${labelKey}`,
                                                )}
                                            </span>
                                        </button>
                                    ),
                                )}
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm mt-4 text-center">
                                    {error}
                                </p>
                            )}
                        </div>
                    )}

                    {/* NAV BUTTONS */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gold/10">
                        <button
                            onClick={goBack}
                            disabled={stepIndex === 0}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-500 disabled:opacity-0 hover:bg-slate-50 transition-all"
                        >
                            <ArrowLeft
                                fontSize="small"
                                className="rtl:rotate-180"
                            />
                            {t("back")}
                        </button>

                        {step !== "payment" ? (
                            <button
                                onClick={goNext}
                                disabled={!canGoNext()}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-bold py-3 px-8 rounded-xl transition-all"
                            >
                                {t("next")}
                                <ArrowRight
                                    fontSize="small"
                                    className="rtl:rotate-180"
                                />
                            </button>
                        ) : (
                            <button
                                onClick={handlePlaceOrder}
                                disabled={!paymentMethod || isLoading}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-bold py-3 px-8 rounded-xl transition-all"
                            >
                                {isLoading
                                    ? t("placingOrder")
                                    : t("placeOrder")}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
