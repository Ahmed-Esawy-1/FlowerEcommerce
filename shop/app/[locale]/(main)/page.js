import HomeClient from "./HomeClient";
import {
   fetchCategories,
   fetchOccasions,
   fetchSectionSummaries,
} from "@/lib/api/serverFetch";

export default async function Page() {
   const [sections, categories, occasions] = await Promise.all([
      fetchSectionSummaries(),
      fetchCategories(),
      fetchOccasions(),
   ]);

   return (
      <HomeClient
         initialSections={sections}
         initialCategories={categories}
         initialOccasions={occasions}
      />
   );
}
