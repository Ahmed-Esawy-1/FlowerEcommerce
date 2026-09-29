import "./globals.css";
import "./app.css";

import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Toaster } from "sonner";

import StoreProvider from "@/providers/storeProvider";
import { NextIntlClientProvider } from "next-intl";
import CartInitializer from "@/features/cart/CartInitializer";
import AuthInitializer from "@/features/auth/AuthInitializer";
import { fetchCategories, fetchOccasions } from "@/lib/api/serverFetch";
import { makeStore } from "@/lib/store";

import Header from "@/components/header/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Flow",
    description: "Luxury gifts and flowers",
    icons: {
        icon: "/images/icon.png",
    },
};

// ---- FONTS ---------------------------------------------
import {
    Inter,
    Cormorant_Garamond,
    Playwrite_GB_J,
    Alexandria,
    Aref_Ruqaa,
} from "next/font/google";
import { homeApi } from "@/lib/api/homeApi";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-body-en",
});

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    variable: "--font-heading-en",
});

const playwrite = Playwrite_GB_J({
    subsets: ["latin"],
    variable: "--font-accent-en",
});

const alexandria = Alexandria({
    subsets: ["arabic"],
    variable: "--font-body-ar",
});

const arefRuqaa = Aref_Ruqaa({
    subsets: ["arabic"],
    weight: ["400", "700"],
    variable: "--font-heading-ar",
});

export default async function RootLayout({ children, params }) {
    const { locale } = await params;

    if (!routing.locales.includes(locale)) notFound();

    const messages = await getMessages();

    const [categories, occasions] = await Promise.all([
        fetchCategories(),
        fetchOccasions(),
    ]);

    const store = makeStore();

    // Store the fetched data in Redux cache
    await Promise.all([
        categories?.length > 0
            ? store.dispatch(
                  homeApi.util.upsertQueryData(
                      "getCategories",
                      undefined,
                      categories,
                  ),
              )
            : Promise.resolve(),
        occasions?.length > 0
            ? store.dispatch(
                  homeApi.util.upsertQueryData(
                      "getOccasions",
                      undefined,
                      occasions,
                  ),
              )
            : Promise.resolve(),
    ]);

    const preloadedState = store.getState();

    return (
        <html
            lang={locale}
            dir={locale === "ar" ? "rtl" : "ltr"}
            suppressHydrationWarning
            className={`
            ${inter.variable}
            ${cormorant.variable}
            ${playwrite.variable}
            ${alexandria.variable}
            ${arefRuqaa.variable}
        `}
        >
            <body>
                <StoreProvider preloadedState={preloadedState}>
                    <NextIntlClientProvider messages={messages}>
                        <AuthInitializer>
                            <CartInitializer>
                                <div>
                                    <Header
                                        categories={categories}
                                        occasions={occasions}
                                    />
                                    {children}
                                    <Footer />
                                </div>
                                <Toaster richColors position="top-center" />
                            </CartInitializer>
                        </AuthInitializer>
                    </NextIntlClientProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
