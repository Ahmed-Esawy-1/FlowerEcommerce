"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import Hero from "./components/Hero";
import LazySection from "./components/lazySection/LazySection";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";


const AppSwiper = dynamic(() => import("./components/AppSwiper"), {
   ssr: false,
   loading: () => (
      <div className="h-40 animate-pulse bg-slate-200 rounded-xl" />
   ),
});

export default function HomeClient({
   initialSections,
   initialCategories,
   initialOccasions,
}) {
   const t = useTranslations("home");
   const tCommon = useTranslations("common");

   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

   const categories = initialCategories ?? [];
   const occasions = initialOccasions ?? [];
   const sections = initialSections ?? [];

   return (
      <main>
         <Hero />

         {/* Occasions */}
         <section className="py-20 bg-accent-pink">
            <div className="container mx-auto px-6">
               <div className="flex justify-between items-end mb-12">
                  <div>
                     <h2 className="text-4xl mb-2 font-heading">
                        {t("occasionsTitle")}
                     </h2>
                     <p className="text-slate-500">{t("occasionsDesc")}</p>
                  </div>
                  <Link
                     className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
                     href="/categories"
                  >
                     {tCommon("viewAll")}
                     <ArrowForwardIcon
                        fontSize="small"
                        className="rtl:rotate-180"
                     />
                  </Link>
               </div>

               <AppSwiper
                  items={occasions}
                  breakpoints={{
                     0: { slidesPerView: 2 },
                     768: { slidesPerView: 3 },
                     1024: { slidesPerView: 4 },
                  }}
                  renderSlide={(o) => (
                     <Link key={o.id} href={`/occasions/${o.id}`}>
                        <div className="rounded-3xl p-6 bg-[#fff1f2] hover:shadow-lg transition mb-8">
                           <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
                              <Image
                                 alt={o.name}
                                 src={encodeURI(`${apiUrl}${o.imageUrl}`)}
                                 className="object-cover"
                                 fill
                                 sizes="(max-width: 768px) 50vw, 25vw"
                              />
                           </div>
                           <p className="text-center font-bold">{o.name}</p>
                        </div>
                     </Link>
                  )}
               />
            </div>
         </section>

         {/* Categories */}
         <section className="py-20 bg-accent-pink">
            <div className="container mx-auto px-6">
               <div className="flex justify-between items-end mb-12">
                  <div>
                     <h2 className="text-4xl mb-2 font-heading">
                        {t("categoriesTitle")}
                     </h2>
                     <p className="text-slate-500">{t("categoriesDesc")}</p>
                  </div>
                  <Link
                     className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
                     href="/categories"
                  >
                     {tCommon("viewAll")}
                     <ArrowForwardIcon
                        fontSize="small"
                        className="rtl:rotate-180"
                     />
                  </Link>
               </div>

               <AppSwiper
                  items={categories}
                  breakpoints={{
                     0: { slidesPerView: 2 },
                     768: { slidesPerView: 4 },
                     1024: { slidesPerView: 6 },
                  }}
                  renderSlide={(cat) => (
                     <Link
                        href={`/categories/${cat.id}`}
                        className="group cursor-pointer block"
                     >
                        <div className="relative aspect-square rounded-full overflow-hidden mb-4 bg-white shadow-sm ring-1 ring-slate-100 group-hover:shadow-xl transition-all">
                           <Image
                              src={encodeURI(`${apiUrl}${cat.imageUrl}`)}
                              alt={`${cat.name} thumbnail`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 50vw, 16vw"
                           />
                        </div>
                        <p className="text-center font-bold text-sm uppercase tracking-wider">
                           {cat.name}
                        </p>
                     </Link>
                  )}
                  centerInsufficientSlides={true}
               />
            </div>
         </section>

         {/* Sections */}
         <div style={{ minHeight: "1px" }}>
            {sections
               .filter((s) => s.isActive)
               .map((section) => (
                  <LazySection key={section.id} section={section} />
               ))}
         </div>

         {/* Partnerships */}
         <section className="py-16 border-y border-slate-100">
            <div className="container mx-auto px-6">
               <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-10">
                  Trusted Partnerships
               </p>
               <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                  {["PATCHI", "PANDORA", "GUESS", "MARELLA", "POLICE"].map(
                     (brand) => (
                        <div
                           key={brand}
                           className="h-8 font-display text-2xl font-black"
                        >
                           {brand}
                        </div>
                     ),
                  )}
               </div>
            </div>
         </section>

         {/* Sign Up */}
         <section className="py-20">
            <div className="container mx-auto px-6">
               <div className="bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-white">
                  <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none flex items-center justify-center">
                     <LocalFloristIcon sx={{ fontSize: "20rem" }} />
                  </div>
                  <div className="relative z-10 max-w-2xl">
                     <h2 className="font-display text-5xl mb-6">
                        Never miss a special <br /> moment again.
                     </h2>
                     <p className="text-white/80 text-lg mb-10">
                        Sign up for our newsletter to receive weekly inspiration
                        and exclusive offers.
                     </p>
                     <Link
                        href="/signup"
                        className="bg-white text-primary font-bold px-10 py-4 rounded-2xl hover:scale-105 transition-transform"
                     >
                        Subscribe
                     </Link>
                  </div>
               </div>
            </div>
         </section>
      </main>
   );
}
