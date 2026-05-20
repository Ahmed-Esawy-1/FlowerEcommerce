import React, { useState, useEffect, useRef } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import api from "../../api/axios";
import { Link } from "react-router";
const CreateOccasion = () => {
   const [occasion, setOccasion] = useState({
      name: "",
      image: null,
   });
   const [error, setError] = useState("");
   const fileInputRef = useRef(null);

   const isDisabled = !occasion.name.trim();

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setOccasion({
         ...occasion,
         [name]: value,
      });
   };

   // Handle Images
   const handleFileChange = (e) => {
      const file = Array.from(e.target.files)[0];
      setOccasion((prev) => ({ ...prev, image: file }));
   };

   const removeImage = () => {
      setOccasion((prev) => ({
         ...prev,
         image: null,
      }));
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   // Submit
   async function handleFormSubmit(e) {
      console.log(occasion);
      e.preventDefault();

      if (occasion.name.trim().length === 0) {
         error = "Occasion Name is required";
         return;
      }
      try {
         const formData = new FormData();
         formData.append("name", occasion.name);
         formData.append("image", occasion.image);

         await api.post("occasions", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         alert("Product saved ✅");

         setOccasion({
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
               <nav className="flex items-center gap-2 mb-2 text-slate-500 uppercase tracking-wide">
                  <Link
                     to="/occasions"
                     className="text-xl font-bold hover:text-indigo-600 tracking-tighter"
                  >
                     Occasions
                  </Link>
                  <ChevronRightIcon className="!text-xs" />
                  <span className="text-indigo-600 font-bold">Create New</span>
               </nav>
               <h2 className="text-on-surface">Create New Occasion</h2>
               <p className="page-subtitle mt-1">
                  Create a occasion listing with pricing, images, and detailed
                  information to make it ready for customers to explore and
                  purchase.
               </p>
            </div>
         </div>
         {/*  Form  */}
         <form
            className="bg-surface-container p-6 border border-outline-variant rounded-xl shadow-sm space-y-6"
            onSubmit={handleFormSubmit}
         >
            <div className="grid grid-cols-2 gap-lg">
               <div className="col-span-2 mb-4">
                  <label className="required block text-on-surface-variant mb-2">
                     Occasion Name
                  </label>
                  <input
                     className="w-full pl-10 pr-stack-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20  transition-all placeholder:text-outline"
                     placeholder="e.g. Premium Wireless Headphones"
                     type="text"
                     name="name"
                     value={occasion.name}
                     onChange={handleInputChange}
                  />
                  {error && <p className="text-error">{error}</p>}
               </div>
               <div className="col-span-2 mb-4">
                  <label className="block text-on-surface-variant mb-2">
                     image
                  </label>
                  <input
                     ref={fileInputRef}
                     className="w-full pl-10 pr-stack-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20  transition-all placeholder:text-outline"
                     type="file"
                     accept="image/*"
                     onChange={handleFileChange}
                  />
                  {occasion.image && (
                     <div className="flex gap-3 mt-4 flex-wrap">
                        <div className="max-h-60 aspect-[6/7] relative">
                           <img
                              src={URL.createObjectURL(occasion.image)}
                              alt="preview"
                              className="w-full h-full object-cover rounded-lg border border-outline-variant"
                           />
                           <CloseIcon
                              className="absolute top-2 right-2 bg-black p-2 rounded-full text-error font-black cursor-pointer"
                              fontSize="large"
                              onClick={removeImage}
                           />
                        </div>
                     </div>
                  )}
               </div>

               <div className="flex items-center gap-4">
                  <button
                     type="submit"
                     disabled={isDisabled}
                     className={`px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2
                  ${
                     isDisabled
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  >
                     <SaveIcon className="!text-sm" />
                     Save Occasion
                  </button>
               </div>
            </div>
         </form>
      </>
   );
};

export default CreateOccasion;
