// components/ui/AppSwiper.js
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import SwiperNavButtons from "./SwiperNavButtons";

export default function AppSwiper({
   items,
   renderSlide,
   breakpoints,
   ...props
}) {
   return (
      <Swiper
         pagination={{ clickable: true }}
         spaceBetween={20}
         breakpoints={breakpoints}
         {...props}
      >
         {items.map((item, i) => (
            <SwiperSlide key={item.id ?? i}>{renderSlide(item)}</SwiperSlide>
         ))}

         <SwiperNavButtons />
      </Swiper>
   );
}
