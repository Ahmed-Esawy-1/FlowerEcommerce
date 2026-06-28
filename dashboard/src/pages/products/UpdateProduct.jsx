import React from "react";
import { useParams, Link } from "react-router";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ProductForm from "./ProductForm";


const EditProduct = () => {
   const { productId } = useParams();

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
                  <span className="text-indigo-600 font-bold">
                     Edit Product
                  </span>
               </nav>
               <h2 className="text-on-surface">Edit Product</h2>
               <p className="text-sm text-on-surface-variant mt-1">
                  Update product info, images, and color variants.
               </p>
            </div>
         </div>

         <ProductForm mode="edit" productId={productId} />
      </>
   );
};

export default EditProduct;
