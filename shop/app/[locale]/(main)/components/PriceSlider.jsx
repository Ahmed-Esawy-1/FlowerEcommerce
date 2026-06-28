export default function PriceSlider({ priceRange, filters, setFilters }) {
   const min = priceRange.minPrice ?? 0;
   const max = priceRange.maxPrice ?? 0;

   const safeRange = max - min || 1;

   const minPercent = ((filters.minPrice - min) / safeRange) * 100;

   const maxPercent = ((filters.maxPrice - min) / safeRange) * 100;

   return (
      <div className="w-full space-y-4">
         {/* GLOBAL RANGE */}
         <div className="flex justify-between text-[11px] text-stone-400 uppercase tracking-widest">
            <span>EGP {min}</span>
            <span>EGP {max}</span>
         </div>

         {/* SLIDER */}
         <div className="relative h-6">
            {/* TRACK */}
            <div className="absolute top-1/2 w-full h-1 bg-stone-200 -translate-y-1/2 rounded-full" />

            {/* ACTIVE RANGE (SMOOTH) */}
            <div
               className="absolute top-1/2 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-75 ease-out"
               style={{
                  left: `${minPercent}%`,
                  width: `${maxPercent - minPercent}%`,
               }}
            />

            {/* MIN SLIDER */}
            <input
               type="range"
               min={min}
               max={max}
               value={filters.minPrice ?? min}
               onChange={(e) => {
                  const value = Number(e.target.value);

                  requestAnimationFrame(() => {
                     setFilters((prev) => ({
                        ...prev,
                        minPrice: Math.max(
                           min,
                           Math.min(value, prev.maxPrice - 1),
                        ),
                     }));
                  });
               }}
               className="range-slider"
            />

            {/* MAX SLIDER */}
            <input
               type="range"
               min={min}
               max={max}
               value={filters.maxPrice ?? max}
               onChange={(e) => {
                  const value = Number(e.target.value);

                  requestAnimationFrame(() => {
                     setFilters((prev) => ({
                        ...prev,
                        maxPrice: Math.min(
                           max,
                           Math.max(value, prev.minPrice + 1),
                        ),
                     }));
                  });
               }}
               className="range-slider"
            />
         </div>

         {/* INPUT BOX */}
         <div className="p-3 border border-stone-200 rounded-lg bg-white space-y-3">
            <div className="flex justify-between text-xs text-stone-500 uppercase tracking-wider">
               <span>Your Price Range</span>
            </div>

            <div className="flex items-center gap-3">
               {/* MIN INPUT */}
               <input
                  type="number"
                  min={min}
                  max={filters.maxPrice ?? max}
                  value={filters.minPrice ?? min}
                  onChange={(e) => {
                     const value = Number(e.target.value);

                     setFilters((prev) => ({
                        ...prev,
                        minPrice: Math.max(
                           min,
                           Math.min(value, prev.maxPrice - 1),
                        ),
                     }));
                  }}
                  className="w-full border border-stone-200 px-2 py-1 text-sm rounded"
               />

               <span className="text-stone-400">-</span>

               {/* MAX INPUT */}
               <input
                  type="number"
                  min={filters.minPrice ?? min}
                  max={max}
                  value={filters.maxPrice ?? max}
                  onChange={(e) => {
                     const value = Number(e.target.value);

                     setFilters((prev) => ({
                        ...prev,
                        maxPrice: Math.min(
                           max,
                           Math.max(value, prev.minPrice + 1),
                        ),
                     }));
                  }}
                  className="w-full border border-stone-200 px-2 py-1 text-sm rounded"
               />
            </div>
         </div>
      </div>
   );
}
