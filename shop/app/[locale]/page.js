import Hero from "@/components/Hero";
import HomeClient from "./HomeClient";
import {
    fetchSectionSummaries,
    fetchCategories,
    fetchOccasions,
} from "@/lib/api/serverFetch";

import LazySection from "@/components/lazySection/LazySection";
import BrandsSection from "@/components/sections/BrandsSection";
import SignupSection from "@/components/sections/SignupSection";

export default async function Page() {
    const [sections, categories, occasions] = await Promise.all([
        fetchSectionSummaries(),
        fetchCategories(),
        fetchOccasions(),
    ]);

    return (
        <main>
            <Hero />

            {/* CONTENT */}
            <HomeClient categories={categories} occasions={occasions} />

            {/* SECTIONS  */}
            {sections.length > 0 && (
                <div style={{ minHeight: "1px" }}>
                    {sections.map((section) => (
                        <LazySection key={section.id} section={section} />
                    ))}
                </div>
            )}

            <BrandsSection />

            <SignupSection />
        </main>
    );
}
