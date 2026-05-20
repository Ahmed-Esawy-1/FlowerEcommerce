"use client";

import Link from "next/link";
import {
   useGetCategoriesQuery,
   useGetProductsQuery,
   useGetOccasionsQuery,
   useGetBestSellersQuery,
   useGetSectionsQuery,
} from "../../lib/api/homeApi";

import Hero from "./components/Hero";
import AppSwiper from "./components/AppSwiper";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { useEffect } from "react";
import Card from "./components/Card";

export default function HomeClient() {
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

   const { data: categories = [], isLoading: cLoading } =
      useGetCategoriesQuery();
   const { data: occasions = [], isLoading: oLoading } = useGetOccasionsQuery();
   const firstOccasion = occasions[0];
   const { data: products = [], isLoading: pLoading } = useGetProductsQuery();
   const { data: bestSellers = [], isLoading: bLoading } =
      useGetBestSellersQuery();
   const { data: sections = [], isLoading: sLoading } = useGetSectionsQuery();

   useEffect(() => {
      console.log("categories => ", categories);
      console.log("occasions => ", occasions);
      console.log("products => ", products);
      console.log("bestSellers => ", bestSellers);
      console.log("sections => ", sections);
   }, [categories, occasions, products, bestSellers, sections]);

   return (
      <main>
         <Hero />
         {/* Categories */}
         <section className="py-20 bg-accent-pink">
            <div className="container mx-auto px-6">
               <div className="flex justify-between items-end mb-12">
                  <div>
                     <h2 className="font-display text-4xl mb-2">
                        Shop by Category
                     </h2>
                     <p className="text-slate-500">
                        Find the perfect expression for your feelings
                     </p>
                  </div>
                  <Link
                     className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
                     href="/categories"
                  >
                     View All Categories
                     <ArrowForwardIcon fontSize="small" />
                  </Link>
               </div>

               {cLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                     {Array(6)
                        .fill(0)
                        .map((_, i) => (
                           <div key={i} className="animate-pulse">
                              <div className="aspect-square rounded-2xl bg-slate-200 mb-4" />
                              <div className="h-3 bg-slate-200 rounded w-2/3 mx-auto" />
                           </div>
                        ))}
                  </div>
               ) : (
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
                           <div className="aspect-square rounded-full overflow-hidden mb-4 bg-white shadow-sm ring-1 ring-slate-100 group-hover:shadow-xl transition-all">
                              <img
                                 alt={`${cat.name} thumbnail`}
                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                 src={`${apiUrl}${cat.imageUrl}`}
                              />
                           </div>
                           <p className="text-center font-bold text-sm uppercase tracking-wider">
                              {cat.name}
                           </p>
                        </Link>
                     )}
                  />
               )}
            </div>
         </section>

         {/* Occasions */}
         <section className="py-20" id="bestSeller">
            <div className="container mx-auto px-6">
               <div className="text-center mb-16">
                  <h2 className="font-display text-5xl mb-4">
                     Our Best Sellers
                  </h2>
                  <p className="text-slate-500 max-w-xl mx-auto">
                     Handpicked favorites that have captured hearts and made
                     moments unforgettable.
                  </p>
               </div>

               {oLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                     {Array(4)
                        .fill(0)
                        .map((_, i) => (
                           <div key={i} className="animate-pulse">
                              <div className="aspect-[3/4] rounded-2xl bg-slate-200 mb-4" />
                              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                              <div className="h-4 bg-slate-200 rounded w-1/2" />
                           </div>
                        ))}
                  </div>
               ) : (
                  <>
                     <div className="flex items-center gap-4">
                        {/* FIRST OCCASION */}
                        {firstOccasion && (
                           <Link
                              href={`/occasions/${firstOccasion.id}`}
                              className="relative group cursor-pointer w-[160px] sm:w-[180px] md:w-[200px] shrink-0"
                           >
                              <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-slate-100">
                                 {/* IMAGE */}
                                 <img
                                    alt={firstOccasion.name}
                                    src={`${apiUrl}${firstOccasion.imageUrl}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                 />

                                 {/* OVERLAY */}
                                 <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-all duration-300" />

                                 {/* TEXT */}
                                 <p className="absolute inset-x-0 top-4 text-center font-bold text-sm uppercase tracking-wider text-white z-10">
                                    {firstOccasion.name}
                                 </p>
                              </div>
                           </Link>
                        )}

                        {/* SWIPER */}
                        <AppSwiper
                           items={occasions}
                           breakpoints={{
                              0: { slidesPerView: 2 },
                              768: { slidesPerView: 3 },
                              1024: { slidesPerView: 6 },
                           }}
                           renderSlide={(occ, i) => (
                              <Link
                                 href={`/occasions/${occ.id}`}
                                 className={`relative group cursor-pointer block w-[140px] sm:w-[160px] md:w-[180px]`}
                              >
                                 <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-white">
                                    {/* IMAGE */}
                                    <img
                                       alt={occ.name}
                                       src={`${apiUrl}${occ.imageUrl}`}
                                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* OVERLAY */}
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-all duration-300" />

                                    {/* TEXT */}
                                    <p className="absolute inset-x-0 top-4 text-center font-bold text-sm uppercase tracking-wider text-white z-10">
                                       {occ.name}
                                    </p>
                                 </div>
                              </Link>
                           )}
                           spaceBetween={20}
                        />
                     </div>
                  </>
               )}
            </div>
         </section>

         {/* ───── DYNAMIC SECTIONS ───── */}
         {sections.map((section) => (
            <section key={section.id} className="py-20">
               <div className="container mx-auto px-6">
                  {/* Section Header */}
                  <div className="flex justify-between items-end mb-12">
                     <div>
                        <h2 className="font-display text-4xl mb-2">
                           {section.name}
                        </h2>
                     </div>
                     <Link
                        className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
                        href={`/sections/${section.id}`}
                     >
                        View All
                        <ArrowForwardIcon fontSize="small" />
                     </Link>
                  </div>

                  {/* Products Swiper */}
                  {sLoading ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Array(4)
                           .fill(0)
                           .map((_, i) => (
                              <div key={i} className="animate-pulse">
                                 <div className="aspect-[3/4] rounded-2xl bg-slate-200 mb-4" />
                                 <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                                 <div className="h-4 bg-slate-200 rounded w-1/2" />
                              </div>
                           ))}
                     </div>
                  ) : (
                     <AppSwiper
                        items={section.products} // ← products come from the section
                        breakpoints={{
                           0: { slidesPerView: 1 },
                           640: { slidesPerView: 2 },
                           1024: { slidesPerView: 4 },
                        }}
                        renderSlide={(item) => <Card item={item} />}
                     />
                  )}
               </div>
            </section>
         ))}

         {/* Best Sellers */}
         {/* <section className="py-20" id="bestSeller">
            <div className="container mx-auto px-6">
               <div className="text-center mb-16">
                  <h2 className="font-display text-5xl mb-4">
                     Our Best Sellers
                  </h2>
                  <p className="text-slate-500 max-w-xl mx-auto">
                     Handpicked favorites that have captured hearts and made
                     moments unforgettable.
                  </p>
               </div>

               {pLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                     {Array(4)
                        .fill(0)
                        .map((_, i) => (
                           <div key={i} className="animate-pulse">
                              <div className="aspect-[3/4] rounded-2xl bg-slate-200 mb-4" />
                              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                              <div className="h-4 bg-slate-200 rounded w-1/2" />
                           </div>
                        ))}
                  </div>
               ) : (
                  <>
                     <AppSwiper
                        items={bestSellers}
                        breakpoints={{
                           0: { slidesPerView: 1 },
                           640: { slidesPerView: 2 },
                           1024: { slidesPerView: 4 },
                        }}
                        renderSlide={(item) => <Card item={item} />}
                     />
                  </>
               )}
            </div>
         </section> */}

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

         {/* ───── SIGN UP ───── */}
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
