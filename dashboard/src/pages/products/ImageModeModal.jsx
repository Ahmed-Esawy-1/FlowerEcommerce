import WarningAmberIcon from "@mui/icons-material/WarningAmber";


const ImageModeModal = ({
   isOpen,
   targetMode,
   itemCount,
   onClose,
   onConfirm,
}) => {
   if (!isOpen) return null;

   const switchingTo =
      targetMode === "color" ? "color variants" : "general images";
   const losing =
      targetMode === "color"
         ? `${itemCount} general image${itemCount !== 1 ? "s" : ""}`
         : `${itemCount} color variant${itemCount !== 1 ? "s" : ""} and their images`;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
         <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg w-full max-w-md p-6">
            {/* Body */}
            <div className="flex items-start gap-3">
               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                  <WarningAmberIcon className="text-error !text-xl" />
               </div>
               <div>
                  <h3 className="text-on-surface font-semibold text-base">
                     Switch to {switchingTo}?
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1.5">
                     You have <strong>{losing}</strong> set up. Switching modes
                     will clear {itemCount > 1 ? "them" : "it"} — this can't be
                     undone once you save.
                  </p>
               </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
               <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors"
               >
                  Keep current mode
               </button>
               <button
                  type="button"
                  onClick={onConfirm}
                  className="px-4 py-2 text-sm font-semibold text-white bg-error rounded-lg hover:opacity-90 transition-colors"
               >
                  Switch &amp; clear
               </button>
            </div>
         </div>
      </div>
   );
};

export default ImageModeModal;
