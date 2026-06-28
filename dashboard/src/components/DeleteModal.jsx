export default function DeletedModal({
   isOpen,
   onClose,
   onConfirm,
   name,
   mode = "soft", // "soft" | "hard"
}) {
   if (!isOpen) return null;

   const isSoft = mode === "soft";

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
         <div className="m-5.5 md:m-0 w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
            {/* Icon */}
            <div
               className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isSoft ? "bg-amber-100" : "bg-red-100"}`}
            >
               {isSoft ? (
                  <svg
                     className="w-6 h-6 text-amber-600"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                     />
                  </svg>
               ) : (
                  <svg
                     className="w-6 h-6 text-red-600"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                     />
                  </svg>
               )}
            </div>

            <h2 className="text-lg font-semibold">
               {isSoft ? "Move to Trash" : "Permanently Delete"}
            </h2>

            <p className="mt-2 text-sm text-on-surface-variant">
               Are you sure you want to {isSoft ? "move" : "permanently delete"}{" "}
               <span className="font-medium text-base text-on-surface">
                  {name || "them"}
               </span>
               {"? "}
               {isSoft
                  ? `You can restore ${name ? "it" : "them"} from Trash anytime.`
                  : "This action cannot be undone and all data will be lost forever."}
            </p>

            <div className="mt-6 flex justify-end gap-3">
               <button
                  onClick={onClose}
                  className="px-4 py-2 hover:bg-surface-container border border-surface-variant rounded-lg text-on-surface text-sm font-medium transition-colors"
               >
                  Cancel
               </button>
               <button
                  onClick={onConfirm}
                  className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors border border-surface-variant
                     ${
                        isSoft
                           ? "bg-amber-500 hover:bg-amber-600"
                           : "bg-red-600 hover:bg-red-700"
                     }`}
               >
                  {isSoft ? "Move to Trash" : "Delete Forever"}
               </button>
            </div>
         </div>
      </div>
   );
}
