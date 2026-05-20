import React, { useEffect, useState, useMemo } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import api from "../../api/axios";
import { Link, useParams } from "react-router";
const UpdateOrder = () => {
   const { productId } = useParams();

   const [product, setProduct] = useState({
      title: "",
      price: "",
      description: "",
      categoryId: "",
      occasionId: "",
   });
   const [originalProduct, setOriginalProduct] = useState(null);

   const [existingImages, setExistingImages] = useState([]);
   const [newImages, setNewImages] = useState([]);
   const [newImagesPreview, setNewImagesPreview] = useState([]);
   const [removedImageIds, setRemovedImageIds] = useState([]);

   const [categories, setCategories] = useState([]);
   const [occasions, setOccasions] = useState([]);

   // FETCH PRODUCT
   const getProduct = async () => {
      const { data } = await api.get("products/" + productId);

      const formatted = {
         title: data.title || "",
         price: data.price || "",
         description: data.description || "",
         categoryId: data.category?.id || "",
         occasionId: data.occasion?.id || "",
      };

      setProduct(formatted);
      setOriginalProduct(formatted);

      setExistingImages(
         (data.images || []).map((img) => ({
            id: img.id,
            url: `http://localhost:8080${img.imageUrl}`,
         })),
      );
   };

   // load All Data
   useEffect(() => {
      getProduct();
   }, [productId]);

   useEffect(() => {
      const getCategories = async () => {
         const res = await api.get("categories");
         setCategories(res.data);
      };
      getCategories();
   }, []);

   useEffect(() => {
      const getOccasions = async () => {
         const res = await api.get("occasions");
         setOccasions(res.data);
      };
      getOccasions();
   }, []);

   // Inputs
   const handleInputChange = useCallback((e) => {
      const { name, value } = e.target;
      setProduct({
         ...product,
         [name]: value,
      });
   });

   // Images
   const handleFileChange = (e) => {
      const files = Array.from(e.target.files);

      setNewImages((prev) => [...prev, ...files]);

      const previews = files.map((file) => URL.createObjectURL(file));
      setNewImagesPreview((prev) => [...prev, ...previews]);
   };

   useEffect(() => {
      return () => {
         newImagesPreview.forEach((url) => URL.revokeObjectURL(url));
      };
   }, [newImagesPreview]);

   const removeExistingImage = (id) => {
      setRemovedImageIds((prev) => [...prev, id]);
      setExistingImages((prev) => prev.filter((img) => img.id !== id));
   };

   const removeNewImage = (index) => {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
      setNewImagesPreview((prev) => prev.filter((_, i) => i !== index));
   };

   // Disabled
   const isProductChanged = useMemo(() => {
      if (!originalProduct) return false;

      const fieldsChanged =
         product.title !== originalProduct.title ||
         product.price !== originalProduct.price ||
         product.description !== originalProduct.description ||
         product.categoryId !== originalProduct.categoryId ||
         product.occasionId !== originalProduct.occasionId;

      return (
         fieldsChanged || newImages.length > 0 || removedImageIds.length > 0
      );
   }, [product, originalProduct, newImages.length, removedImageIds.length]);

   //  Rest
   const resetForm = () => {
      setProduct(originalProduct);
      setExistingImages([]);
      setNewImages([]);
      setNewImagesPreview([]);
      setRemovedImageIds([]);
      getProduct();
   };
   // Submit
   async function handleFormSubmit(e) {
      e.preventDefault();

      try {
         const formData = new FormData();

         Object.entries(product).forEach(([k, v]) => {
            if (v !== null && v !== undefined) {
               formData.append(k, v);
            }
         });

         newImages.forEach((file) => {
            formData.append("newImages", file);
         });

         removedImageIds.forEach((id) => {
            formData.append("removedImageIds", id);
         });

         await api.put("products/" + productId, formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         alert("Product updated ✅");

         await getProduct();

         setRemovedImageIds([]);
         setNewImages([]);
         setNewImagesPreview([]);
      } catch (error) {
         console.error(error);
      }
   }

   return (
      <>
         {/*  Breadcrumbs & Header  */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
               <nav className="flex items-center gap-2 mb-2 text-slate-500 uppercase tracking-wide">
                  <Link
                     to="/products"
                     className="text-xl font-bold hover:text-indigo-600 tracking-tighter"
                     href="#"
                  >
                     Products
                  </Link>
                  <ChevronRightIcon className="!text-xs" />
                  <span className="text-indigo-600 font-bold">Update</span>
               </nav>
               <h2 className="text-on-surface">Update Product</h2>
               <p className="text-slate-500 mt-1">
                  Modify your product details, update images, and manage
                  inventory information.
               </p>
            </div>
         </div>
         {/*  Form Layout: Bento Grid Style  */}
         <form className="space-y-6" onSubmit={handleFormSubmit}>
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
               <div className="grid grid-cols-2 gap-lg">
                  <div className="col-span-2">
                     <label className="block text-slate-700 mb-2">
                        Product Name
                     </label>
                     <input
                        className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                        placeholder="e.g. Premium Wireless Headphones"
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={handleInputChange}
                     />
                  </div>
                  <div className="col-span-2">
                     <label className="block text-slate-700 mb-2">Price</label>
                     <input
                        className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                        placeholder="$"
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                     />
                  </div>
                  <div className="col-span-2">
                     <label className="block text-slate-700 mb-2">
                        Category
                     </label>
                     <select
                        className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                        name="categoryId"
                        value={product.categoryId}
                        onChange={handleInputChange}
                     >
                        <option value="">Not Classification</option>
                        {categories.map((cat) => (
                           <option value={cat.id} key={cat.id}>
                              {cat.name}
                           </option>
                        ))}
                     </select>
                  </div>
                  <div className="col-span-2">
                     <label className="block text-slate-700 mb-2">
                        Occasion
                     </label>
                     <select
                        className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                        name="occasionId"
                        value={product.occasionId}
                        onChange={handleInputChange}
                     >
                        <option value="">Not Occasion</option>
                        {occasions.map((occasion) => (
                           <option value={occasion.id} key={occasion.id}>
                              {occasion.name}
                           </option>
                        ))}
                     </select>
                  </div>
                  <div className="col-span-2 mb-4">
                     <label className="block text-slate-700 mb-2">images</label>
                     <input
                        className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                     />
                     <div className="flex gap-3 flex-wrap mt-4">
                        {existingImages.length > 0 && (
                           <div className="flex gap-3 flex-wrap">
                              {existingImages.map((img, i) => (
                                 <div
                                    className="max-h-60 aspect-[6/7] relative"
                                    key={i}
                                 >
                                    <img
                                       src={img.url}
                                       alt="preview"
                                       className="w-full h-full object-cover border rounded-lg"
                                    />
                                    <CloseIcon
                                       className="absolute top-2 right-2 bg-black p-2 rounded-full text-error font-black cursor-pointer"
                                       fontSize="large"
                                       onClick={() =>
                                          removeExistingImage(img.id)
                                       }
                                    />
                                 </div>
                              ))}
                           </div>
                        )}
                        {newImagesPreview.length > 0 && (
                           <div className="flex gap-3 flex-wrap">
                              {newImagesPreview.map((src, i) => (
                                 <div
                                    className="max-h-60 aspect-[6/7] relative"
                                    key={i}
                                 >
                                    <img
                                       src={src}
                                       alt="preview"
                                       className="w-full h-full object-cover border rounded-lg"
                                    />
                                    <CloseIcon
                                       className="absolute top-2 right-2 bg-black p-2 rounded-full text-error font-black cursor-pointer"
                                       fontSize="large"
                                       onClick={() => removeNewImage(i)}
                                    />
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
                  <div className="col-span-2 mb-4">
                     <label className="block text-slate-700 mb-2">
                        Description
                     </label>
                     <textarea
                        className="w-full min-h-20 px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                        placeholder="Briefly describe the product's features and benefits..."
                        rows="4"
                        value={product.description}
                        name="description"
                        onChange={handleInputChange}
                     ></textarea>
                  </div>
                  <div className="flex items-center gap-4">
                     <button
                        type="reset"
                        disabled={!isProductChanged}
                        onClick={resetForm}
                        className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold  border border-slate-200 rounded-lg transition-all"
                     >
                        Cancel
                     </button>
                     <button
                        type="submit"
                        disabled={!isProductChanged}
                        className={`px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2
                  ${
                     isProductChanged
                        ? "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200"
                        : "bg-slate-400 cursor-not-allowed"
                  }`}
                     >
                        <SaveIcon className="!text-sm" />
                        Save Product
                     </button>
                  </div>
               </div>
            </section>
         </form>
      </>
   );
};

export default UpdateOrder;
