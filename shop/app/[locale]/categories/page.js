import { getLocale, getTranslations } from "next-intl/server";
import { fetchCategories } from "@/lib/api/serverFetch";
import CollectionGrid from "@/components/CollectionGrid";

const CategoriesPage = async () => {
    const locale = await getLocale();
    const t = await getTranslations("collections.category");
    const tCommon = await getTranslations("common");

    const categories = await fetchCategories();

    return (
        <CollectionGrid
            items={categories}
            locale={locale}
            t={t}
            tCommon={tCommon}
            queryParam="categoryIds"
            emptyTitleKey="noCategoriesTitle"
            emptyDescKey="noCategoriesDesc"
        />
    );
};

export default CategoriesPage;
