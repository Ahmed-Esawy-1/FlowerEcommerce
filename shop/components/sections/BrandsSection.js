import { getTranslations } from "next-intl/server";

const BrandsSection = async () => {
    const t = await getTranslations("home");

    return (
        <section className="py-16 border-y border-gold/20">
            <div className="container mx-auto px-6">
                <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-text mb-10">
                    {t("brands")}
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                    {["PATCHI", "PANDORA", "GUESS", "MARELLA", "POLICE"].map(
                        (brand) => (
                            <div
                                key={brand}
                                className="h-8 text-2xl font-black text-ink"
                            >
                                {brand}
                            </div>
                        ),
                    )}
                </div>
            </div>
        </section>
    );
};

export default BrandsSection;
