import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function LangSwitcher() {
   const locale = useLocale();
   const router = useRouter();
   const pathname = usePathname();

   const switchLang = () => {
      const nextLocale = locale === "en" ? "ar" : "en";

      // Replace /en/... with /ar/... or vice versa
      const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
      router.push(newPath);
   };

   return (
      <button onClick={switchLang}>
         {locale === "en" ? "العربية" : "English"}
      </button>
   );
}
