"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { selectTotalItems } from "../../../features/cart/cartSlice";

import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Header = () => {
   const totalItems = useSelector(selectTotalItems);
   return (
      <>
         <header className="sticky top-0 z-50 glass-effect border-b border-slate-200">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <LocalFloristIcon className="text-primary !text-3xl" />
                  <Link
                     className="font-display text-2xl font-bold tracking-tight text-slate-900"
                     href="/"
                  >
                     FLOW
                  </Link>
               </div>
               <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold uppercase tracking-widest">
                  <a className="hover:text-primary transition-colors" href="#">
                     Occasions
                  </a>
                  <Link
                     className="hover:text-primary transition-colors"
                     href="/categories"
                  >
                     Categories
                  </Link>
                  <Link
                     className="hover:text-primary transition-colors"
                     href="/#bestSeller"
                  >
                     Best Sellers
                  </Link>
                  <Link
                     className="hover:text-primary transition-colors"
                     href="/products"
                  >
                     Shop
                  </Link>
               </nav>
               <div className="flex items-center gap-6">
                  <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2">
                     <SearchIcon className="text-slate-400 !text-xl" />
                     <input
                        className="bg-transparent border-none focus:ring-0 text-sm w-48"
                        placeholder="Search gifts..."
                        type="text"
                     />
                  </div>
                  <button className="flex items-center gap-1 hover:text-primary">
                     <PersonIcon />
                  </button>
                  <Link
                     href="/cart"
                     className="flex items-center gap-1 hover:text-primary relative"
                  >
                     <ShoppingCartIcon />
                     <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {totalItems}
                     </span>
                  </Link>
               </div>
            </div>
         </header>
      </>
   );
};

export default Header;
