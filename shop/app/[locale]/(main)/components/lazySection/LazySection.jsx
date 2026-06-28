"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import useInView from "./useInView";
import { useGetSectionProductsQuery } from "@/lib/api/homeApi";
import ProductSkeleton from "../loading/ProductSkeleton";
import ProductCard from "../ProductCard";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const AppSwiper = dynamic(() => import("../AppSwiper"), {
   ssr: false,
   loading: () => (
      <div className="h-40 animate-pulse bg-slate-200 rounded-xl" />
   ),
});

export default function LazySection({ section }) {
   const { ref, isVisible } = useInView();

   const { data: products = [], isLoading } = useGetSectionProductsQuery(
      section.id,
      { skip: !isVisible },
   );

   return (
      <section ref={ref} className="py-20" style={{ minHeight: "320px" }}>
         <div className="container mx-auto px-6">
            <div className="flex justify-between mb-10">
               <h2 className="text-4xl">{section.name}</h2>
               <Link
                  href={`/sections/${section.id}`}
                  className="text-primary font-bold flex items-center gap-1"
               >
                  View All
                  <ArrowForwardIcon fontSize="small" />
               </Link>
            </div>

            {!isVisible && <ProductSkeleton />}
            {isVisible && isLoading && <ProductSkeleton />}
            {isVisible && !isLoading && (
               <AppSwiper
                  items={products}
                  breakpoints={{
                     0: { slidesPerView: 1 },
                     640: { slidesPerView: 2 },
                     1024: { slidesPerView: 4 },
                  }}
                  renderSlide={(item) => <ProductCard product={item} />}
               />
            )}
         </div>
      </section>
   );
}
