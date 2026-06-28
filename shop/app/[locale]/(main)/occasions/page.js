"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useGetOccasionsQuery } from "../../../../lib/api/homeApi";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useLocale, useTranslations } from "next-intl";

const page = () => {
   const t = useTranslations("occasionsPage");
   const tCommon = useTranslations("common");
   const locale = useLocale();
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

   let { data: occasions = [], isLoading: oLoading } = useGetOccasionsQuery();

   const description =
      occasions.length > 0 ? t("description") : t("noOccasionsDesc");

   useEffect(() => {
      console.log(occasions);
   }, [occasions]);

   return (
      <main className="container mx-auto px-6 py-12">
         <div className="mb-12">
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 uppercase tracking-widest">
               <Link className="hover:text-primary" href="/">
                  {tCommon("home")}
               </Link>
               <ChevronRightIcon
                  className={`${locale == "ar" ? "rotate-180" : ""}`}
                  fontSize="14px"
               />

               <span className="text-slate-900">{tCommon("occasions")}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900  mb-4">
               {t("title")}
            </h1>
            <p className="text-slate-600  max-w-2xl leading-relaxed">
               {description}
            </p>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {oLoading ? (
               Array(4)
                  .fill(0)
                  .map((_, i) => (
                     <div key={i} className="animate-pulse">
                        <div className="aspect-[3/4] rounded-2xl bg-slate-200  mb-4" />
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                     </div>
                  ))
            ) : occasions.length === 0 ? (
               <div className="col-span-full text-center py-20">
                  <h2 className="text-2xl font-semibold mb-2">
                     {t("noOccasionsTitle")}
                  </h2>
                  <p className="text-slate-500">{t("noOccasionsDesc")}</p>
               </div>
            ) : (
               occasions.map((occasion, i) => (
                  <Link
                     className="group occasion-card relative overflow-hidden rounded-2xl aspect-[4/5] bg-slate-50 transition-all"
                     href={`/products?occasion=${occasion.id}`}
                     key={i}
                  >
                     <img
                        alt={occasion.imgAlt}
                        className="occasion-img absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                        src={`${apiUrl}${occasion.imageUrl}`}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                     <h3 className="absolute bottom-6 left-6 text-white text-2xl font-display font-semibold mb-1">
                        {occasion.name}
                     </h3>
                  </Link>
               ))
            )}
         </div>
      </main>
   );
};

export default page;
