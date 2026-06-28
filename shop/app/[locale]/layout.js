import "./globals.css";
import "./app.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import StoreProvider from "@/app/[locale]/(main)/storeProvider";

export const metadata = {
   title: "Flow",
   description: "Luxury gifts and flowers",
};


import {
   Inter,
   Cormorant_Garamond,
   Playwrite_GB_J,
   Alexandria,
   Aref_Ruqaa,
} from "next/font/google";

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

   const isArabic = locale === "ar";
   return (
      <html
         lang={locale}
         dir={isArabic ? "rtl" : "ltr"}
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
            <StoreProvider>
               <NextIntlClientProvider messages={messages}>
                  {children}
               </NextIntlClientProvider>
            </StoreProvider>
         </body>
      </html>
   );
}
