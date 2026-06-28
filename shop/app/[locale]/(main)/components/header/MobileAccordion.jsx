import { useState } from "react";
import NavigationLinks from "./NavigationLinks";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const MobileAccordion = ({ label, items, shopQuery, basePath, onClose }) => {
   const [open, setOpen] = useState(false);

   return (
      <div>
         <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-3 py-3 rounded-xl font-semibold text-sm uppercase tracking-widest hover:bg-rose-50 hover:text-primary transition-colors"
         >
            {label}

            <KeyboardArrowDownIcon
               fontSize="small"
               className={`transition-transform duration-200 ${
                  open ? "rotate-180" : ""
               }`}
            />
         </button>

         <div
            className={`overflow-hidden transition-all duration-300 ${
               open ? "max-h-96" : "max-h-0"
            }`}
         >
            <ul className="pl-3 pb-2 space-y-0.5">
               <NavigationLinks
                  items={items}
                  shopQuery={shopQuery}
                  basePath={basePath}
                  onClose={onClose}
                  itemClassName="block px-3 py-2 text-sm text-slate-600 hover:text-primary hover:bg-rose-50 rounded-lg transition-colors"
                  viewAllClassName="block px-3 py-2 text-sm font-semibold text-primary hover:bg-rose-50 rounded-lg transition-colors"
               />
            </ul>
         </div>
      </div>
   );
};

export default MobileAccordion;
