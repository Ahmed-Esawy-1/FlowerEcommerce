"use client";
import { useState, useEffect } from "react";
import { useSwiper } from "swiper/react";
import "swiper/css";

const SwiperNavButtons = () => {
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
        className={`material-symbols-outlined pointer-events-auto bg-primary text-white p-3 rounded-full hover:bg-gray-800 hover:cursor-pointer transition
        ${isBeginning ? "opacity-0 cursor-default" : "opacity-100 hover:scale-110 cursor-pointer"}`}
      >
        arrow_back
      </button>
      <button
        onClick={() => swiper.slideNext()}
        disabled={isEnd}
        className={`material-symbols-outlined pointer-events-auto bg-primary text-white p-3 rounded-full hover:bg-gray-800 hover:cursor-pointer transition
          ${isEnd ? "opacity-0 cursor-default" : "opacity-100 hover:scale-110 cursor-pointer"}`}
      >
        arrow_forward
      </button>
    </div>
  );
};

export default SwiperNavButtons;
