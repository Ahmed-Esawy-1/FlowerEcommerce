"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectTotalItems } from "@/features/cart/cartSlice";
import Dropdown from "./Dropdown";
import MobileAccordion from "./MobileAccordion";

import { Rose, Search, UserRound, ShoppingCart, Menu, X } from "lucide-react";

export default function Header({ categories = [], occasions = [] }) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const t = useTranslations("navigation");
    const tCommon = useTranslations("common");

    const [mobileOpen, setMobileOpen] = useState(false);

    const user = useSelector((state) => state.auth.user); // User Info
    const totalItems = useSelector(selectTotalItems); // Number of cart items

    // ---- CHANGE LANGUAGE -------------------------------------------------------------------------
    const changeLanguage = () => {
        const next = locale === "en" ? "ar" : "en";
        const segments = pathname.split("/");
        segments[1] = next;
        router.push(segments.join("/"));
    };

    const closeMobile = () => setMobileOpen(false);

    // --------------------------------------------------------------------------

    return (
        <>
            <header className="sticky top-0 z-50 glass-effect border-b border-gold/20">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    {/* TITLE */}
                    <div className="flex items-center gap-2 text-primary">
                        <Rose fontSize="large" />
                        <Link
                            className="font-heading text-2xl font-bold tracking-tight"
                            href="/"
                        >
                            {tCommon("flow")}
                        </Link>
                    </div>

                    {/* LINKS */}
                    <nav className="hidden lg:flex items-center gap-5 font-body">
                        <Dropdown
                            label={t("occasions")}
                            items={occasions}
                            basePath="occasions"
                        />
                        <Dropdown
                            label={t("categories")}
                            items={categories}
                            basePath="categories"
                        />
                        <Link
                            className="font-accent text-sm font-bold uppercase tracking-tight hover:text-primary transition-colors"
                            href="/products/best-sellers"
                        >
                            {t("bestSellers")}
                        </Link>
                        <Link
                            className="font-accent text-sm font-bold uppercase tracking-tight hover:text-primary transition-colors"
                            href="/products"
                        >
                            {t("shop")}
                        </Link>
                    </nav>

                    {/* SEARCH & LANGUAGE & CART  */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center bg-rose/10 rounded-full px-4 py-2">
                            <Search className="text-rose !text-xl" />
                            <input
                                className="bg-transparent border-none focus:ring-0 text-sm w-48 outline-none placeholder:text-text"
                                placeholder={t("searchPlaceholder")}
                                type="text"
                            />
                        </div>

                        {user ? (
                            <UserRound className="text-primary cursor-pointer" />
                        ) : (
                            <Link href="/login">
                                <UserRound className="text-ink" />
                            </Link>
                        )}

                        <button
                            onClick={changeLanguage}
                            className="text-sm font-semibold hover:text-primary transition-colors text-ink"
                        >
                            {locale === "en" ? "العربية" : "English"}
                        </button>

                        <Link
                            href="/cart"
                            className="relative hover:text-primary text-ink"
                        >
                            <ShoppingCart />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <button
                            className="lg:hidden text-ink"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu />
                        </button>
                    </div>
                </div>
            </header>

            {/* MOBILE */}
            <div
                className={`fixed inset-0 z-50 bg-primary-dark/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden
                    ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={closeMobile}
            />

            <div
                className={`fixed top-0 z-50 h-full w-72 bg-marble-light shadow-2xl transition-all duration-300 lg:hidden flex flex-col
                    ${locale === "ar" ? "right-0" : "left-0"}
                    ${mobileOpen ? "translate-x-0" : locale === "ar" ? "translate-x-full" : "-translate-x-full"}`}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 h-20 border-b border-gold/20">
                    <div className="flex items-center gap-2 text-primary">
                        <Rose />
                        <span className="font-heading text-xl font-bold">
                            {tCommon("flow")}
                        </span>
                    </div>
                    <button onClick={closeMobile} className="text-ink">
                        <X />
                    </button>
                </div>
                {/* LINKS */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                    <MobileAccordion
                        label={t("occasions")}
                        items={occasions}
                        basePath="occasions"
                        onClose={closeMobile}
                    />
                    <MobileAccordion
                        label={t("categories")}
                        items={categories}
                        basePath="categories"
                        onClose={closeMobile}
                    />
                    <Link
                        href="/products/best-sellers"
                        onClick={closeMobile}
                        className="block px-3 py-3 rounded-xl font-semibold text-sm uppercase tracking-widest text-ink hover:bg-rose/15 hover:text-primary transition-colors"
                    >
                        {t("bestSellers")}
                    </Link>
                    <Link
                        href="/products"
                        onClick={closeMobile}
                        className="block px-3 py-3 rounded-xl font-semibold text-sm uppercase tracking-widest text-ink hover:bg-rose/15 hover:text-primary transition-colors"
                    >
                        {t("shop")}
                    </Link>
                </nav>

                {/* PROFILE & LANGUAGE */}
                <div className="px-6 py-5 border-t border-gold/20 flex items-center justify-between">
                    <button
                        onClick={changeLanguage}
                        className="text-sm font-semibold hover:text-primary transition-colors text-ink"
                    >
                        {locale === "en" ? "العربية" : "English"}
                    </button>
                    {user ? (
                        <UserRound className="text-primary" />
                    ) : (
                        <Link href="/login" onClick={closeMobile}>
                            <UserRound className="text-ink" />
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
