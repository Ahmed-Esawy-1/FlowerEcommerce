export default function Filters({
   filters,
   setFilters,
   priceRanges,
   categories,
}) {
   function handlePriceChange(range) {
      setFilters((prev) => {
         const exists = prev.price.find((p) => p.label === range.label);
         return {
            ...prev,
            price: exists
               ? prev.price.filter((p) => p.label !== range.label)
               : [...prev.price, range],
         };
      });
   }

   function handleCategoryChange(cat) {
      setFilters((prev) => {
         const exists = prev.category.includes(cat);
         return {
            ...prev,
            category: exists
               ? prev.category.filter((c) => c !== cat)
               : [...prev.category, cat],
         };
      });
   }

   return (
      <aside className="hidden lg:flex flex-col w-64 bg-stone-50  overflow-y-auto">
         <div className="mb-10">
            <h2 className="noto-serif text-2xl text-rose-900 mb-1">Filters</h2>
            <p className=" text-xs uppercase tracking-widest text-stone-500">
               Refine your selection
            </p>
         </div>
         <div className="space-y-10">
            {/* <!-- Price Range Section --> */}
            <section>
               <div className="flex items-center gap-2 mb-4 text-rose-900 font-bold bg-stone-200/50 p-2 rounded-sm translate-x-1 transition-transform">
                  <span
                     className="material-symbols-outlined text-sm"
                     data-icon="payments"
                  >
                     payments
                  </span>
                  <span className=" uppercase tracking-widest text-xs">
                     Price Range
                  </span>
               </div>
               <div className="flex flex-col gap-3 px-2">
                  {priceRanges.map((range) => (
                     <label
                        className="flex items-center gap-3 text-stone-500 text-sm  cursor-pointer hover:text-rose-800 transition-colors"
                        key={range.label}
                     >
                        <input
                           className="rounded-none border-stone-300 text-primary focus:ring-primary-container"
                           type="checkbox"
                           name="price"
                           checked={filters.price.some(
                              (p) => p.label === range.label,
                           )}
                           onChange={() => handlePriceChange(range)}
                        />
                        {range.label}
                     </label>
                  ))}
               </div>
            </section>
            {/* <!-- Flower Type Section --> */}
            <section>
               <div className="flex items-center gap-2 mb-4 text-stone-500 p-2 hover:bg-stone-100 transition-colors cursor-pointer">
                  <span
                     className="material-symbols-outlined text-sm"
                     data-icon="local_florist"
                  >
                     local_florist
                  </span>
                  <span className=" uppercase tracking-widest text-xs">
                     Flower Type
                  </span>
               </div>
               <div className="flex flex-col gap-3 px-2">
                  {categories.map((cat, i) => (
                     <label
                        className="flex items-center gap-3 text-stone-500 text-sm  cursor-pointer hover:text-rose-800 transition-colors"
                        key={i}
                     >
                        <input
                           className="rounded-none border-stone-300 text-primary focus:ring-primary-container"
                           type="checkbox"
                           name="category"
                           onChange={() => handleCategoryChange(cat)}
                           checked={filters.category.includes(cat)}
                        />
                        {cat}
                     </label>
                  ))}
               </div>
            </section>
            {/* <!-- Occasion Section --> */}
            <section>
               <div className="flex items-center gap-2 mb-4 text-stone-500 p-2 hover:bg-stone-100 transition-colors cursor-pointer">
                  <span
                     className="material-symbols-outlined text-sm"
                     data-icon="celebration"
                  >
                     celebration
                  </span>
                  <span className=" uppercase tracking-widest text-xs">
                     Occasion
                  </span>
               </div>
               <div className="flex flex-col gap-3 px-2">
                  <label className="flex items-center gap-3 text-stone-500 text-sm  cursor-pointer hover:text-rose-800 transition-colors">
                     <input
                        className="rounded-none border-stone-300 text-primary focus:ring-primary-container"
                        type="checkbox"
                     />
                     Anniversary
                  </label>
                  <label className="flex items-center gap-3 text-stone-500 text-sm  cursor-pointer hover:text-rose-800 transition-colors">
                     <input
                        className="rounded-none border-stone-300 text-primary focus:ring-primary-container"
                        type="checkbox"
                     />
                     Birthday
                  </label>
                  <label className="flex items-center gap-3 text-stone-500 text-sm  cursor-pointer hover:text-rose-800 transition-colors">
                     <input
                        className="rounded-none border-stone-300 text-primary focus:ring-primary-container"
                        type="checkbox"
                     />
                     Romance
                  </label>
               </div>
            </section>
         </div>
         <button
            className="mt-12 text-rose-900  text-xs font-bold uppercase tracking-[0.2em] py-4 border-t border-rose-900/10 text-center w-full hover:bg-rose-50/50 transition-colors"
            onClick={() => setFilters({ category: [], price: [] })}
         >
            Clear All
         </button>
      </aside>
   );
}
