import { useState } from "react";
import NavigationLinks from "./NavigationLinks";

import { ArrowDown } from "lucide-react";

const MobileAccordion = ({ label, items, basePath, onClose }) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-3 py-3 rounded-xl font-semibold text-sm uppercase tracking-widest text-ink hover:bg-rose/15 hover:text-primary transition-colors"
            >
                {label}

                <ArrowDown
                    size={18}
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
                        basePath={basePath}
                        onClose={onClose}
                    />
                </ul>
            </div>
        </div>
    );
};

export default MobileAccordion;
