import { useTranslations } from "next-intl";
import Link from "next/link";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function NavigationLinks({
   items,
   shopQuery,
   basePath,
   onClose,
   itemClassName,
   viewAllClassName,
}) {
   const t =useTranslations("common");

   return (
      <>
         {items.map((item) => (
            <li key={item.id}>
               <Link
                  href={`/products?${shopQuery}${item.id} `}
                  onClick={onClose}
                  className={itemClassName}
               >
                  {item.name}
               </Link>
            </li>
         ))}

         <li>
            <Link
               href={`/${basePath}`}
               onClick={onClose}
               className={viewAllClassName}
            >
               {t("viewAll")}{" "}
               <ArrowForwardIcon
                  fontSize="small"
                  className="rtl:rotate-180"
               />
            </Link>
         </li>
      </>
   );
}
