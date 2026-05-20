import React, { useState, useRef } from "react";
import { Link } from "react-router";
import api from "../../api/axios";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

const CreateCategory = () => {
   const [category, setCategory] = useState({
      name: "",
      image: null,
   });

   const [error, setError] = useState("");
   const fileInputRef = useRef(null);

   const isDisabled = !category.name.trim();

   const handleInputChange = (e) => {
      const { name, value } = e.target;

      setCategory((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   // Image
   const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setCategory((prev) => ({
         ...prev,
         image: file,
      }));
   };

   const removeImage = () => {
      setCategory((prev) => ({
         ...prev,
         image: null,
      }));

      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   // Submit
   async function handleFormSubmit(e) {
      e.preventDefault();

      if (!category.name.trim()) {
         setError("Category name is required");
         return;
      }

      try {
         const formData = new FormData();
         formData.append("name", category.name);

         if (category.image) {
            formData.append("image", category.image);
         }

         await api.post("categories", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         alert("Category saved ✅");

         setCategory({
            name: "",
            image: null,
         });

         setError("");

         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }
      } catch (error) {
         setError(error?.response?.data?.message);
      }
   }

   return (
      <>
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
               <nav className="flex items-center gap-2 mb-2 text-indigo-600 hover:text-indigo-600 uppercase tracking-wide">
                  <Link to="/categories" className="page-title">
                     Categories
                  </Link>
                  <ChevronRightIcon className="!text-xs" />
                  <span className="text-indigo-600 hover:text-indigo-600 font-bold">
                     Create New
                  </span>
               </nav>

               <h2 className="text-on-surface">Create New Category</h2>

               <p className="page-subtitle">
                  Configure your category details and image.
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
                     Category Name
                  </label>

                  <input
                     type="text"
                     name="name"
                     value={category.name}
                     onChange={handleInputChange}
                     placeholder="e.g. Electronics"
                     className="w-full pl-10 pr-stack-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20  transition-all placeholder:text-outline"
                  />

                  {error && <p className="text-error text-sm mt-1">{error}</p>}
               </div>

               {/* Image */}
               <div className="col-span-2 mb-4">
                  <label className="block text-on-surface-variant mb-2">
                     Image
                  </label>

                  <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/*"
                     onChange={handleFileChange}
                     className="w-full pl-10 pr-stack-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline"
                  />

                  {category.image && (
                     <div className="flex gap-3 mt-4">
                        <div className="relative max-h-60 aspect-[6/7]">
                           <img
                              src={URL.createObjectURL(category.image)}
                              alt="preview"
                              className="w-full h-full object-cover rounded-lg border border-outline-variant"
                           />

                           <CloseIcon
                              onClick={removeImage}
                              className="absolute top-2 right-2 bg-black text-white p-1 rounded-full cursor-pointer"
                           />
                        </div>
                     </div>
                  )}
               </div>

               {/* Actions */}
               <div className="flex items-center gap-4">
                  <button
                     type="button"
                     onClick={() => {
                        setCategory({ name: "", image: null });
                        setError("");
                        if (fileInputRef.current)
                           fileInputRef.current.value = "";
                     }}
                     className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                     Cancel
                  </button>

                  <button
                     type="submit"
                     disabled={isDisabled}
                     className={`px-6 py-2.5 text-white rounded-lg flex items-center gap-2 transition-all
                  ${
                     isDisabled
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  >
                     <SaveIcon className="!text-sm" />
                     Save Category
                  </button>
               </div>
            </div>
         </form>
      </>
   );
};

export default CreateCategory;
