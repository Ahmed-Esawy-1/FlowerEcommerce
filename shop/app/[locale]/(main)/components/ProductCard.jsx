"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useMemo } from "react";
import { useDispatch } from "react-redux";
import { add } from "@/features/cart/cartSlice";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useTranslations } from "next-intl";

function ProductCard({ product }) {
   const t = useTranslations("common");
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
   const dispatch = useDispatch();

   const imageUrl = useMemo(
      () => `${apiUrl}${product?.primaryImageUrl ?? ""}`,
      [apiUrl, product?.primaryImageUrl],
   );

   return (
      <div className="group bg-white rounded-md overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
         {/* Image */}
         <div className="relative overflow-hidden h-56 bg-rose-50">
            {product?.status && (
               <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-primary">
                  {product?.status}
               </span>
            )}
            <Image
               src={imageUrl}
               alt={product?.title ?? "product"}
               fill
               className="object-cover group-hover:scale-105 transition-transform duration-500"
               loading="lazy"
            />
         </div>

         {/* Info */}
         <div className="p-4">
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
               {product?.description}
            </p>
            <Link
               href={`/products/${product?.id}`}
               className="font-semibold text-slate-800 text-base leading-tight hover:text-primary transition-colors block mb-3"
            >
               {product?.title}
            </Link>

            <div className="flex items-center justify-between mb-4">
               <span className="font-bold text-primary text-lg">
                  {product?.price.toLocaleString()} {t("pound")}
               </span>
               <button className="text-slate-300 hover:text-rose-500 transition-colors">
                  <FavoriteBorderIcon fontSize="small" />
               </button>
            </div>

            <div className="flex flex-wrap gap-2">
               <button className="min-w-32 flex-1 bg-primary hover:bg-primary/80 text-white text-sm font-semibold py-2.5 rounded-full transition-colors flex items-center justify-center gap-1">
                  <ShoppingBagIcon fontSize="small" />
                  {t("shopNow")}
               </button>
               <button
                  className="min-w-32 flex-1 border border-primary text-primary hover:bg-primary hover:text-white text-sm font-semibold py-2.5 rounded-full transition-colors"
                  onClick={() => dispatch(add(product))}
               >
                  {t("quickAdd")}
               </button>
            </div>
         </div>
      </div>
   );
}

export default memo(ProductCard);
