"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { add } from "../../../features/cart/cartSlice"; // adjust path
export default function Card({ item }) {
   const dispatch = useDispatch();

   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

   const firstImage = item.images?.[0]?.imageUrl || "undefined";
   console.log(item);
   return (
      <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
         {/* Image */}
         <div className="relative overflow-hidden h-56 bg-rose-50">
            {item.status && (
               <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-primary">
                  {item.status}
               </span>
            )}
            <img
               alt={`${item.name} thumbnail`}
               src={`${apiUrl}${firstImage}`}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
         </div>

         {/* Info */}
         <div className="p-4">
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
               {item.subTitle}
            </p>
            <Link
               href={`/products/${item.id}`}
               className="font-semibold text-slate-800 text-base leading-tight hover:text-primary transition-colors block mb-3"
            >
               {item.title}
            </Link>

            <div className="flex items-center justify-between mb-4">
               <span className="font-bold text-primary text-lg font-display">
                  EGP {item.price.toLocaleString()}
               </span>
               <button className="text-slate-300 hover:text-rose-500 transition-colors">
                  <FavoriteBorderIcon fontSize="small" />
               </button>
            </div>

            <div className="flex gap-2">
               <button className="flex-1 bg-primary hover:bg-primary/80 text-white text-sm font-semibold py-2.5 rounded-full transition-colors flex items-center justify-center gap-1">
                  <ShoppingBagIcon fontSize="small" />
                  Shop Now
               </button>
               <button
                  className="flex-1 border border-primary text-primary hover:bg-primary hover:text-white text-sm font-semibold py-2.5 rounded-full transition-colors"
                  onClick={() => dispatch(add(item))}
               >
                  Quick Add
               </button>
            </div>
         </div>
      </div>
   );
}
