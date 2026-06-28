"use client";

import { useEffect, useState } from "react";
import { useSwiper } from "swiper/react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function SwiperNavButtons() {
   const swiper = useSwiper();
   const [_, forceUpdate] = useState(0);

   useEffect(() => {
      if (!swiper) return;

      const update = () => forceUpdate((x) => x + 1);

      update();

      swiper.on("slideChange", update);
      swiper.on("reachBeginning", update);
      swiper.on("reachEnd", update);

      return () => {
         swiper.off("slideChange", update);
         swiper.off("reachBeginning", update);
         swiper.off("reachEnd", update);
      };
   }, [swiper]);

   if (!swiper || swiper.slides?.length <= 1) return null;

   return (
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-20 flex items-center justify-between px-2 pointer-events-none">
         <button
            onClick={() => swiper.slidePrev()}
            disabled={swiper.isBeginning}
            className={`pointer-events-auto bg-primary text-white p-3 rounded-full transition ${
               swiper.isBeginning
                  ? "opacity-0"
                  : "opacity-100 hover:scale-110 hover:bg-gray-800"
            }`}
         >
            <ArrowBackIcon fontSize="small" />
         </button>

         <button
            onClick={() => swiper.slideNext()}
            disabled={swiper.isEnd}
            className={`pointer-events-auto bg-primary text-white p-3 rounded-full transition ${
               swiper.isEnd
                  ? "opacity-0"
                  : "opacity-100 hover:scale-110 hover:bg-gray-800"
            }`}
         >
            <ArrowForwardIcon fontSize="small" />
         </button>
      </div>
   );
}
