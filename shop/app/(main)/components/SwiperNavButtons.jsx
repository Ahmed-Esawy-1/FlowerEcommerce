"use client";

import { useState, useEffect } from "react";
import { useSwiper } from "swiper/react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function SwiperNavButtons() {
   const swiper = useSwiper();
   const [isBeginning, setIsBeginning] = useState(true);
   const [isEnd, setIsEnd] = useState(false);

   useEffect(() => {
      const handleSlideChange = () => {
         setIsBeginning(swiper.isBeginning);
         setIsEnd(swiper.isEnd);
      };

      swiper.on("slideChange", handleSlideChange);
      return () => swiper.off("slideChange", handleSlideChange);
   }, [swiper]);

   return (
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-20 flex items-center justify-between px-2 pointer-events-none">
         <button
            onClick={() => swiper.slidePrev()}
            disabled={isBeginning}
            className={`pointer-events-auto bg-primary text-white p-3 rounded-full transition
            ${
               isBeginning
                  ? "opacity-0 cursor-default"
                  : "opacity-100 hover:scale-110 hover:bg-gray-800 cursor-pointer"
            }`}
         >
            <ArrowBackIcon fontSize="small" />
         </button>

         <button
            onClick={() => swiper.slideNext()}
            disabled={isEnd}
            className={`pointer-events-auto bg-primary text-white p-3 rounded-full transition
            ${
               isEnd
                  ? "opacity-0 cursor-default"
                  : "opacity-100 hover:scale-110 hover:bg-gray-800 cursor-pointer"
            }`}
         >
            <ArrowForwardIcon fontSize="small" />
         </button>
      </div>
   );
}
