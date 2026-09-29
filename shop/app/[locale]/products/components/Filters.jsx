import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import PriceSlider from "./PriceSlider";

import { X } from "lucide-react";

export default function Filters({ data, filters, setFilters, open, setOpen }) {
    const locale = useLocale();
    const t = useTranslations("shop.filter");

    const { categories, occasions, colors, priceRange } = data;

    const [dir, setDir] = useState("ltr");
    const hiddenClass =
        dir === "rtl" ? "translate-x-full" : "-translate-x-full";

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
            {/* OVERLAY (Small Screen) */}
            {open && (
                <div
                    className="fixed inset-0 bg-primary-dark/40 lg:hidden z-20"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed lg:static inset-0 z-30
                    w-full sm:w-80 lg:w-64
                    h-full lg:min-h-screen
                    bg-marble-light lg:bg-marble
                    flex flex-col
                    pt-10 px-4 pb-5
                    overflow-y-auto
                    transition-transform duration-300
                    ${open ? "translate-x-0" : hiddenClass}
                    lg:translate-x-0
                `}
            >
                {/* HEADER */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="font-serif text-2xl text-primary">
                            {t("title")}
                        </h2>
                        <p className="text-text text-xs uppercase tracking-widest mt-1">
                            {t("description")}
                        </p>
                    </div>
                    <button
                        className="lg:hidden text-ink"
                        onClick={() => setOpen(false)}
                    >
                        <X />
                    </button>
                </div>

                <div className="space-y-10">
                    {/* CATEGORIES */}
                    <section>
                        <h3 className="uppercase text-[10px] font-bold text-text mb-4">
                            {t("categories")}
                        </h3>
                        <div className="flex flex-col gap-3">
                            {categories.map((cat) => (
                                <label
                                    key={cat.id}
                                    className="flex items-center gap-3 text-ink"
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.categoryIds.includes(
                                            cat.id,
                                        )}
                                        onChange={() =>
                                            toggleFilter("categoryIds", cat.id)
                                        }
                                        className="accent-primary"
                                    />
                                    <span>
                                        {locale === "en"
                                            ? cat.nameEn
                                            : cat.nameAr}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* COLORS */}
                    <section>
                        <h3 className="uppercase text-[10px] font-bold text-text mb-4">
                            {t("palette")}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() =>
                                        toggleFilter("colorIds", c.id)
                                    }
                                    className={`w-6 h-6 rounded-full ${
                                        filters.colorIds.includes(c.id)
                                            ? "ring-4 ring-gold"
                                            : ""
                                    }`}
                                    style={{ backgroundColor: c.hexCode }}
                                />
                            ))}
                        </div>
                    </section>

                    {/* PRICE SLIDER */}
                    <PriceSlider
                        filters={filters}
                        setFilters={setFilters}
                        priceRange={priceRange}
                    />

                    {/* OCCASIONS */}
                    <section>
                        <h3 className="uppercase text-[10px] font-bold text-text mb-4">
                            {t("occasions")}
                        </h3>
                        <div className="flex flex-col gap-3">
                            {occasions.map((o) => (
                                <label
                                    key={o.id}
                                    className="flex items-center gap-3 text-ink"
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.occasionIds.includes(
                                            o.id,
                                        )}
                                        onChange={() =>
                                            toggleFilter("occasionIds", o.id)
                                        }
                                        className="accent-primary"
                                    />
                                    <span>
                                        {locale === "en" ? o.nameEn : o.nameAr}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* CLEAR */}
                    <button
                        onClick={clearAll}
                        className="w-full py-3 mt-8 border border-gold/40 rounded-full text-ink hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    >
                        {t("clear")}
                    </button>
                </div>
            </aside>
        </>
    );
}
