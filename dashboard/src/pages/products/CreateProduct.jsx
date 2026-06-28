import React from "react";
import { Link } from "react-router";
import ProductForm from "./ProductForm";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";


const CreateProduct = () => {
   return (
      <>
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
               <nav className="flex items-center gap-2 mb-2 text-slate-500 uppercase tracking-wide">
                  <Link
                     to="/products"
                     className="text-xl font-bold hover:text-indigo-600 tracking-tighter"
                  >
                     Products
                  </Link>
                  <ChevronRightIcon className="!text-xs" />
                  <span className="text-indigo-600 font-bold">Create New</span>
               </nav>
               <h2 className="text-on-surface">Create New Product</h2>
               <p className="page-subtitle mt-1">
                  Create a product listing with pricing, images, and detailed
                  information.
               </p>
            </div>
         </div>

         <ProductForm mode="create" />
      </>
   );
};

export default CreateProduct;
