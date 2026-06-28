import PriceSlider from "./PriceSlider";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function Filters({ data, filters, setFilters, open, setOpen }) {
   const { categories, occasions, colors, priceRange } = data;

   const t = useTranslations("productsFilters")

   const [dir, setDir] = useState("ltr");
   const hiddenClass = dir === "rtl" ? "translate-x-full" : "-translate-x-full";

   useEffect(() => {
      setDir(document.documentElement.dir || "ltr");
   }, []);

   const toggleFilter = (key, id) => {
      setFilters((prev) => ({
         ...prev,
         [key]: prev[key].includes(id)
            ? prev[key].filter((item) => item !== id)
            : [...prev[key], id],
      }));
   };

   const clearAll = () => {
      setFilters({
         categoryIds: [],
         occasionIds: [],
         colorIds: [],
         minPrice: priceRange?.minPrice ?? null,
         maxPrice: priceRange?.maxPrice ?? null,
      });
   };


   return (
      <>
         {/* OverLay (Small Screen) */}
         {open && (
            <div
               className="fixed inset-0 bg-black/40 lg:hidden z-40"
               onClick={() => setOpen(false)}
            />
         )}

         <aside
            className={`
               fixed lg:static inset-0 z-50
               w-full sm:w-80 lg:w-64
               h-full lg:min-h-screen
               bg-white lg:bg-stone-50
               flex flex-col
               pt-10 px-4 pb-5
               overflow-y-auto
               transition-transform duration-300
               ${open ? "translate-x-0" : hiddenClass}
               lg:translate-x-0
            `}
         >
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
               <div>
                  <h2 className="font-serif text-2xl text-rose-900">
                     {t("title")}
                  </h2>
                  <p className="text-stone-500 text-xs uppercase tracking-widest mt-1">
                     {t("description")}
                  </p>
               </div>

               <button className="lg:hidden" onClick={() => setOpen(false)}>
                  <CloseIcon />
               </button>
            </div>

            <div className="space-y-10">
               {/* Categories */}
               <section>
                  <h3 className="uppercase text-[10px] font-bold text-stone-400 mb-4">
                     {t("categories")}
                  </h3>

                  <div className="flex flex-col gap-3">
                     {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-3">
                           <input
                              type="checkbox"
                              checked={filters.categoryIds.includes(cat.id)}
                              onChange={() =>
                                 toggleFilter("categoryIds", cat.id)
                              }
                           />
                           <span>{cat.name}</span>
                        </label>
                     ))}
                  </div>
               </section>

               {/* Colors */}
               <section>
                  <h3 className="uppercase text-[10px] font-bold text-stone-400 mb-4">
                     {t("palette")}
                  </h3>

                  <div className="flex flex-wrap gap-3">
                     {colors.map((c) => (
                        <button
                           key={c.id}
                           onClick={() => toggleFilter("colorIds", c.id)}
                           className={`w-6 h-6 rounded-full ${
                              filters.colorIds.includes(c.id)
                                 ? "ring-4 ring-primary"
                                 : ""
                           }`}
                           style={{ backgroundColor: c.hexCode }}
                        />
                     ))}
                  </div>
               </section>

               {/* Price */}
               <PriceSlider
                  filters={filters}
                  setFilters={setFilters}
                  priceRange={priceRange}
               />

               {/* Occasions */}
               <section>
                  <h3 className="uppercase text-[10px] font-bold text-stone-400 mb-4">
                     {t("occasions")}
                  </h3>

                  <div className="flex flex-col gap-3">
                     {occasions.map((o) => (
                        <label key={o.id} className="flex items-center gap-3">
                           <input
                              type="checkbox"
                              checked={filters.occasionIds.includes(o.id)}
                              onChange={() => toggleFilter("occasionIds", o.id)}
                           />
                           <span>{o.name}</span>
                        </label>
                     ))}
                  </div>
               </section>

               {/* Clear */}
               <button onClick={clearAll} className="w-full py-3 mt-8 border">
                  {t("clear")}
               </button>
            </div>
         </aside>
      </>
   );
}
