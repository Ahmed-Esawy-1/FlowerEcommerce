import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import api from "@/api/axios";
import { BASE_URL } from "@/api/config";

import Loading from "@/components/Loading";
import ColorRow from "./ColorRow";
import ImageModeModal from "./ImageModeModal";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import PaletteIcon from "@mui/icons-material/Palette";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

let _uid = 0;
const uid = () => `uid_${++_uid}`; // For Images That Added Locally

const ProductForm = ({ mode, productId }) => {
   const navigate = useNavigate();
   const isEdit = mode === "edit";

   // Basic Fields
   const [product, setProduct] = useState({
      name: "",
      price: "",
      description: "",
      categoryId: "",
      occasionId: "",
   });
   const [categories, setCategories] = useState([]);
   const [occasions, setOccasions] = useState([]);
   const [colorPresets, setColorPresets] = useState([]);

   //  Image Mode
   const [hasColors, setHasColors] = useState(false);
   const originalHasColorsRef = useRef(null); // tracks the value on load (edit only)

   // General Images
   const [generalImages, setGeneralImages] = useState([]);
   const [removedGeneralImageIds, setRemovedGeneralImageIds] = useState([]);
   const generalFileRef = useRef(null);

   // Color Images
   const [productColors, setProductColors] = useState([]);
   const [removedProductColorIds, setRemovedProductColorIds] = useState([]);
   const [removedColorImageIds, setRemovedColorImageIds] = useState({});

   // UI state
   const [loading, setLoading] = useState(false);
   const [fetchLoading, setFetchLoading] = useState(isEdit);
   const [errors, setErrors] = useState({});

   // Image-Mode Toggle Modal
   const [modeModal, setModeModal] = useState({
      open: false,
      targetMode: null,
   });

   // ---------------------------------------------------------------------------
   // Start Functions
   // ---------------------------------------------------------------------------

   // Fetch Data [Categories, Occasions, Colors, (Product Data When Editing)]
   useEffect(() => {
      async function fetchAll() {
         try {
            const requests = [
               api.get("categories"),
               api.get("occasions"),
               api.get("colors"),
            ];
            if (isEdit) requests.push(api.get(`admin/products/${productId}`)); // When Edit

            const [categoriesRes, occasionsRes, colorsRes, productRes] =
               await Promise.all(requests);

            setCategories(categoriesRes.data);
            setOccasions(occasionsRes.data);
            setColorPresets(colorsRes.data);

            // When Edit
            if (isEdit && productRes) {
               const data = productRes.data;
               console.log("ON Editing: Product => ", data);

               setProduct({
                  name: data.title || "",
                  price: data.price || "",
                  description: data.description || "",
                  categoryId: data.category?.id || "",
                  occasionId: data.occasion?.id || "",
               });

               const colorMode = Boolean(data.hasColor);
               setHasColors(colorMode);
               originalHasColorsRef.current = colorMode;

               if (!colorMode) {
                  setGeneralImages(
                     (data.images ?? []).map((img) => ({
                        id: img.id,
                        existing: true,
                        preview: BASE_URL + img.imageUrl,
                     })),
                  );
               } else {
                  setProductColors(
                     (data.productColors ?? []).map((c) => ({
                        productColorId: c.id,
                        colorId: c.colorId,
                        name: c.name,
                        hex: c.hexCode,
                        isNew: false,
                        images: (c.images ?? []).map((img) => ({
                           id: img.id,
                           existing: true,
                           preview: BASE_URL + img.imageUrl,
                        })),
                     })),
                  );
               }
            }
         } catch (err) {
            console.error(err);
            toast.error("Failed to load form data");
         } finally {
            setFetchLoading(false);
         }
      }

      fetchAll();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isEdit, productId]);

   // ------------------------------------------------------------------
   // Basic Field Handler
   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProduct((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
   };

   // -------------------------------------------------------------------
   // General Image Handlers
   const handleGeneralFileChange = (e) => {
      const files = Array.from(e.target.files);
      const mapped = files.map((f) => ({
         uid: uid(),
         file: f,
         existing: false,
         preview: URL.createObjectURL(f),
      }));
      setGeneralImages((prev) => [...prev, ...mapped]);
      e.target.value = "";
   };

   const removeGeneralImage = (img) => {
      // To Remove From DB
      if (img.existing) {
         setRemovedGeneralImageIds((prev) => [...prev, img.id]);
      }
      // To Remove From UI
      setGeneralImages((prev) =>
         prev.filter((p) =>
            img.existing ? p.id !== img.id : p.uid !== img.uid,
         ),
      );
   };

   // ---------------------------------------------------------------------------------------------
   // Color Handlers
   const addColor = useCallback((preset) => {
      setProductColors((prev) => {
         console.log("Prev => ", prev);
         console.log(preset);
         if (prev.some((c) => c.colorId === preset.id)) {
            console.log("yes");
            return prev;
         }
         return [
            ...prev,
            {
               productColorId: null,
               colorId: preset.id,
               name: preset.name,
               hex: preset.hexCode,
               isNew: true,
               images: [],
            },
         ];
      });
   }, []);

   const removeColor = useCallback((colorId, productColorId) => {
      if (productColorId) {
         setRemovedProductColorIds((prev) => [...prev, productColorId]);
      }
      setProductColors((prev) => prev.filter((c) => c.colorId !== colorId));
   }, []);

   const addColorImages = useCallback((colorId, files) => {
      const newImgs = Array.from(files)
         .filter((f) => f.type.startsWith("image/"))
         .map((f) => ({
            uid: uid(),
            file: f,
            existing: false,
            preview: URL.createObjectURL(f),
         }));

      setProductColors((prev) =>
         prev.map((pc) =>
            pc.colorId === colorId
               ? { ...pc, images: [...pc.images, ...newImgs] }
               : pc,
         ),
      );
   }, []);

   // img Must Be the Full Object
   const removeColorImage = useCallback((colorId, img) => {
      if (img.existing && img.id) {
         setRemovedColorImageIds((prev) => {
            const existing = prev[colorId] ?? [];
            if (existing.includes(img.id)) return prev;
            return { ...prev, [colorId]: [...existing, img.id] };
         });
      }

      setProductColors((prev) =>
         prev.map((pc) =>
            pc.colorId === colorId
               ? {
                    ...pc,
                    images: pc.images.filter((i) =>
                       img.existing ? i.id !== img.id : i.uid !== img.uid,
                    ),
                 }
               : pc,
         ),
      );
   }, []);

   // ------------------------------------------------------------
   // Image-Mode Toggle
   const requestToggle = () => {
      const targetMode = hasColors ? "general" : "color";
      const itemCount = hasColors ? productColors.length : generalImages.length;

      if (itemCount === 0) {
         setHasColors((prev) => !prev);
         setErrors({});
         return;
      }

      setModeModal({ open: true, targetMode });
   };

   const confirmToggle = () => {
      if (hasColors) {
         // Move To General (Empty Colors)
         setProductColors([]);
         setRemovedProductColorIds([]);
         setRemovedColorImageIds({});
      } else {
         // Move To Colors (Empty General)
         setGeneralImages([]);
         setRemovedGeneralImageIds([]);
      }
      setHasColors((prev) => !prev);
      setErrors({});
      setModeModal({ open: false, targetMode: null });
   };

   const cancelToggle = () => setModeModal({ open: false, targetMode: null });

   // ------------------------------------------------------------------------
   // Validation
   const validate = () => {
      const newErrors = {};

      if (!product.name.trim()) newErrors.name = "Product name is required";

      if (!product.price || Number(product.price) <= 0)
         newErrors.price = "Price must be greater than 0";

      if (!product.description.trim())
         newErrors.description = "Description is required";

      if (!hasColors) {
         if (generalImages.length === 0)
            newErrors.images = "Upload at least one image";
      } else {
         if (productColors.length === 0) {
            newErrors.colors = "Add at least one color";
         } else if (productColors.some((c) => c.images.length === 0)) {
            newErrors.colors = "Each color must have at least one image";
         }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   // ------------------------------------------------------------------------
   // Submit
   const handleFormSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setLoading(true);

      try {
         const formData = new FormData();

         // Basic Info
         formData.append("title", product.name);
         formData.append("price", String(product.price));
         formData.append("description", product.description);
         formData.append("hasColor", String(hasColors));

         if (product.categoryId)
            formData.append("categoryId", product.categoryId);
         if (product.occasionId)
            formData.append("occasionId", product.occasionId);

         if (isEdit && originalHasColorsRef.current !== null) {
            const modeSwitched = originalHasColorsRef.current !== hasColors;
            formData.append("modeSwitched", String(modeSwitched));
         }

         if (!hasColors) {
            // General Images
            generalImages
               .filter((img) => !img.existing)
               .forEach((img) => formData.append("images", img.file));

            if (isEdit) {
               removedGeneralImageIds.forEach((id) =>
                  formData.append("removeImageIds", String(id)),
               );
            }
         } else {
            // Color Variants

            // colorsMeta:
            //   isNew: true  → Create New Product Color (productColorId => Null)
            //   isNew: false → Update Existing Produc tColor && (productColorId => required)
            //   removeImageIds → Remove Existing Images of Color
            const colorsMeta = productColors.map((c) => ({
               colorId: c.colorId,
               productColorId: c.productColorId, // null when isNew
               isNew: c.isNew,
               removeImageIds: removedColorImageIds[c.colorId] ?? [],
            }));

            productColors.forEach((c) => {
               c.images
                  .filter((img) => !img.existing)
                  .forEach((img) =>
                     formData.append(`color_${c.colorId}`, img.file),
                  );
            });

            formData.append("colorsMeta", JSON.stringify(colorsMeta));

            if (isEdit && removedProductColorIds.length > 0) {
               removedProductColorIds.forEach((id) =>
                  formData.append("removeColorIds", String(id)),
               );
            }
         }

         const config = { headers: { "Content-Type": "multipart/form-data" } };

         if (isEdit) {
            // Edit Request
            await api.put(`admin/products/${productId}/full`, formData, config);
            toast.success("Product updated successfully!");
         } else {
            // Create Request
            await api.post("admin/products", formData, config);
            toast.success("Product saved successfully!");
         }

         navigate("/products");
      } catch (err) {
         console.error(err?.response?.data);
         toast.error(
            isEdit ? "Failed to update product" : "Failed to save product",
         );
      } finally {
         setLoading(false);
      }
   };
   // ----------------------------------------------------------------------------------
   if (fetchLoading) return <Loading />;

   return (
      <>
         <form
            onSubmit={handleFormSubmit}
            className="bg-surface-container p-6 border border-outline-variant rounded-xl shadow-sm space-y-6"
         >
            {/* Name */}
            <div>
               <label className="required block text-on-surface-variant mb-2">
                  Product Name
               </label>
               <input
                  className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                  placeholder="e.g. Rose Elegance Bouquet"
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
               />
               {errors.name && (
                  <p className="text-error text-sm mt-1">{errors.name}</p>
               )}
            </div>

            {/* Price & Category & Occasion */}
            <div className="flex flex-wrap gap-3">
               <div className="min-w-60 flex-1">
                  <label className="required block text-on-surface-variant mb-2">
                     Price
                  </label>
                  <input
                     className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                     placeholder="$0.00"
                     type="number"
                     name="price"
                     value={product.price}
                     onChange={handleInputChange}
                  />
                  {errors.price && (
                     <p className="text-error text-sm mt-1">{errors.price}</p>
                  )}
               </div>

               {categories.length > 0 && (
                  <div className="min-w-60 flex-1">
                     <label className="block text-on-surface-variant mb-2">
                        Category
                     </label>
                     <select
                        className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                        name="categoryId"
                        value={product.categoryId}
                        onChange={handleInputChange}
                     >
                        <option value="">No Classification</option>
                        {categories.map((cat) => (
                           <option value={cat.id} key={cat.id}>
                              {cat.name}
                           </option>
                        ))}
                     </select>
                  </div>
               )}

               {occasions.length > 0 && (
                  <div className="min-w-60 flex-1">
                     <label className="block text-on-surface-variant mb-2">
                        Occasion
                     </label>
                     <select
                        className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                        name="occasionId"
                        value={product.occasionId}
                        onChange={handleInputChange}
                     >
                        <option value="">No Occasion</option>
                        {occasions.map((o) => (
                           <option value={o.id} key={o.id}>
                              {o.name}
                           </option>
                        ))}
                     </select>
                  </div>
               )}
            </div>

            {/* Images Section */}
            <div>
               <label className="required block text-on-surface-variant mb-2">
                  Images
               </label>

               {/* Toggle Button */}
               <div
                  onClick={requestToggle}
                  className="flex items-center gap-3 p-4 mb-4 border border-outline-variant rounded-xl bg-surface-container-lowest cursor-pointer select-none hover:border-primary transition-all"
               >
                  <div
                     className={`relative w-11 h-6 rounded-full transition-all ${hasColors ? "bg-indigo-600" : "bg-slate-300"}`}
                  >
                     <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${hasColors ? "left-6" : "left-1"}`}
                     />
                  </div>
                  <div>
                     <p className="text-sm font-semibold text-on-surface">
                        {hasColors
                           ? "Color variants mode"
                           : "General images mode"}
                     </p>
                     <p className="text-xs text-on-surface-variant">
                        {hasColors
                           ? "Images are uploaded per color variant"
                           : "Images are uploaded directly to the product"}
                     </p>
                  </div>
               </div>

               {/* General Images */}
               {!hasColors && (
                  <div>
                     <input
                        ref={generalFileRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleGeneralFileChange}
                     />

                     {generalImages.length === 0 ? (
                        <div
                           onClick={() => generalFileRef.current?.click()}
                           className="flex flex-col items-center gap-3 py-10 border-2 border-dashed border-outline-variant rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                        >
                           <AddPhotoAlternateIcon className="!text-3xl text-on-surface-variant" />
                           <p className="text-sm text-on-surface-variant">
                              Click to upload images
                           </p>
                        </div>
                     ) : (
                        <div className="flex flex-wrap gap-3">
                           {generalImages.map((img) => (
                              <div
                                 key={img.id ?? img.uid}
                                 className="relative group max-h-60 aspect-[6/7]"
                              >
                                 <img
                                    src={img.preview}
                                    alt=""
                                    className="w-full h-full object-cover rounded-xl border border-outline-variant"
                                 />
                                 {img === generalImages[0] && (
                                    <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-black/60 text-white rounded-b-xl py-0.5">
                                       cover
                                    </span>
                                 )}
                                 <button
                                    type="button"
                                    onClick={() => removeGeneralImage(img)}
                                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all"
                                 >
                                    <CloseIcon className="!text-[10px]" />
                                 </button>
                              </div>
                           ))}

                           <div
                              onClick={() => generalFileRef.current?.click()}
                              className="max-h-60 aspect-[6/7] rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-on-surface-variant text-xs"
                           >
                              <span className="text-2xl">+</span>
                              <span>Add more</span>
                           </div>
                        </div>
                     )}

                     {errors.images && (
                        <p className="text-error text-sm mt-2">
                           {errors.images}
                        </p>
                     )}
                  </div>
               )}

               {/* Color Images */}
               {hasColors && (
                  <div>
                     {/* Color Preset chips */}
                     <div className="flex flex-wrap gap-2 mb-4">
                        {colorPresets.map((c) => {
                           const isAdded = productColors.some(
                              (pc) => pc.colorId === c.id,
                           );
                           return (
                              <button
                                 key={c.id}
                                 type="button"
                                 onClick={() => addColor(c)}
                                 disabled={isAdded}
                                 className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-all ${
                                    isAdded
                                       ? "border-primary bg-primary/10 text-primary cursor-default"
                                       : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary"
                                 }`}
                              >
                                 <span
                                    className="w-3 h-3 rounded-full border border-outline-variant"
                                    style={{ background: c.hexCode }}
                                 />
                                 {c.name}
                                 {isAdded && <span className="ml-1">✓</span>}
                              </button>
                           );
                        })}
                     </div>

                     {/* Color rows */}
                     {productColors.length === 0 ? (
                        <div className="flex flex-col items-center py-10 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant gap-2">
                           <PaletteIcon className="!text-3xl" />
                           <p className="text-sm">
                              No colors yet — add one above
                           </p>
                        </div>
                     ) : (
                        <div className="flex flex-col gap-4">
                           {productColors.map((color) => (
                              <ColorRow
                                 key={color.productColorId ?? color.colorId}
                                 color={color}
                                 onRemoveColor={removeColor}
                                 onAddImages={addColorImages}
                                 onRemoveImage={removeColorImage}
                              />
                           ))}
                        </div>
                     )}

                     {errors.colors && (
                        <p className="text-error text-sm mt-2">
                           {errors.colors}
                        </p>
                     )}
                  </div>
               )}
            </div>

            {/* Description */}
            <div>
               <label className="required block text-on-surface-variant mb-2">
                  Description
               </label>
               <textarea
                  rows={5}
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  placeholder="Describe the product…"
                  className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-outline"
               />
               {errors.description && (
                  <p className="text-error text-sm mt-1">
                     {errors.description}
                  </p>
               )}
            </div>

            {/* Actions [Cancel, Save] */}
            <div className="flex items-center gap-4 pt-2">
               <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 rounded-lg transition-all"
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                     loading
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
               >
                  <SaveIcon className="!text-sm" />
                  {loading
                     ? "Saving…"
                     : isEdit
                       ? "Save Changes"
                       : "Save Product"}
               </button>
            </div>
         </form>

         {/* Image Mode Modal */}
         <ImageModeModal
            isOpen={modeModal.open}
            targetMode={modeModal.targetMode}
            itemCount={hasColors ? productColors.length : generalImages.length}
            onClose={cancelToggle}
            onConfirm={confirmToggle}
         />
      </>
   );
};

export default ProductForm;
