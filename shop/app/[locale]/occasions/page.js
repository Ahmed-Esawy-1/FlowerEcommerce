import { getLocale, getTranslations } from "next-intl/server";
import { fetchOccasions } from "@/lib/api/serverFetch";
import CollectionGrid from "@/components/CollectionGrid";

const OccasionsPage = async () => {
    const locale = await getLocale();
    const t = await getTranslations("collections.occasion");
    const tCommon = await getTranslations("common");

    const occasions = await fetchOccasions();

    return (
        <CollectionGrid
            items={occasions}
            locale={locale}
            t={t}
            tCommon={tCommon}
            queryParam="occasionIds"
            emptyTitleKey="noOccasionsTitle"
            emptyDescKey="noOccasionsDesc"
        />
    );
};

export default OccasionsPage;
