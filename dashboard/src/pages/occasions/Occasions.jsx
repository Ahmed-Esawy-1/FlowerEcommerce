import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";

import api from "../../api/axios";
import { BASE_URL } from "../../api/config";

import DeletedModal from "./DeletedModal";

import InventoryIcon from "@mui/icons-material/Inventory";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CategoryIcon from "@mui/icons-material/Category";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EventIcon from "@mui/icons-material/Event";
import CollectionCard from "../../components/CollectionCard";

const OCCASIONS_PER_PAGE = 6;
const MAX_VISIBLE_PAGES = 4;

const Occasions = () => {
   const [allOccasions, setAllOccasions] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [searchInput, setSearchInput] = useState("");
   const [searchQuery, setSearchQuery] = useState("");

   const [openDeletedModal, setOpenDeletedModal] = useState(false);
   const [deleteOccasion, setDeleteOccasion] = useState(null);

   // Fetch Occasions
   useEffect(() => {
      async function getOccasions() {
         try {
            setLoading(true);

            const { data } = await api.get("occasions");

            setAllOccasions(data);
         } catch (error) {
            console.log(error);
         } finally {
            setLoading(false);
         }
      }

      getOccasions();
   }, []);

   // Reset page when searching
   useEffect(() => {
      setCurrentPage(1);
   }, [searchQuery]);

   // Scroll on pagination
   useEffect(() => {
      window.scrollTo({
         top: 0,
         behavior: "smooth",
      });
   }, [currentPage]);

   // Filter occasions
   const filteredOccasions = useMemo(() => {
      if (!searchQuery.trim()) return allOccasions;

      return allOccasions.filter((occasion) =>
         occasion.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
   }, [allOccasions, searchQuery]);

   // Pagination
   const totalPages = Math.max(
      1,
      Math.ceil(filteredOccasions.length / OCCASIONS_PER_PAGE),
   );

   const currentOccasions = useMemo(() => {
      const startIndex = (currentPage - 1) * OCCASIONS_PER_PAGE;

      return filteredOccasions.slice(
         startIndex,
         startIndex + OCCASIONS_PER_PAGE,
      );
   }, [filteredOccasions, currentPage]);

   // Visible Pages
   const visiblePages = useMemo(() => {
      let startPage = Math.max(
         1,
         currentPage - Math.floor(MAX_VISIBLE_PAGES / 2),
      );

      let endPage = startPage + MAX_VISIBLE_PAGES - 1;

      if (endPage > totalPages) {
         endPage = totalPages;

         startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
      }

      return Array.from(
         {
            length: endPage - startPage + 1,
         },
         (_, i) => startPage + i,
      );
   }, [currentPage, totalPages]);

   // Display range
   const startIndex =
      filteredOccasions.length === 0
         ? 0
         : (currentPage - 1) * OCCASIONS_PER_PAGE + 1;

   const endIndex = Math.min(
      currentPage * OCCASIONS_PER_PAGE,
      filteredOccasions.length,
   );

   // Delete Occasion
   async function handleDeleteOccasion() {
      if (!deleteOccasion) return;

      try {
         await api.delete(`occasions/${deleteOccasion.id}`);

         setAllOccasions((prev) => {
            const updated = prev.filter(
               (occasion) => occasion.id !== deleteOccasion.id,
            );

            const newFilteredLength = searchQuery.trim()
               ? updated.filter((occasion) =>
                    occasion.name
                       .toLowerCase()
                       .includes(searchQuery.toLowerCase()),
                 ).length
               : updated.length;

            const newTotalPages = Math.max(
               1,
               Math.ceil(newFilteredLength / OCCASIONS_PER_PAGE),
            );

            if (currentPage > newTotalPages) {
               setCurrentPage(newTotalPages);
            }

            return updated;
         });

         setDeleteOccasion(null);
         setOpenDeletedModal(false);
      } catch (error) {
         console.log(error);
      }
   }

   return (
      <>
         {/* Header */}
         <section className="flex justify-between items-end">
            <div>
               <h2 className="page-title">Occasions Inventory</h2>

               <p className="page-subtitle">
                  Manage your occasions and update data.
               </p>
            </div>

            <Link
               to="/occasions/create-occasion"
               className="px-4 py-2 rounded-lg bg-primary text-on-primary-fixed hover:opacity-90 transition-all"
            >
               Create Occasion
            </Link>
         </section>

         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            {/* Total */}
            <div className="flex flex-col justify-between bg-surface-container border border-surface-variant p-8 rounded-xl h-40">
               <div className="flex justify-between items-start">
                  <span className="text-on-surface-variant uppercase tracking-widest">
                     Total Occasions
                  </span>

                  <div className="bg-primary-container/20 p-2 rounded-lg text-primary">
                     <EventIcon />
                  </div>
               </div>

               <div>
                  <div className="text-on-surface text-3xl font-bold">
                     {allOccasions.length}
                  </div>

                  <div className="text-primary mt-1">+2 added this month</div>
               </div>
            </div>

            {/* Active */}
            <div className="flex flex-col justify-between bg-surface-container border border-surface-variant p-8 rounded-xl h-40">
               <div className="flex justify-between items-start">
                  <span className="text-on-surface-variant uppercase tracking-widest">
                     Active Items
                  </span>

                  <div className="bg-secondary-container p-2 rounded-lg text-secondary">
                     <InventoryIcon />
                  </div>
               </div>

               <div>
                  <div className="text-on-surface text-3xl font-bold">
                     1,482
                  </div>

                  <div className="text-on-surface-variant mt-1">
                     Across all departments
                  </div>
               </div>
            </div>

            {/* Growth */}
            <div className="flex flex-col justify-between bg-surface-container border border-surface-variant p-8 rounded-xl h-40">
               <div className="flex justify-between items-start">
                  <span className="text-on-surface-variant uppercase tracking-widest">
                     Growth Rate
                  </span>

                  <div className="bg-tertiary-container/20 p-2 rounded-lg text-tertiary">
                     <TrendingUpIcon />
                  </div>
               </div>

               <div>
                  <div className="text-on-surface text-3xl font-bold">
                     12.4%
                  </div>

                  <div className="mt-1 text-on-surface-variant">
                     Steady increase in SKU volume
                  </div>
               </div>
            </div>
         </div>

         {/* Loading */}
         {loading ? (
            <div className="flex justify-center items-center py-20">
               <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
         ) : filteredOccasions.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center py-20 gap-2 text-on-surface-variant">
               <CategoryIcon fontSize="large" />

               <p>
                  No occasions found
                  {searchQuery ? ` for "${searchQuery.toLowerCase()}"` : ""}.
               </p>

               {searchQuery && (
                  <button
                     onClick={() => {
                        setSearchQuery("");
                        setCurrentPage(1);
                     }}
                     className="text-primary underline text-sm"
                  >
                     Clear filter
                  </button>
               )}
            </div>
         ) : (
            <>
               {/* Filter Bar */}
               <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                  <div className="flex gap-2 w-full md:max-w-md">
                     <div className="relative flex-1">
                        <FilterAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant !text-sm" />

                        <input
                           type="text"
                           placeholder="Filter by name..."
                           value={searchInput}
                           onChange={(e) => setSearchInput(e.target.value)}
                           onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                 setSearchQuery(searchInput);
                              }
                           }}
                           className="w-full bg-surface-container-lowest outline-none border border-surface-variant focus:border-primary rounded-xl py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
                        />
                     </div>

                     <button
                        disabled={searchInput == ""}
                        onClick={() => setSearchQuery(searchInput)}
                        className={`${searchInput == "" ? "bg-gray-400 cursor-not-allowed" : "bg-primary text-on-primary hover:opacity-90"} px-5 py-2 rounded-xl  transition-all`}
                     >
                        Search
                     </button>
                  </div>

                  <div className="text-body-sm text-on-surface-variant">
                     Showing{" "}
                     <span className="text-on-surface font-semibold">
                        {startIndex}–{endIndex}
                     </span>{" "}
                     of{" "}
                     <span className="text-on-surface font-semibold">
                        {filteredOccasions.length}
                     </span>{" "}
                     {searchQuery ? "results" : "occasions"}
                  </div>
               </div>

               {/* Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentOccasions.map((occasion) => (
                     <CollectionCard
                        data={occasion}
                        fallbackIcon={EventIcon}
                        key={occasion.id}
                     />
                  ))}
               </div>

               {/* Pagination */}
               {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-surface-variant">
                     <div className="flex items-center gap-2">
                        {/* Previous */}
                        <button
                           onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                           }
                           disabled={currentPage === 1}
                           className="flex items-center gap-1 px-4 py-2 bg-surface-container hover:bg-surface-variant border border-surface-variant rounded-lg text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           <ChevronLeftIcon />
                           <span>Previous</span>
                        </button>

                        {/* Pages */}
                        <div className="flex items-center gap-1">
                           {visiblePages.map((page) => (
                              <button
                                 key={page}
                                 onClick={() => setCurrentPage(page)}
                                 className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
                                    page === currentPage
                                       ? "bg-primary text-on-primary"
                                       : "bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-on-surface"
                                 }`}
                              >
                                 {page}
                              </button>
                           ))}
                        </div>

                        {/* Next */}
                        <button
                           onClick={() =>
                              setCurrentPage((p) => Math.min(totalPages, p + 1))
                           }
                           disabled={currentPage === totalPages}
                           className="flex items-center gap-1 px-4 py-2 bg-surface-container hover:bg-surface-variant border border-surface-variant rounded-lg text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           <span>Next</span>

                           <ChevronRightIcon />
                        </button>
                     </div>

                     <div className="text-on-surface-variant">
                        Page {currentPage} of {totalPages}
                     </div>
                  </div>
               )}
            </>
         )}

         {/* Delete Modal */}
         {openDeletedModal && deleteOccasion && (
            <DeletedModal
               isOpen={openDeletedModal}
               productName={deleteOccasion.name}
               onClose={() => {
                  setOpenDeletedModal(false);
                  setDeleteOccasion(null);
               }}
               onConfirm={handleDeleteOccasion}
            />
         )}
      </>
   );
};

export default Occasions;
