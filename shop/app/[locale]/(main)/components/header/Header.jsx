"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectTotalItems } from "@/features/cart/cartSlice";
import Dropdown from "./Dropdown";
import MobileAccordion from "./MobileAccordion";

import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";


export default function Header({ categories = [], occasions = [] }) {
   const t = useTranslations("navigation");
   const tCommon = useTranslations("common");
   const [mobileOpen, setMobileOpen] = useState(false);

   const user = useSelector((state) => state.auth.user);
   const totalItems = useSelector(selectTotalItems);

   const locale = useLocale();
   const router = useRouter();
   const pathname = usePathname();

   const handleSwitch = () => {
      const next = locale === "en" ? "ar" : "en";
      const segments = pathname.split("/");
      segments[1] = next;
      router.push(segments.join("/"));
   };

   const closeMobile = () => setMobileOpen(false);

   return (
      <>
         <header className="sticky top-0 z-50 glass-effect border-b border-slate-200">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
               <div className="flex items-center gap-2 text-primary">
                  <LocalFloristIcon fontSize="large" />
                  <Link
                     className="font-heading text-2xl font-bold tracking-tight"
                     href="/"
                  >
                     {tCommon("flow")}
                  </Link>
               </div>

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
                     href="/#bestSeller"
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

               <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2">
                     <SearchIcon className="text-slate-400 !text-xl" />
                     <input
                        className="bg-transparent border-none focus:ring-0 text-sm w-48 outline-none"
                        placeholder="Search gifts..."
                        type="text"
                     />
                  </div>

                  {user ? (
                     <PersonIcon className="text-primary cursor-pointer" />
                  ) : (
                     <Link href="/login">
                        <PersonIcon />
                     </Link>
                  )}

                  <button
                     onClick={handleSwitch}
                     className="text-sm font-semibold hover:text-primary transition-colors"
                  >
                     {locale === "en" ? "العربية" : "English"}
                  </button>

                  <Link href="/cart" className="relative hover:text-primary">
                     <ShoppingCartIcon />
                     {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                           {totalItems}
                        </span>
                     )}
                  </Link>

                  <button
                     className="lg:hidden"
                     onClick={() => setMobileOpen(true)}
                  >
                     <MenuIcon />
                  </button>
               </div>
            </div>
         </header>

         {/* Mobile */}
         {/* Backdrop */}
         <div
            className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden
            ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={closeMobile}
         />

         {/* Drawer */}
         <div
            className={`fixed top-0 z-50 h-full w-72 bg-white shadow-2xl transition-all duration-300 lg:hidden flex flex-col
          ${locale === "ar" ? "right-0" : "left-0"}
          ${mobileOpen ? "translate-x-0" : locale === "ar" ? "translate-x-full" : "-translate-x-full"}`}
         >
            <div className="flex items-center justify-between px-6 h-20 border-b border-slate-100">
               <div className="flex items-center gap-2 text-primary">
                  <LocalFloristIcon />
                  <span className="font-heading text-xl font-bold">Flow</span>
               </div>
               <button onClick={closeMobile}>
                  <CloseIcon />
               </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
               <MobileAccordion
                  label={t("occasions")}
                  items={occasions}
                  shopQuery="occasion="
                  basePath="occasions"
                  onClose={closeMobile}
               />
               <MobileAccordion
                  label={t("categories")}
                  items={categories}
                  shopQuery="category="
                  basePath="categories"
                  onClose={closeMobile}
               />
               <Link
                  href="/#bestSeller"
                  onClick={closeMobile}
                  className="block px-3 py-3 rounded-xl font-semibold text-sm uppercase tracking-widest hover:bg-rose-50 hover:text-primary transition-colors"
               >
                  {t("bestSellers")}
               </Link>
               <Link
                  href="/products"
                  onClick={closeMobile}
                  className="block px-3 py-3 rounded-xl font-semibold text-sm uppercase tracking-widest hover:bg-rose-50 hover:text-primary transition-colors"
               >
                  {t("shop")}
               </Link>
            </nav>

            <div className="px-6 py-5 border-t border-slate-100 flex items-center justify-between">
               <button
                  onClick={handleSwitch}
                  className="text-sm font-semibold hover:text-primary transition-colors"
               >
                  {locale === "en" ? "العربية" : "English"}
               </button>
               {user ? (
                  <PersonIcon className="text-primary" />
               ) : (
                  <Link href="/login" onClick={closeMobile}>
                     <PersonIcon />
                  </Link>
               )}
            </div>
         </div>
      </>
   );
}
