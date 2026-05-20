import React, { useState, useEffect, useRef, useMemo } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import api from "../../api/axios";
import { Link, useParams } from "react-router";
import { BASE_URL } from "../../api/config";
const UpdateOccasion = () => {
   const { occasionId } = useParams();
   const fileInputRef = useRef(null);
   const [originalOccasion, setOriginalOccasion] = useState(null);

   const [name, setName] = useState("");
   const [existingImage, setExistingImage] = useState(null);
   const [newImage, setNewImage] = useState(null);

   const [loading, setLoading] = useState(false);

   const [error, setError] = useState(false);

   const isOccasionChanged = useMemo(() => {
      if (!originalOccasion) return false;

      const fieldsChanged = name !== originalOccasion.name;

      return fieldsChanged || newImage;
   }, [name, originalOccasion, newImage]);

   // Get Category Info
   useEffect(() => {
      async function getOccasion() {
         setLoading(true);
         try {
            const { data } = await api.get("occasions/" + occasionId);

            setName(data.name || "");

            if (data.imageUrl) {
               setExistingImage(`${BASE_URL}${data.imageUrl}`);
            }

            setOriginalOccasion({
               name: data.name,
               image: data.imageUrl,
            });
         } catch (error) {
            console.log(error);
            alert("Failed to load occasion");
         } finally {
            setLoading(false);
         }
      }

      getOccasion();
   }, [occasionId]);

   // Image
   const handleFileChange = (e) => {
      const file = Array.from(e.target.files)?.[0];

      if (!file) return;

      setNewImage(file);
   };

   const previewImage = useMemo(() => {
      if (!newImage) return null;
      return URL.createObjectURL(newImage);
   }, [newImage]);

   // Cleanup Preview URL
   useEffect(() => {
      return () => {
         if (previewImage) {
            URL.revokeObjectURL(previewImage);
         }
      };
   }, [previewImage]);

   const removeNewImage = (_) => {
      setNewImage(null);

      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   // Form
   async function handleFormSubmit(e) {
      e.preventDefault();
      setLoading(true);
      try {
         const formData = new FormData();

         formData.append("name", name);

         if (newImage) {
            formData.append("image", newImage);
         }

         await api.put("occasions/" + occasionId, formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         setOriginalOccasion({
            name,
            image: previewImage || existingImage,
         });

         if (previewImage) {
            setExistingImage(previewImage);
         }

         setNewImage(null);

         setError("");

         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }

         alert("Occasion updated successfully ✅");
      } catch (error) {
         setError(error?.response?.data?.message);
      } finally {
         setLoading(false);
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
                  <span className="text-indigo-600 font-bold">Update</span>
               </nav>
               <h2 className="text-on-surface">Update Occasion</h2>
               <p className="page-subtitle mt-1">
                  Update occasion information and image.
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
                  <label className="block text-on-surface-variant mb-2">
                     Occasion Name
                  </label>
                  <input
                     className="w-full pl-10 pr-stack-4 py-3 bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20  transition-all placeholder:text-outline"
                     placeholder="e.g. Premium Wireless Headphones"
                     type="text"
                     name="name"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
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
                  <div className="flex gap-5 mt-4 flex-wrap">
                     {existingImage ? (
                        <div className="">
                           <p className="mb-2">Current Image:</p>
                           <img
                              src={existingImage}
                              alt="category"
                              className="aspect-[6/7] max-h-60 object-cover rounded-lg border border-outline-variant"
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
                              className="aspect-[6/7] max-h-60 object-cover rounded-lg border border-outline-variant"
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
                     disabled={!isOccasionChanged || loading}
                     className={`px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2
                  ${
                     !isOccasionChanged || loading
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  >
                     <SaveIcon className="!text-sm" />
                     {loading ? "Saving..." : "Save Occasion"}
                  </button>
               </div>
            </div>
         </form>
      </>
   );
};

export default UpdateOccasion;
