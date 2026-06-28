import React from "react";
import Image from "next/image";
const Hero = () => {
   return (
      <section className="relative h-[80vh] overflow-hidden">
         <Image
            alt="Luxury Pink Peonies"
            className="absolute inset-0 object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq5z08bFlN65avApNSUiLpQddHTbP6jDnFG7PfPV51wQ9yrSpKeNAPu_0Y4rck3t4Jvk74msWp-CQHiFZOGwlxacBR0qDKa-HxKGcynIAeJ5raVgTLmPyVslzGUnlHHHgjGIw8ceYCjfl99FoHWlt4MjkjiKPlcBwLZOLSXBI1_mWSFtg2BYbBQTOZacfphDA9GxsVv2xPtJ1esP2fneHS5o6IQo90jyswLaQIq7f9l0ZBUIpgM80fFcawRZnrRUTiCCzLwhW-fJIy"
            fill
            loading="eager"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent" />
         <div className="container mx-auto px-6 h-full relative flex flex-col justify-center items-start">
            <span className="text-primary font-semibold tracking-[0.3em] uppercase mb-4 block">
               New Ramadan Collection
            </span>
            <h1 className="font-display text-6xl md:text-8xl text-slate-900 mb-6 leading-tight max-w-2xl">
               Gift the <br />
               <span className="italic font-normal">Spirit of Giving</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg">
               Discover our curated selection of bespoke floral arrangements and
               luxury gift sets.
            </p>
            <div className="flex gap-4">
               <a
                  className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-primary transition-all shadow-xl"
                  href="#"
               >
                  Shop Now
               </a>
               <a
                  className="bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full font-bold hover:bg-white transition-all border border-slate-200"
                  href="#"
               >
                  View Catalog
               </a>
            </div>
         </div>
      </section>
   );
};

export default Hero;
