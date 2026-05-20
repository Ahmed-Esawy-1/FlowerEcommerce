import React from "react";

const ProductCard = () => {
   return function ProductCard({ product, onEdit, onAddColor, onDelete }) {
      const [activeColorIdx, setActiveColorIdx] = useState(0);
      const [activeImgIdx, setActiveImgIdx] = useState(0);

      const activeColor = product.colors[activeColorIdx];

      const handleColorSwitch = (idx) => {
         setActiveColorIdx(idx);
         setActiveImgIdx(0);
      };

      return (
         <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors duration-150 flex flex-col">
            {/* Main Image */}
            <div className="relative h-56 bg-gray-100 overflow-hidden">
               <img
                  src={activeColor.images[activeImgIdx]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-opacity duration-200"
               />
               {/* Color name badge */}
               <span className="absolute top-2.5 left-2.5 text-xs px-2 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 font-medium">
                  {activeColor.name}
               </span>
               {/* Image counter */}
               <span className="absolute top-2.5 right-2.5 text-xs px-2 py-1 rounded-lg bg-black/40 text-white">
                  {activeImgIdx + 1} / {activeColor.images.length}
               </span>
            </div>

            {/* Thumbnail Strip */}
            {activeColor.images.length > 1 && (
               <div className="flex gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-100 overflow-x-auto">
                  {activeColor.images.map((src, i) => (
                     <button
                        key={i}
                        onClick={() => setActiveImgIdx(i)}
                        className={`flex-shrink-0 w-11 h-11 rounded-lg overflow-hidden border-2 transition-colors ${
                           i === activeImgIdx
                              ? "border-gray-800"
                              : "border-transparent"
                        }`}
                     >
                        <img
                           src={src}
                           alt={`view ${i + 1}`}
                           className="w-full h-full object-cover"
                        />
                     </button>
                  ))}
               </div>
            )}

            {/* Card Body */}
            <div className="p-4 flex flex-col flex-1">
               {/* Title + Price */}
               <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-gray-900 text-sm truncate">
                     {product.title}
                  </p>
                  <span className="font-medium text-gray-900 text-sm whitespace-nowrap">
                     ${product.price.toFixed(2)}
                  </span>
               </div>

               {/* Meta */}
               <p className="text-xs text-gray-400 mb-3">
                  {product.category} · {product.occasion}
               </p>

               {/* Badges */}
               <div className="flex gap-1.5 flex-wrap mb-3">
                  {product.isBestSeller && (
                     <span className="text-xs px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-100">
                        ★ best seller
                     </span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                     {product.colors.length} color
                     {product.colors.length > 1 ? "s" : ""}
                  </span>
               </div>

               <hr className="border-gray-100 mb-3" />

               {/* Color Swatches */}
               <div className="flex items-center gap-2 flex-wrap mb-4">
                  {product.colors.map((c, i) => (
                     <button
                        key={c.id}
                        title={c.name}
                        onClick={() => handleColorSwitch(i)}
                        className={`w-5 h-5 rounded-full transition-all duration-100 ${
                           i === activeColorIdx
                              ? "ring-2 ring-offset-1 ring-gray-500 scale-110"
                              : "hover:scale-110"
                        }`}
                        style={{
                           backgroundColor: c.hex,
                           border: "1px solid rgba(0,0,0,0.1)",
                        }}
                     />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">
                     {activeColor.name}
                  </span>
               </div>

               {/* Actions */}
               <div className="flex gap-2 mt-auto">
                  <button
                     onClick={() => onEdit?.(product)}
                     className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 px-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                  >
                     ✏️ Edit
                  </button>
                  <button
                     onClick={() => onAddColor?.(product)}
                     className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 px-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                  >
                     🎨 Add Color
                  </button>
                  <button
                     onClick={() => onDelete?.(product)}
                     className="flex items-center justify-center py-2 px-3 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors text-red-500"
                  >
                     🗑️
                  </button>
               </div>
            </div>
         </div>
      );
   };
};

export default ProductCard;
