import React, { useState, useEffect, useRef, useMemo } from "react";
import api from "@/api/axios";
import { BASE_URL } from "@/api/config";
import { toast } from "sonner";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

const CollectionFormModal = ({
   isOpen,
   onClose,
   onSuccess,
   type, // category | occasion
   editData, // Data | null => Create
}) => {
   const fileInputRef = useRef(null);

   const isEditMode = Boolean(editData);
   const endpoint = type === "category" ? "categories" : "occasions";
   const label = type === "category" ? "Category" : "Occasion";

   // Form State
   const [nameEn, setNameEn] = useState("");
   const [nameAr, setNameAr] = useState("");
   const [existingImage, setExistingImage] = useState(null); // On Edit Mode
   const [newImage, setNewImage] = useState(null);
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState(null);

   const [original, setOriginal] = useState(null);

   // Submit Button Disabled
   const isSubmitDisabled = useMemo(() => {
      if (loading) return true;

      // Create mode
      if (!isEditMode) {
         return nameEn.trim() === "" || nameAr.trim() === "";
      }

      // Edit mode
      if (!original) return false;

      return (
         nameEn === original.nameEn && nameAr === original.nameAr && !newImage
      );
   }, [loading, isEditMode, original, nameEn, nameAr, newImage]);

   // Fetch Data When Opening On Edit Mode && Make All Empty in Create Mode
   useEffect(() => {
      if (!isOpen) return;

      if (isEditMode) {
         setLoading(true);
         try {
            setNameEn(editData.nameEn ?? "");
            setNameAr(editData.nameAr ?? "");
            setExistingImage(`${BASE_URL}${editData.imageUrl}`);
            setOriginal({
               nameEn: editData.nameEn,
               nameAr: editData.nameAr,
               image: editData.imageUrl,
            });
            setNewImage(null);
            setErrors({});
         } catch (err) {
         } finally {
            setLoading(false);
         }
      } else {
         setNameEn("");
         setNameAr("");
         setExistingImage(null);
         setNewImage(null);
         setErrors({});
         setOriginal(null);
      }
   }, [isOpen, editData]);

   // Make Blob URL and Cleanup It
   const previewImage = useMemo(
      () => (newImage ? URL.createObjectURL(newImage) : null),
      [newImage],
   );

   useEffect(() => {
      return () => {
         if (previewImage) URL.revokeObjectURL(previewImage);
      };
   }, [previewImage]);

   // -- Handlers -----------------------------------------------------------------
   // Image Change
   const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (file) setNewImage(file);
   };

   // Remove Image
   const removeNewImage = () => {
      setNewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
   };

   // Validate
   const validate = () => {
      const newErrors = {};
      if (!nameEn.trim()) newErrors.nameEn = `${label} name (EN) is required`;
      if (!nameAr.trim()) newErrors.nameAr = `${label} name (Ar) is required`;
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   // Submit
   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validate()) return;

      setLoading(true);
      try {
         const formData = new FormData();
         formData.append("nameEn", nameEn);
         formData.append("nameAr", nameAr);
         if (newImage) formData.append("image", newImage);

         const config = { headers: { "Content-Type": "multipart/form-data" } };
         let saved;

         if (isEditMode) {
            // Update
            const { data } = await api.put(
               `${endpoint}/${editData.id}`,
               formData,
               config,
            );
            saved = data;
         } else {
            // Create
            const { data } = await api.post(endpoint, formData, config);
            saved = data;
         }

         onSuccess(saved, isEditMode ? "update" : "create");
         handleClose();
      } catch (err) {
         toast.error(err?.response?.data?.message || "Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   const handleClose = () => {
      if (loading) return;
      onClose();
   };

   // Backdrop click
   const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) handleClose();
   };

   if (!isOpen) return null;

   return (
      // Backdrop
      <div
         className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
         }}
         onClick={handleBackdropClick}
      >
         <div className="relative w-full max-w-lg bg-surface-container rounded-2xl shadow-2xl border border-outline-variant overflow-hidden">
            {/* Header  */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
               <div>
                  <h2 className="text-on-surface text-lg font-semibold">
                     {isEditMode ? `Update ${label}` : `Create ${label}`}
                  </h2>
                  <p className="text-on-surface-variant text-sm mt-0.5">
                     {isEditMode
                        ? `Edit ${label.toLowerCase()} details and image.`
                        : `Fill in the ${label.toLowerCase()} details below.`}
                  </p>
               </div>
               <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors"
               >
                  <CloseIcon fontSize="small" />
               </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
               {loading && isEditMode && !original ? (
                  <div className="flex justify-center py-8">
                     <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
               ) : (
                  <>
                     {/* Name EN */}
                     <div>
                        <label className="block text-on-surface-variant text-sm mb-1.5 font-medium">
                           Name <span className="text-outline">(English)</span>
                           <span className="text-error ml-0.5">*</span>
                        </label>
                        <input
                           type="text"
                           value={nameEn}
                           onChange={(e) => setNameEn(e.target.value)}
                           placeholder={`e.g. ${type === "category" ? "FLowers" : "Birthday"}`}
                           dir="ltr"
                           className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant focus:border-primary rounded-xl text-on-surface outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline text-sm"
                        />
                        {errors && errors.nameEn && (
                           <p className="text-error text-xs mt-1">
                              {errors.nameEn}
                           </p>
                        )}
                     </div>

                     {/* Name AR */}
                     <div>
                        <label className="block text-on-surface-variant text-sm mb-1.5 font-medium">
                           الاسم <span className="text-outline">(عربي)</span>
                        </label>
                        <input
                           type="text"
                           value={nameAr}
                           onChange={(e) => setNameAr(e.target.value)}
                           placeholder={`مثال: ${type === "category" ? "ورود" : "عيد ميلاد"}`}
                           dir="rtl"
                           lang="ar"
                           className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant focus:border-primary rounded-xl text-on-surface outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline text-sm"
                        />
                        {errors && errors.nameAr && (
                           <p className="text-error text-xs mt-1">
                              {errors.nameAr}
                           </p>
                        )}
                     </div>

                     {/* Image Upload */}
                     <div>
                        <label className="block text-on-surface-variant text-sm mb-1.5 font-medium">
                           Image
                        </label>
                        <input
                           ref={fileInputRef}
                           type="file"
                           accept="image/*"
                           onChange={handleFileChange}
                           className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant focus:border-primary rounded-xl text-on-surface outline-none text-sm transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:text-xs file:font-medium file:cursor-pointer cursor-pointer"
                        />

                        {/* Image Previews */}
                        {(existingImage || previewImage) && (
                           <div className="flex gap-4 mt-3 flex-wrap">
                              {existingImage && (
                                 <div className="flex flex-col gap-1">
                                    <span className="text-xs text-on-surface-variant">
                                       Current
                                    </span>
                                    <img
                                       src={existingImage}
                                       alt="current"
                                       className="w-24 h-24 object-cover rounded-xl border border-outline-variant"
                                    />
                                 </div>
                              )}
                              {previewImage && (
                                 <div className="flex flex-col gap-1">
                                    <span className="text-xs text-on-surface-variant">
                                       New
                                    </span>
                                    <div className="relative w-24 h-24">
                                       <img
                                          src={previewImage}
                                          alt="preview"
                                          className="w-full h-full object-cover rounded-xl border-2 border-primary"
                                       />
                                       <button
                                          type="button"
                                          onClick={removeNewImage}
                                          className="w-7 h-7 absolute -top-2 -right-2 bg-error text-white rounded-full p-0.5 shadow-md"
                                       >
                                          <CloseIcon style={{ fontSize: 14 }} />
                                       </button>
                                    </div>
                                 </div>
                              )}
                           </div>
                        )}
                     </div>

                     {/* Buttons */}
                     <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant">
                        <button
                           type="button"
                           onClick={handleClose}
                           disabled={loading}
                           className="px-5 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-variant text-sm transition-colors"
                        >
                           Cancel
                        </button>
                        <button
                           type="submit"
                           disabled={isSubmitDisabled}
                           className={`px-5 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2 transition-all
                           ${
                              isSubmitDisabled
                                 ? "bg-outline cursor-not-allowed opacity-60"
                                 : "bg-primary hover:bg-primary/90 shadow-sm"
                           }`}
                        >
                           <SaveIcon style={{ fontSize: 16 }} />
                           {loading
                              ? "Saving…"
                              : isEditMode
                                ? `Update ${label}`
                                : `Save ${label}`}
                        </button>
                     </div>
                  </>
               )}
            </form>
         </div>
      </div>
   );
};

export default CollectionFormModal;
