import { useEffect, useMemo, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

const DEFAULT_COLOR = "#8b2040";

const ColorFormModal = ({
   isOpen,
   onClose,
   onSaved,
   editData = null, // Data | null => Create
}) => {
   const [color, setColor] = useState({
      nameEn: "",
      nameAr: "",
      hexCode: DEFAULT_COLOR,
   });
   const [errors, setErrors] = useState(null);

   // Input Data Based on Create | Edit Mode
   useEffect(() => {
      if (editData) {
         setColor({
            nameEn: editData.nameEn || "",
            nameAr: editData.nameAr || "",
            hexCode: editData.hexCode || DEFAULT_COLOR,
         });
      } else {
         resetForm();
      }

      setErrors(null);
   }, [editData, isOpen]);

   // Reset State if Create Mode
   function resetForm() {
      setColor({
         nameEn: "",
         nameAr: "",
         hexCode: DEFAULT_COLOR,
      });
   }

   // ---- Validation ---------------------------------------------

   const isValidHex = useMemo(() => {
      return /^#[0-9A-Fa-f]{6}$/.test(color.hexCode);
   }, [color.hexCode]);

   function validate() {
      const newErrors = {};

      if (!color.nameEn.trim()) {
         newErrors.nameEn = "English name is required.";
      }

      if (!color.nameAr.trim()) {
         newErrors.nameAr = "Arabic name is required.";
      }

      if (!isValidHex) {
         newErrors.hexCode = "Please enter a valid hex color (e.g. #FF0000).";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   }

   // ---- Disabled Button --------------------------------------------------------

   const isUnchanged = useMemo(() => {
      if (!editData) return false;
      return (
         color.nameEn === (editData.nameEn || "") &&
         color.nameAr === (editData.nameAr || "") &&
         color.hexCode === (editData.hexCode || DEFAULT_COLOR)
      );
   }, [color, editData]);

   const isDisabled = useMemo(() => {
      const fieldsInvalid =
         color.nameEn.trim().length === 0 ||
         color.nameAr.trim().length === 0 ||
         !isValidHex;

      return fieldsInvalid || isUnchanged;
   }, [color.nameEn, color.nameAr, isValidHex, isUnchanged]);

   // Handle Input Change
   function handleInputChange(e) {
      const { name, value } = e.target;
      setColor((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => (prev ? { ...prev, [name]: undefined } : null));
   }

   // Submit Form
   async function handleSubmit(e) {
      e.preventDefault();

      if (!validate()) return;

      try {
         await onSaved(color);
         resetForm();
         onClose();
      } catch (err) {
         console.error(err);
      }
   }

   // Close Modal
   function handleClose() {
      resetForm();
      setErrors(null);
      onClose();
   }

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
         <div className="w-full max-w-md rounded-3xl border border-outline bg-surface-container-low shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline bg-surface-container-low">
               <div>
                  <h2 className="text-xl font-semibold text-on-surface">
                     {editData ? "Edit Color" : "Add New Color"}
                  </h2>
                  <p className="text-sm text-on-surface-variant mt-1">
                     Customize product color options
                  </p>
               </div>

               <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors"
               >
                  <CloseIcon className="!text-lg text-on-surface-variant" />
               </button>
            </div>

            {/* Preview */}
            <div className="relative overflow-hidden rounded-2xl border border-outline bg-surface-container-lowest p-5 m-6 mb-2">
               <div
                  className="absolute inset-0 opacity-5 blur-2xl"
                  style={{ background: color.hexCode }}
               />
               <div className="relative flex items-center gap-4">
                  <div
                     className="w-16 h-16 rounded-2xl border border-white shadow-md"
                     style={{
                        background: isValidHex ? color.hexCode : DEFAULT_COLOR,
                     }}
                  />
                  <div>
                     <h3 className="font-semibold text-on-surface text-lg">
                        {color.nameEn || "Color Name"}
                     </h3>
                     <p className="text-sm text-on-surface-variant">
                        {color.hexCode}
                     </p>
                  </div>
               </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
               {/* English Name */}
               <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-on-surface">
                     Name (English)
                  </label>
                  <input
                     type="text"
                     name="nameEn"
                     placeholder="e.g. Caramel"
                     value={color.nameEn}
                     onChange={handleInputChange}
                     className="h-12 px-4 rounded-xl border border-outline bg-surface-container-lowest outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  {errors?.nameEn && (
                     <p className="text-error text-xs mt-1">{errors.nameEn}</p>
                  )}
               </div>

               {/* Arabic Name */}
               <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-on-surface">
                     Name (Arabic)
                  </label>
                  <input
                     type="text"
                     name="nameAr"
                     placeholder="e.g. كراميل"
                     dir="rtl"
                     value={color.nameAr}
                     onChange={handleInputChange}
                     className="h-12 px-4 rounded-xl border border-outline bg-surface-container-lowest outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  {errors?.nameAr && (
                     <p className="text-error text-xs mt-1">{errors.nameAr}</p>
                  )}
               </div>

               {/* Hex Code */}
               <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-on-surface">
                     Hex Color
                  </label>
                  <div className="flex gap-3">
                     <input
                        type="text"
                        name="hexCode"
                        value={color.hexCode}
                        maxLength={7}
                        onChange={handleInputChange}
                        placeholder="#000000"
                        className="flex-1 h-12 px-4 rounded-xl border bg-surface-container-lowest outline-none transition-all border-outline focus:border-primary"
                     />

                     <label
                        className="w-12 h-12 rounded-xl overflow-hidden border border-outline cursor-pointer shadow-sm"
                        style={{
                           background: isValidHex
                              ? color.hexCode
                              : DEFAULT_COLOR,
                        }}
                     >
                        <input
                           type="color"
                           name="hexCode"
                           value={isValidHex ? color.hexCode : DEFAULT_COLOR}
                           onChange={handleInputChange}
                           className="opacity-0 w-full h-full cursor-pointer"
                        />
                     </label>
                  </div>
                  {errors?.hexCode && (
                     <p className="text-error text-xs mt-1">{errors.hexCode}</p>
                  )}
               </div>

               {/* Actions */}
               <div className="flex gap-3 pt-2">
                  <button
                     type="button"
                     onClick={handleClose}
                     className="flex-1 h-12 rounded-xl border border-outline hover:bg-surface-container transition-colors"
                  >
                     Cancel
                  </button>

                  <button
                     type="submit"
                     disabled={isDisabled}
                     className={`px-5 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2 transition-all
                        ${
                           isDisabled
                              ? "bg-outline cursor-not-allowed opacity-60"
                              : "bg-primary hover:bg-primary/90 shadow-sm"
                        }`}
                  >
                     <SaveIcon className="!text-sm" />
                     {editData ? "Update Color" : "Save Color"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default ColorFormModal;
