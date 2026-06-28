import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import api from "@/api/axios";
import Loading from "@/components/Loading";
import CollectionCard from "@/components/CollectionCard";
import DeletedModal from "@/components/DeleteModal";
import Pagination from "@/components/Pagination";
import PageHeader from "@/components/PageHeader";
import CollectionFormModal from "@/components/CollectionFormModal";

import CategoryIcon from "@mui/icons-material/Category";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const ITEMS_PER_PAGE = 6;
const MAX_VISIBLE_PAGES = 4;

const Categories = () => {
   const [categories, setCategories] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState(false);

   const [searchInput, setSearchInput] = useState("");
   const [searchQuery, setSearchQuery] = useState("");

   // Form Modal
   const [formModalOpen, setFormModalOpen] = useState(false);
   const [editCategory, setEditCategory] = useState(null); // null => create mode

   // Delete Modal
   const [openDeleteModal, setOpenDeleteModal] = useState(false);
   const [deleteCategory, setDeleteCategory] = useState(null);

   // Fetch Categories
   useEffect(() => {
      async function getCategories() {
         try {
            setLoading(true);
            const { data } = await api.get("categories");
            setCategories(data);
         } catch (error) {
            console.log(error);
         } finally {
            setLoading(false);
         }
      }
      getCategories();
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
   const filteredCategories = useMemo(() => {
      if (!searchQuery.trim()) return categories;
      return categories.filter(
         (c) =>
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.nameAr?.includes(searchQuery),
      );
   }, [categories, searchQuery]);

   // Pagination
   const currentItems = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
   }, [filteredCategories, currentPage]);

   const startIndex =
      filteredCategories.length === 0
         ? 0
         : (currentPage - 1) * ITEMS_PER_PAGE + 1;
   const endIndex = Math.min(
      currentPage * ITEMS_PER_PAGE,
      filteredCategories.length,
   );

   // Open Create Modal
   const handleOpenCreate = () => {
      setEditCategory(null);
      setFormModalOpen(true);
   };

   // Open Edit Modal
   const handleOpenEdit = (category) => {
      setEditCategory(category);
      setFormModalOpen(true);
   };

   // Form on Success
   const handleFormSuccess = (saved, mode) => {
      if (mode === "create") {
         setCategories((prev) => [saved, ...prev]);
         toast.success("Category created successfully");
      } else {
         setCategories((prev) =>
            prev.map((c) => (c.id === saved.id ? { ...c, ...saved } : c)),
         );
         toast.success("Category updated successfully");
      }
   };

   // Delete Category
   async function handleDeleteCategory() {
      if (!deleteCategory) return;
      try {
         await api.delete(`categories/${deleteCategory.id}`);

         setCategories((prev) => {
            const updated = prev.filter((c) => c.id !== deleteCategory.id);

            const newFilteredLen = searchQuery.trim()
               ? updated.filter(
                    (c) =>
                       c.name
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                       c.nameEn
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                 ).length
               : updated.length;

            const newTotalPages = Math.max(
               1,
               Math.ceil(newFilteredLen / ITEMS_PER_PAGE),
            );
            if (currentPage > newTotalPages) setCurrentPage(newTotalPages);

            return updated;
         });

         setDeleteCategory(null);
         setOpenDeleteModal(false);
         toast.success("Category deleted successfully");
      } catch (error) {
         console.log(error);
         toast.error("Failed to delete category");
      }
   }

   return (
      <>
         {/* Header */}
         <PageHeader
            title="Categories Inventory"
            subtitle="Manage your categories and update data."
         >
            <div className="flex gap-2">
               <Link
                  to="/categories/trash"
                  className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all"
               >
                  Trash
               </Link>
               <button
                  onClick={handleOpenCreate}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary-fixed hover:opacity-90 transition-all"
               >
                  Create Category
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
                        {filteredCategories.length}
                     </span>{" "}
                     {searchQuery ? "results" : "categories"}
                  </div>
               </div>

               {/* Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {currentItems.map((category) => (
                     <CollectionCard
                        key={category.id}
                        data={category}
                        fallbackIcon={CategoryIcon}
                        type="category"
                        setDeletedata={setDeleteCategory}
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
                  totalItems={filteredCategories.length}
                  loading={loading}
               />
            </>
         )}

         {/* Create / Update Modal */}
         <CollectionFormModal
            isOpen={formModalOpen}
            onClose={() => setFormModalOpen(false)}
            onSuccess={handleFormSuccess}
            type="category"
            editData={editCategory}
         />

         {/* Delete Modal */}
         {openDeleteModal && deleteCategory && (
            <DeletedModal
               isOpen={openDeleteModal}
               name={deleteCategory.name ?? deleteCategory.nameEn}
               onClose={() => {
                  setOpenDeleteModal(false);
                  setDeleteCategory(null);
               }}
               status="trash"
               onConfirm={handleDeleteCategory}
            />
         )}
      </>
   );
};

export default Categories;
