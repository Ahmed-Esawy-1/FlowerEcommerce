import React, { useState, useEffect, useRef } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import PaletteIcon from "@mui/icons-material/Palette";
import api from "../../api/axios";
import { Link } from "react-router";

const PRESET_COLORS = [
   { name: "Black", hex: "#1a1a1a" },
   { name: "White", hex: "#f0ede8" },
   { name: "Caramel", hex: "#C8813A" },
   { name: "Sage", hex: "#7A9E7E" },
   { name: "Navy", hex: "#1B3A5C" },
   { name: "Brick", hex: "#C0472F" },
   { name: "Rose", hex: "#D4A5A5" },
   { name: "Sand", hex: "#D4C5A9" },
];

let _uid = 0;
const uid = () => ++_uid;

const CreateProduct = () => {
   // ── basic fields ────────────────────────────────────────────────────────────
   const [product, setProduct] = useState({
      name: "",
      price: "",
      description: "",
      categoryId: "",
      occasionId: "",
   });

   // ── mode: false = general images | true = color variants ───────────────────
   const [hasColors, setHasColors] = useState(false);

   // ── general images (hasColors = false) ─────────────────────────────────────
   const [generalImages, setGeneralImages] = useState([]);
   const [generalPreviews, setGeneralPreviews] = useState([]);
   const generalFileRef = useRef(null);

   // ── color variants (hasColors = true) ──────────────────────────────────────
   // colors: [{ id, name, hex, images: [{ uid, file, preview }] }]
   const [colors, setColors] = useState([]);

   // ── errors ──────────────────────────────────────────────────────────────────
   const [errors, setErrors] = useState({});

   // ── data ────────────────────────────────────────────────────────────────────
   const [categories, setCategories] = useState([]);
   const [occasions, setOccasions] = useState([]);

   // ── loading ─────────────────────────────────────────────────────────────────
   const [loading, setLoading] = useState(false);

   // ── fetch categories & occasions ────────────────────────────────────────────
   useEffect(() => {
      api.get("categories")
         .then((r) => setCategories(r.data))
         .catch(console.error);
      api.get("occasions")
         .then((r) => setOccasions(r.data))
         .catch(console.error);
   }, []);

   // ── general image previews ──────────────────────────────────────────────────
   useEffect(() => {
      const urls = generalImages.map((f) => URL.createObjectURL(f));
      setGeneralPreviews(urls);
      return () => urls.forEach((u) => URL.revokeObjectURL(u));
   }, [generalImages]);

   // ── handlers: basic fields ──────────────────────────────────────────────────
   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProduct((prev) => ({ ...prev, [name]: value }));
   };

   // ── handlers: general images ────────────────────────────────────────────────
   const handleGeneralFileChange = (e) => {
      const files = Array.from(e.target.files);
      setGeneralImages((prev) => [...prev, ...files]);
   };

   const removeGeneralImage = (index) => {
      setGeneralImages((prev) => prev.filter((_, i) => i !== index));
   };

   // ── handlers: colors ────────────────────────────────────────────────────────
   const addColor = (preset = null) => {
      setColors((prev) => [
         ...prev,
         {
            id: uid(),
            name: preset?.name ?? "",
            hex: preset?.hex ?? "#888888",
            images: [],
         },
      ]);
   };

   const removeColor = (id) => {
      setColors((prev) => prev.filter((c) => c.id !== id));
   };

   const updateColor = (id, key, val) => {
      setColors((prev) =>
         prev.map((c) => (c.id === id ? { ...c, [key]: val } : c)),
      );
   };

   const addColorImages = (id, files) => {
      const newImgs = Array.from(files)
         .filter((f) => f.type.startsWith("image/"))
         .map((f) => ({
            uid: uid(),
            file: f,
            preview: URL.createObjectURL(f),
         }));

      setColors((prev) =>
         prev.map((c) =>
            c.id === id ? { ...c, images: [...c.images, ...newImgs] } : c,
         ),
      );
   };

   const removeColorImage = (colorId, imgUid) => {
      setColors((prev) =>
         prev.map((c) =>
            c.id === colorId
               ? { ...c, images: c.images.filter((i) => i.uid !== imgUid) }
               : c,
         ),
      );
   };

   // ── validation ───────────────────────────────────────────────────────────────
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
         if (colors.length === 0) newErrors.colors = "Add at least one color";
         else {
            const missing = colors.some((c) => c.images.length === 0);
            if (missing)
               newErrors.colors = "Each color must have at least one image";
            const noName = colors.some((c) => !c.name.trim());
            if (noName) newErrors.colors = "Each color must have a name";
         }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const isDisabled =
      !product.name.trim() ||
      !product.price ||
      Number(product.price) <= 0 ||
      !product.description.trim() ||
      (!hasColors && generalImages.length === 0) ||
      (hasColors && colors.length === 0);

   // ── submit ───────────────────────────────────────────────────────────────────
   const handleFormSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setLoading(true);
      try {
         // ── Step 1: create product ──
         const formData = new FormData();
         formData.append("title", product.name);
         formData.append("price", product.price);
         formData.append("description", product.description);
         if (product.categoryId)
            formData.append("categoryId", product.categoryId);
         if (product.occasionId)
            formData.append("occasionId", product.occasionId);

         // if no colors → attach general images now
         if (!hasColors) {
            generalImages.forEach((f) => formData.append("images", f));
         }

         const { data: created } = await api.post("products", formData, {
            headers: { "Content-Type": "multipart/form-data" },
         });

         // ── Step 2: add each color with its images ──
         if (hasColors) {
            for (const color of colors) {
               const cfd = new FormData();
               cfd.append("name", color.name);
               cfd.append("hexCode", color.hex);
               color.images.forEach((img) => cfd.append("images", img.file));
               await api.post(`products/${created.id}/colors`, cfd, {
                  headers: { "Content-Type": "multipart/form-data" },
               });
            }
         }

         alert("Product saved ✅");
         resetForm();
      } catch (error) {
         console.error(error);
         alert("Something went wrong ❌");
      } finally {
         setLoading(false);
      }
   };

   const resetForm = () => {
      setProduct({
         name: "",
         price: "",
         description: "",
         categoryId: "",
         occasionId: "",
      });
      setGeneralImages([]);
      setColors([]);
      setHasColors(false);
      setErrors({});
      if (generalFileRef.current) generalFileRef.current.value = "";
   };

   // ── render ───────────────────────────────────────────────────────────────────
   return (
      <>
         {/* Breadcrumbs & Header */}
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

         {/* Form */}
         <form
            className="bg-surface-container p-6 border border-outline-variant rounded-xl shadow-sm space-y-6"
            onSubmit={handleFormSubmit}
         >
            <div className="grid grid-cols-2 gap-lg">
               {/* Name */}
               <div className="col-span-2 mb-4">
                  <label className="required block text-on-surface-variant mb-2">
                     Product Name
                  </label>
                  <input
                     className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                     placeholder="e.g. Premium Wireless Headphones"
                     type="text"
                     name="name"
                     value={product.name}
                     onChange={handleInputChange}
                  />
                  {errors.name && (
                     <p className="text-error text-sm mt-1">{errors.name}</p>
                  )}
               </div>

               {/* Price */}
               <div className="col-span-2 mb-4">
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

               {/* Category */}
               {categories.length > 0 && (
                  <div className="col-span-2 mb-4">
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

               {/* Occasion */}
               {occasions.length > 0 && (
                  <div className="col-span-2 mb-4">
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

               {/* ── Images Section ── */}
               <div className="col-span-2 mb-4">
                  <label className="required block text-on-surface-variant mb-2">
                     Images
                  </label>

                  {/* Toggle */}
                  <div
                     className="flex items-center gap-3 p-3 mb-4 border border-outline-variant rounded-lg bg-surface-container-lowest cursor-pointer select-none"
                     onClick={() => {
                        setHasColors((v) => !v);
                        setErrors({});
                     }}
                  >
                     {/* toggle switch */}
                     <div
                        className={`relative w-10 h-5 rounded-full transition-colors ${hasColors ? "bg-indigo-600" : "bg-slate-300"}`}
                     >
                        <span
                           className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${hasColors ? "left-5" : "left-0.5"}`}
                        />
                     </div>
                     <div>
                        <p className="text-sm font-medium text-on-surface">
                           {hasColors
                              ? "Product has color variants"
                              : "Product has no color variants"}
                        </p>
                        <p className="text-xs text-outline">
                           {hasColors
                              ? "Images are uploaded per color"
                              : "Images are uploaded directly to the product"}
                        </p>
                     </div>
                  </div>

                  {/* ── General Images ── */}
                  {!hasColors && (
                     <div>
                        <input
                           ref={generalFileRef}
                           type="file"
                           accept="image/*"
                           multiple
                           className="w-full px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface transition-all"
                           onChange={handleGeneralFileChange}
                        />
                        {generalImages.length > 0 && (
                           <div className="flex gap-3 mt-4 flex-wrap">
                              {generalPreviews.map((src, i) => (
                                 <div
                                    className="max-h-60 aspect-[6/7] relative"
                                    key={i}
                                 >
                                    <img
                                       src={src}
                                       alt="preview"
                                       className="w-full h-full object-cover border rounded-lg"
                                    />
                                    {i === 0 && (
                                       <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-black/60 text-white rounded-b-lg py-0.5">
                                          cover
                                       </span>
                                    )}
                                    <CloseIcon
                                       className="absolute top-2 right-2 bg-black p-1 rounded-full text-white cursor-pointer"
                                       fontSize="small"
                                       onClick={() => removeGeneralImage(i)}
                                    />
                                 </div>
                              ))}
                           </div>
                        )}
                        {errors.images && (
                           <p className="text-error text-sm mt-1">
                              {errors.images}
                           </p>
                        )}
                     </div>
                  )}

                  {/* ── Color Variants ── */}
                  {hasColors && (
                     <div>
                        {/* Preset quick-add */}
                        <div className="flex flex-wrap gap-2 mb-4">
                           {PRESET_COLORS.map((p) => (
                              <button
                                 key={p.hex}
                                 type="button"
                                 onClick={() => addColor(p)}
                                 className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface-variant hover:border-primary transition-all"
                              >
                                 <span
                                    className="w-3 h-3 rounded-full border border-outline-variant"
                                    style={{ background: p.hex }}
                                 />
                                 {p.name}
                              </button>
                           ))}
                           <button
                              type="button"
                              onClick={() => addColor()}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-dashed border-outline-variant rounded-lg text-outline hover:border-primary hover:text-on-surface transition-all"
                           >
                              <AddIcon className="!text-sm" /> Custom
                           </button>
                        </div>

                        {/* Color rows */}
                        {colors.length === 0 ? (
                           <div className="flex flex-col items-center py-10 border border-dashed border-outline-variant rounded-lg text-outline gap-2">
                              <PaletteIcon className="!text-3xl" />
                              <p className="text-sm">
                                 No colors yet — add one above
                              </p>
                           </div>
                        ) : (
                           <div className="flex flex-col gap-4">
                              {colors.map((color) => (
                                 <ColorRow
                                    key={color.id}
                                    color={color}
                                    onUpdateColor={updateColor}
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
               <div className="col-span-2 mb-4">
                  <label className="required block text-on-surface-variant mb-2">
                     Description
                  </label>
                  <textarea
                     className="w-full min-h-20 px-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                     placeholder="Briefly describe the product's features and benefits..."
                     rows="4"
                     value={product.description}
                     name="description"
                     onChange={handleInputChange}
                  />
                  {errors.description && (
                     <p className="text-error text-sm mt-1">
                        {errors.description}
                     </p>
                  )}
               </div>

               {/* Actions */}
               <div className="col-span-2 flex items-center gap-4">
                  <button
                     type="button"
                     onClick={resetForm}
                     className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 rounded-lg transition-all"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     disabled={isDisabled || loading}
                     className={`px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2
                ${
                   isDisabled || loading
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                  >
                     <SaveIcon className="!text-sm" />
                     {loading ? "Saving..." : "Save Product"}
                  </button>
               </div>
            </div>
         </form>
      </>
   );
};

// ── ColorRow component ────────────────────────────────────────────────────────
const ColorRow = ({
   color,
   onUpdateColor,
   onRemoveColor,
   onAddImages,
   onRemoveImage,
}) => {
   const fileRef = useRef(null);

   const handleDrop = (e) => {
      e.preventDefault();
      onAddImages(color.id, e.dataTransfer.files);
   };

   return (
      <div className="border border-outline-variant rounded-xl p-4 bg-surface-container-lowest">
         {/* Top row: color picker + name + hex + remove */}
         <div className="flex items-center gap-3 mb-3">
            {/* Color picker */}
            <label
               className="w-9 h-9 rounded-full border-2 border-outline-variant cursor-pointer flex-shrink-0 relative overflow-hidden"
               style={{ background: color.hex }}
               title="Pick color"
            >
               <input
                  type="color"
                  value={color.hex}
                  onChange={(e) =>
                     onUpdateColor(color.id, "hex", e.target.value)
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
               />
            </label>

            {/* Name */}
            <input
               type="text"
               placeholder="Color name (e.g. Caramel)"
               value={color.name}
               onChange={(e) => onUpdateColor(color.id, "name", e.target.value)}
               className="flex-1 px-3 py-2 text-sm bg-surface-container-lowest border border-outline-variant rounded-lg outline-none focus:border-primary text-on-surface placeholder:text-outline"
            />

            {/* Hex */}
            <input
               type="text"
               value={color.hex}
               maxLength={7}
               onChange={(e) => onUpdateColor(color.id, "hex", e.target.value)}
               className="w-24 px-3 py-2 text-xs font-mono bg-surface-container-lowest border border-outline-variant rounded-lg outline-none focus:border-primary text-on-surface-variant"
            />

            {/* Remove color */}
            <button
               type="button"
               onClick={() => onRemoveColor(color.id)}
               className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-outline hover:bg-red-50 hover:text-error hover:border-red-200 transition-all"
            >
               <CloseIcon className="!text-sm" />
            </button>
         </div>

         {/* Drop zone */}
         <div
            className="border-2 border-dashed border-outline-variant rounded-lg p-3 cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
         >
            <input
               ref={fileRef}
               type="file"
               accept="image/*"
               multiple
               className="hidden"
               onChange={(e) => onAddImages(color.id, e.target.files)}
            />

            {color.images.length === 0 ? (
               <div className="flex flex-col items-center py-4 text-outline gap-1">
                  <p className="text-sm font-medium">
                     Drop images or click to upload
                  </p>
                  <p className="text-xs">PNG, JPG, WEBP — multiple allowed</p>
               </div>
            ) : (
               <>
                  <div className="flex flex-wrap gap-2">
                     {color.images.map((img, i) => (
                        <div
                           key={img.uid}
                           className="relative w-16 h-16 flex-shrink-0 group"
                        >
                           <img
                              src={img.preview}
                              alt="preview"
                              className="w-full h-full object-cover rounded-lg border border-outline-variant"
                           />
                           {i === 0 && (
                              <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-black/60 text-white rounded-b-lg py-0.5">
                                 cover
                              </span>
                           )}
                           <div
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs hidden group-hover:flex items-center justify-center shadow cursor-pointer"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 onRemoveImage(color.id, img.uid);
                              }}
                           >
                              <CloseIcon className="!text-[10px]" />
                           </div>
                        </div>
                     ))}

                     {/* Add more */}
                     <div className="w-16 h-16 rounded-lg border-2 border-dashed border-outline-variant flex items-center justify-center text-outline text-xl hover:border-primary transition-colors">
                        +
                     </div>
                  </div>
                  <p className="text-xs text-outline mt-2">
                     {color.images.length} image
                     {color.images.length > 1 ? "s" : ""} · first image is the
                     cover
                  </p>
               </>
            )}
         </div>
      </div>
   );
};

export default CreateProduct;
