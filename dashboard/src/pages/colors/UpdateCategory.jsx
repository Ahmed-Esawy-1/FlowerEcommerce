import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link, useParams } from "react-router";
import api from "../../api/axios";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const UpdateCategory = () => {
   const { categoryId } = useParams();
   const fileInputRef = useRef(null);

   const [originalCategory, setOriginalCategory] = useState(null);

   const [name, setName] = useState("");
   const [existingImage, setExistingImage] = useState(null);
   const [newImage, setNewImage] = useState(null);

   const [loading, setLoading] = useState(false);

   const [error, setError] = useState("");

   // detect changes (like Occasion)
   const isCategoryChanged = useMemo(() => {
      if (!originalCategory) return false;

      const nameChanged = name !== originalCategory.name;

      return nameChanged || newImage;
   }, [name, newImage, originalCategory]);

   // GET CATEGORY
   useEffect(() => {
      async function getCategory() {
         setLoading(true);
         try {
            const { data } = await api.get("categories/" + categoryId);

            setName(data.name || "");

            if (data.imageUrl) {
               setExistingImage(`http://localhost:8080${data.imageUrl}`);
            }

            setOriginalCategory({
               name: data.name,
               image: data.imageUrl,
            });
         } catch (error) {
            console.log(error);
            alert("Failed to load category");
         } finally {
            setLoading(false);
         }
      }

      getCategory();
   }, [categoryId]);

   // IMAGE CHANGE
   const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setNewImage(file);
   };

   // preview like Occasion
   const previewImage = useMemo(() => {
      if (!newImage) return null;
      return URL.createObjectURL(newImage);
   }, [newImage]);

   // cleanup
   useEffect(() => {
      return () => {
         if (previewImage) URL.revokeObjectURL(previewImage);
      };
   }, [previewImage]);

   const removeNewImage = () => {
      setNewImage(null);

      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   // SUBMIT
   async function handleFormSubmit(e) {
      e.preventDefault();
      setLoading(true);

      try {
         const formData = new FormData();

         formData.append("name", name);

         if (newImage) {
            formData.append("image", newImage);
         }

         await api.put("categories/" + categoryId, formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         setOriginalCategory({
            name,
            image: previewImage || existingImage,
         });

         if (previewImage) {
            setExistingImage(previewImage);
         }

         setNewImage(null);
         setError(null);

         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }

         alert("Category updated successfully ✅");
      } catch (error) {
         setError(error?.response?.data?.message);
      } finally {
         setLoading(false);
      }
   }

   return (
      <>
         {/* HEADER */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
               <nav className="flex items-center gap-2 mb-2 text-slate-500 uppercase tracking-wide">
                  <Link
                     to="/categories"
                     className="text-xl font-bold hover:text-indigo-600 tracking-tighter"
                  >
                     Categories
                  </Link>

                  <ChevronRightIcon className="!text-xs" />

                  <span className="text-indigo-600 hover:text-indigo-600 font-bold">
                     Update
                  </span>
               </nav>

               <h2 className="text-on-surface">Update Category</h2>

               <p className="page-subtitle mt-1">
                  Update category information and image.
               </p>
            </div>
         </div>

         {/* FORM */}
         <form
            className="bg-surface-container p-6 border border-outline-variant rounded-xl shadow-sm space-y-6"
            onSubmit={handleFormSubmit}
         >
            <div className="grid grid-cols-2 gap-lg">
               <div className="col-span-2 mb-4">
                  <label className="block text-on-surface-variant mb-2">
                     Category Name
                  </label>

                  <input
                     className="w-full pl-10 pr-stack-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                     type="text"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                  />
                  {error && <p className="text-error">{error}</p>}
               </div>

               <div className="col-span-2 mb-4">
                  <label className="block text-on-surface-variant mb-2">
                     Image
                  </label>

                  <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/*"
                     onChange={handleFileChange}
                     className="w-full pl-10 pr-stack-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outlinew-full pl-10 pr-stack-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                  />

                  <div className="flex gap-5 mt-4 flex-wrap">
                     {existingImage ? (
                        <div>
                           <p className="mb-2">Current Image:</p>
                           <img
                              src={existingImage}
                              alt="category"
                              className="w-40 h-40 object-cover rounded-lg border border-outline-variant"
                           />
                        </div>
                     ) : (
                        <p>No image</p>
                     )}

                     {previewImage && (
                        <div className="relative">
                           <p className="mb-2">New Image:</p>

                           <img
                              src={previewImage}
                              alt="preview"
                              className="w-40 h-40 object-cover rounded-lg border border-outline-variant"
                           />

                           <CloseIcon
                              onClick={removeNewImage}
                              className="absolute top-10 right-2 bg-black text-white rounded-full cursor-pointer"
                           />
                        </div>
                     )}
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <button
                     type="submit"
                     disabled={!isCategoryChanged || loading}
                     className={`px-6 py-2.5 text-white rounded-lg flex items-center gap-2
                        ${
                           !isCategoryChanged || loading
                              ? "bg-slate-400 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                  >
                     <SaveIcon className="!text-sm" />
                     {loading ? "Saving..." : "Save Category"}
                  </button>
               </div>
            </div>
         </form>
      </>
   );
};

export default UpdateCategory;
