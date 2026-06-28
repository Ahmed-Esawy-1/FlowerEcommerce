"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetProductQuery } from "../../../../../lib/api/homeApi";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VerifiedIcon from "@mui/icons-material/Verified";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch } from "react-redux";
import { add } from "../../../../../features/cart/cartSlice";
import AppSwiper from "../../components/AppSwiper";

export default function Product() {
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
   const { id } = useParams();
   const { data: product = [] } = useGetProductQuery(id);

   const dispatch = useDispatch();

   const [selectedColor, setSelectedColor] = useState(null);
   const [mainImage, setMainImage] = useState(null);
   const [descIsOpen, setdescIsOpen] = useState(false);

   // set default color + main image
   useEffect(() => {
      if (product) {
         if (product?.hasColor && product?.productColors?.length) {
            setSelectedColor(product.productColors[0]);
            setMainImage(product.productColors[0]?.images?.[0]?.imageUrl);
         } else {
            setMainImage(product.primaryImageUrl);
         }
      }
   }, [product]);

   // get images based on selected color
   const images =
      product?.hasColor && selectedColor
         ? selectedColor.images
         : product?.images || [];

   return (
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* PRODUCT IMAGES */}
            <div className="lg:col-span-7 space-y-4">
               {/* MAIN IMAGE */}
               <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                  <img
                     alt={product?.title}
                     className="w-full h-full object-cover"
                     src={apiUrl + (mainImage || product?.primaryImageUrl)}
                  />
               </div>

               {/* THUMBNAILS */}
               <div className="relative">
                  <AppSwiper
                     items={images}
                     breakpoints={{
                        0: { slidesPerView: 2 },
                        640: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                     }}
                     renderSlide={(img) => (
                        <div
                           onClick={() => setMainImage(img.imageUrl)}
                           className="aspect-square rounded-lg overflow-hidden border-2 border-primary ring-offset-2 ring-2 ring-primary/20 cursor-pointer"
                        >
                           <img
                              alt="thumbnail"
                              className="w-full h-full object-cover hover:opacity-80"
                              src={apiUrl + img.imageUrl}
                           />
                        </div>
                     )}
                  />
               </div>
            </div>

            {/* PRODUCT DETAILS */}
            <div className="lg:col-span-5 space-y-8">
               {/* TITLE */}
               <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-display font-medium leading-tight">
                     {product?.title}
                  </h1>

                  <div className="flex items-center gap-1 text-sm text-slate-500">
                     <VerifiedIcon className="text-primary !text-lg" />
                     <span>
                        In collaboration with{" "}
                        <strong className="text-slate-800">Areej</strong>
                     </span>
                  </div>
               </div>

               {/* COLORS */}
               {product?.hasColor && product?.productColors?.length > 0 && (
                  <div className="p-6 border border-slate-100 rounded-xl bg-slate-50/50">
                     <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                        Select Color
                     </label>

                     <div className="flex flex-wrap gap-3">
                        {product.productColors.map((color) => (
                           <button
                              key={color.id}
                              onClick={() => {
                                 setSelectedColor(color);
                                 setMainImage(color.images?.[0]?.imageUrl);
                              }}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                                 selectedColor?.id === color.id
                                    ? "border-primary bg-white"
                                    : "border-slate-200 bg-slate-50 hover:bg-white"
                              }`}
                           >
                              <span
                                 className="w-4 h-4 rounded-full border"
                                 style={{ backgroundColor: color.hexCode }}
                              />
                              <span className="text-sm font-medium">
                                 {color.name}
                              </span>
                           </button>
                        ))}
                     </div>
                  </div>
               )}

               {/* PRICE + CART */}
               <div className="flex gap-4">
                  <div className="flex-1 p-6 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col justify-center">
                     <span className="text-xs text-slate-400 uppercase tracking-tighter">
                        Price Includes VAT
                     </span>
                     <span className="text-3xl font-bold">
                        EGP {Number(product?.price)?.toLocaleString()}
                     </span>
                  </div>

                  <button
                     onClick={() =>
                        dispatch(
                           add({
                              id: product.id,
                              title: product.title,
                              description: product.description,
                              image: product.primaryImageUrl,
                              price: product.price,
                              color: selectedColor?.name,
                           }),
                        )
                     }
                     className="flex-[1.5] bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                     <AddShoppingCartIcon />
                     Add to Cart
                  </button>
               </div>

               {/* DESCRIPTION */}
               <div className="pt-4">
                  <button
                     onClick={() => setdescIsOpen(!descIsOpen)}
                     className="w-full py-4 border border-slate-200 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                  >
                     Description
                     <ExpandMoreIcon />
                  </button>

                  <div
                     className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        descIsOpen
                           ? "max-h-96 opacity-100 py-4"
                           : "max-h-0 opacity-0"
                     }`}
                  >
                     <div className="text-slate-600 text-sm leading-relaxed">
                        {product?.description || "No description provided."}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* RELATED PRODUCTS */}
         <section className="mt-32 mb-20">
            <h2 className="text-3xl font-bold mb-12">You Might Also Love</h2>

            
         </section>
      </main>
   );
}
