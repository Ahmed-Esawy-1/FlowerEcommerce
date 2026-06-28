"use client";

import Link from "next/link";

export default function CategoryOccasionCard({ item, href, apiUrl }) {
   return (
      <Link href={href} className="group block">
         <div className="rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all">
            <div className="aspect-square overflow-hidden">
               <img
                  src={`${apiUrl}${item.imageUrl}`}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
               />
            </div>

            <div className="p-4 text-center">
               <p className="font-bold text-sm uppercase tracking-wider">
                  {item.name}
               </p>
            </div>
         </div>
      </Link>
   );
}
