import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

import api from "../../api/axios";

import CollectionCard from "@/components/CollectionCard";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import DeletedModal from "@/components/DeleteModal";
import PageHeader from "@/components/PageHeader";
import CollectionFormModal from "@/components/CollectionFormModal";

import InventoryIcon from "@mui/icons-material/Inventory";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EventIcon from "@mui/icons-material/Event";
import { Link } from "react-router";

const ITEMS_PER_PAGE = 4;
const MAX_VISIBLE_PAGES = 6;

const Occasions = () => {
   const [allOccasions, setAllOccasions] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState(false);

   const [searchInput, setSearchInput] = useState("");
   const [searchQuery, setSearchQuery] = useState("");

   // Form Modal
   const [formModalOpen, setFormModalOpen] = useState(false);
   const [editOccasion, setEditOccasion] = useState(null); // null => Create Mode

   //  Delete Modal
   const [openDeleteModal, setOpenDeleteModal] = useState(false);
   const [deleteOccasion, setDeleteOccasion] = useState(null);

   useEffect(() => {
      console.log("Occasions => ", allOccasions);
   }, [allOccasions]);

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

   // Reset Page on Search
   useEffect(() => {
      setCurrentPage(1);
   }, [searchQuery]);

   // Scroll to Top When Page Change
   useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, [currentPage]);

   // Filter
   const filteredOccasions = useMemo(() => {
      if (!searchQuery.trim()) return allOccasions;
      return allOccasions.filter(
         (o) =>
            o.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.nameAr?.includes(searchQuery),
      );
   }, [allOccasions, searchQuery]);

   // Pagination
   const currentItems = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredOccasions.slice(start, start + ITEMS_PER_PAGE);
   }, [filteredOccasions, currentPage]);

   const startIndex =
      filteredOccasions.length === 0
         ? 0
         : (currentPage - 1) * ITEMS_PER_PAGE + 1;
   const endIndex = Math.min(
      currentPage * ITEMS_PER_PAGE,
      filteredOccasions.length,
   );

   // Open Create Modal
   const handleOpenCreate = () => {
      setEditOccasion(null);
      setFormModalOpen(true);
   };

   // Open Edit Modal
   const handleOpenEdit = (occasion) => {
      setEditOccasion(occasion);
      setFormModalOpen(true);
   };

   // Form Submit on Success
   const handleFormSuccess = (saved, mode) => {
      if (mode === "create") {
         setAllOccasions((prev) => [saved, ...prev]);
         toast.success("Occasion created successfully");
      } else {
         setAllOccasions((prev) =>
            prev.map((o) => (o.id === saved.id ? { ...o, ...saved } : o)),
         );
         toast.success("Occasion updated successfully");
      }
   };

   // Delete Occasion
   async function handleDeleteOccasion() {
      if (!deleteOccasion) return;
      try {
         await api.delete(`occasions/${deleteOccasion.id}`);
         setAllOccasions((prev) =>
            prev.filter((o) => o.id !== deleteOccasion.id),
         );
         setOpenDeleteModal(false);
         setDeleteOccasion(null);
         toast.success("Occasion deleted successfully");
      } catch (error) {
         console.log(error);
         toast.error("Failed to delete occasion");
      }
   }

   return (
      <>
         {/* Header */}
         <PageHeader
            title="Occasions Inventory"
            subtitle="Manage your occasions and update data."
         >
            <div className="flex gap-2">
               <Link
                  to="/occasions/trash"
                  className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all"
               >
                  Trash
               </Link>
               <button
                  onClick={handleOpenCreate}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary-fixed hover:opacity-90 transition-all"
               >
                  Create Occasion
               </button>
            </div>
         </PageHeader>

         {/* Content */}
         {loading ? (
            <Loading />
         ) : (
            <>
               {/* Filter */}
               <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
                  <div className="flex gap-2 w-full md:max-w-md">
                     <div className="relative flex-1">
                        <FilterAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant !text-sm" />
                        <input
                           type="text"
                           placeholder="Filter by name…"
                           value={searchInput}
                           onChange={(e) => {
                              setSearchInput(e.target.value);
                              setSearchQuery(e.target.value);
                           }}
                           className="w-full bg-surface-container-lowest outline-none border border-surface-variant focus:border-primary rounded-xl py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
                        />
                     </div>
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
                     occasions
                  </div>
               </div>

               {/* Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {currentItems.map((occasion) => (
                     <CollectionCard
                        key={occasion.id}
                        data={occasion}
                        fallbackIcon={EventIcon}
                        type="occasion"
                        setDeletedata={setDeleteOccasion}
                        setOpenDeletedModal={setOpenDeleteModal}
                        onEdit={handleOpenEdit}
                     />
                  ))}
               </div>

               {/* Pagination */}
               <Pagination
                  itemsPerPage={ITEMS_PER_PAGE}
                  maxVisiblePages={MAX_VISIBLE_PAGES}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalItems={filteredOccasions.length}
                  loading={loading}
               />
            </>
         )}

         {/* Create | Update Modal */}
         <CollectionFormModal
            isOpen={formModalOpen}
            onClose={() => setFormModalOpen(false)}
            onSuccess={handleFormSuccess}
            type="occasion"
            editData={editOccasion}
         />

         {/* Delete Modal */}
         {openDeleteModal && deleteOccasion && (
            <DeletedModal
               isOpen={openDeleteModal}
               name={deleteOccasion.name ?? deleteOccasion.nameEn}
               onClose={() => {
                  setOpenDeleteModal(false);
                  setDeleteOccasion(null);
               }}
               onConfirm={handleDeleteOccasion}
               status="soft"
            />
         )}
      </>
   );
};

export default Occasions;
