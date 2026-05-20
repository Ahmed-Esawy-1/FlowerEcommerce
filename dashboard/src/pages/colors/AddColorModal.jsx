import { useEffect, useMemo, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

const DEFAULT_COLOR = "#8b2040";

const AddColorModal = ({ open, onClose, onSave, editData = null }) => {
   const [color, setColor] = useState({
      name: "",
      hexCode: DEFAULT_COLOR,
   });
   const [error, setError] = useState("");

   // Add Or Save
   useEffect(() => {
      if (editData) {
         setColor({
            name: editData.name || "",
            hexCode: editData.hexCode || DEFAULT_COLOR,
         });
      } else {
         resetForm();
      }

      setError("");
   }, [editData, open]);

   // reset State if Add
   function resetForm() {
      setColor({
         name: "",
         hexCode: DEFAULT_COLOR,
      });
   }

   const isValidHex = useMemo(() => {
      return /^#[0-9A-Fa-f]{6}$/.test(color.hexCode);
   }, [color.hexCode]);

   // input Change Values
   function handleInputChange(e) {
      const { name, value } = e.target;
      setColor((prev) => ({
         ...prev,
         [name]: value,
      }));
      setError("");
   }

   // Submit Form
   async function handleSubmit(e) {
      e.preventDefault();

      if (!color.name.trim()) {
         setError("Color name is required");
         return;
      }

      if (!isValidHex) {
         setError("Please enter a valid hex color");
         return;
      }

      await onSave(color);
      setColor({
         name: "",
         hexCode: DEFAULT_COLOR,
      });
   }

   function handleClose() {
      resetForm();
      setError("");
      onClose();
   }

   if (!open) return null;

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
                        {color.name || "Color Name"}
                     </h3>
                     <p className="text-sm text-on-surface-variant">
                        {color.hexCode}
                     </p>
                  </div>
               </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
               <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-on-surface">
                     Color Name
                  </label>
                  <input
                     type="text"
                     name="name"
                     placeholder="e.g. Caramel"
                     value={color.name}
                     onChange={handleInputChange}
                     className="h-12 px-4 rounded-xl border border-outline bg-surface-container-lowest outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
               </div>

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
                        className={`flex-1 h-12 px-4 rounded-xl border bg-surface-container-lowest outline-none transition-all border-outline focus:border-primary`}
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
               </div>

               {/* Error */}
               {error && (
                  <div className="px-4 py-3 rounded-xl bg-error-container text-on-error-container text-sm border border-red-100">
                     {error}
                  </div>
               )}

               {/* Actions */}
               <div className="flex gap-3 pt-2">
                  <button
                     type="reset"
                     onClick={handleClose}
                     className="flex-1 h-12 rounded-xl border border-outline hover:bg-surface-container transition-colors"
                  >
                     Cancel
                  </button>

                  <button
                     type="submit"
                     className="flex-1 h-12 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
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

export default AddColorModal;
