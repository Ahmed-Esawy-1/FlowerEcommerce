import React, { useMemo } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Pagination = ({
   itemsPerPage,
   maxVisiblePages,
   currentPage,
   setCurrentPage,
   totalItems,
   loading,
}) => {
   const totalPages = Math.ceil(totalItems / itemsPerPage);

   const visiblePages = useMemo(() => {
      let startPage = Math.max(
         1,
         currentPage - Math.floor(maxVisiblePages / 2),
      );

      let endPage = startPage + maxVisiblePages - 1;

      if (endPage > totalPages) {
         endPage = totalPages;
         startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      return Array.from(
         { length: endPage - startPage + 1 },
         (_, i) => startPage + i,
      );
   }, [currentPage, totalPages, maxVisiblePages]);

   if (loading || totalPages <= 1) return null;

   return (
      <div className="px-6 py-4 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
         <p className="text-sm text-on-surface-variant">
            Page {currentPage} of {totalPages}
         </p>

         <div className="flex items-center gap-1">
            {/* Previous */}
            <button
               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
               disabled={currentPage === 1}
               className="flex items-center gap-1 px-3 py-1.5 text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <ChevronLeftIcon fontSize="small" />
            </button>

            {/* First Page */}
            {visiblePages[0] > 1 && (
               <>
                  <button
                     onClick={() => setCurrentPage(1)}
                     className="w-8 h-8 flex items-center justify-center text-sm border border-outline-variant rounded hover:bg-surface-container-lowest transition-colors"
                  >
                     1
                  </button>

                  {visiblePages[0] > 2 && (
                     <span className="px-1 text-on-surface-variant">...</span>
                  )}
               </>
            )}

            {/* Visible Pages */}
            {visiblePages.map((page) => (
               <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                     currentPage === page
                        ? "bg-primary text-on-primary"
                        : "border border-outline-variant hover:bg-surface-container-lowest"
                  }`}
               >
                  {page}
               </button>
            ))}

            {/* Last Page */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
               <>
                  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                     <span className="px-1 text-on-surface-variant">...</span>
                  )}

                  <button
                     onClick={() => setCurrentPage(totalPages)}
                     className="w-8 h-8 flex items-center justify-center text-sm border border-outline-variant rounded hover:bg-surface-container-lowest transition-colors"
                  >
                     {totalPages}
                  </button>
               </>
            )}

            {/* Next */}
            <button
               onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
               }
               disabled={currentPage === totalPages}
               className="flex items-center gap-1 px-3 py-1.5 text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <ChevronRightIcon fontSize="small" />
            </button>
         </div>
      </div>
   );
};

export default Pagination;
