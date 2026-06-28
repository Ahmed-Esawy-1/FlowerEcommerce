import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import api from "../../api/axios";
import { BASE_URL } from "../../api/config";
import { toast } from "sonner";

import InventoryIcon from "@mui/icons-material/Inventory";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeletedModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";

const TABLE_HEADER = [
   "Product Name",
   "Category",
   "Description",
   "Price",
   "Actions",
];

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 4;

const Products = () => {
   const [allProducts, setAllProducts] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");

   // Single Delete
   const [openDeletedModal, setOpenDeletedModal] = useState(false);
   const [deleteProduct, setDeleteProduct] = useState(null);

   // Bulk Select
   const [selectedIds, setSelectedIds] = useState(new Set());
   const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
   const [bulkDeleting, setBulkDeleting] = useState(false);

   // Fetch Products
   useEffect(() => {
      async function getProducts() {
         try {
            setLoading(true);
            const { data } = await api.get("admin/products");
            setAllProducts(data);
         } catch (error) {
            console.log(error);
         } finally {
            setLoading(false);
         }
      }
      getProducts();
   }, []);

   // Reset to Page 1 When Search Changes
   useEffect(() => {
      setCurrentPage(1);
   }, [searchQuery]);

   // Filter Products by Search Query
   const filteredProducts = useMemo(() => {
      if (!searchQuery.trim()) return allProducts;
      return allProducts.filter((p) =>
         p.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
   }, [allProducts, searchQuery]);

   const currentProducts = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      return filteredProducts.slice(startIndex, endIndex);
   }, [filteredProducts, currentPage]);

   // Display Range
   const startIndex =
      filteredProducts.length === 0
         ? 0
         : (currentPage - 1) * ITEMS_PER_PAGE + 1;
   const endIndex = Math.min(
      currentPage * ITEMS_PER_PAGE,
      filteredProducts.length,
   );

   // Clear Selection when (page | search) Change
   useEffect(() => {
      setSelectedIds(new Set());
   }, [currentPage, searchQuery]);

   // --- Selection Helpers -----------------------------------------------------------
   const allOnPageSelected =
      currentProducts.length > 0 &&
      currentProducts.every((p) => selectedIds.has(p.id));
   const someOnPageSelected =
      currentProducts.some((p) => selectedIds.has(p.id)) && !allOnPageSelected;

   const toggleSelectAllOnPage = () => {
      setSelectedIds((prev) => {
         const next = new Set(prev);
         if (allOnPageSelected) {
            currentProducts.forEach((p) => next.delete(p.id));
         } else {
            currentProducts.forEach((p) => next.add(p.id));
         }
         return next;
      });
   };

   const toggleSelectOne = (id) => {
      setSelectedIds((prev) => {
         const next = new Set(prev);
         if (next.has(id)) next.delete(id);
         else next.add(id);
         return next;
      });
   };

   const clearSelection = () => setSelectedIds(new Set());

   // Delete Product (Single)
   async function handleDeleteProduct() {
      if (!deleteProduct) return;

      try {
         await api.delete(`admin/products/${deleteProduct.id}`);

         setAllProducts((prev) => {
            const updated = prev.filter((p) => p.id !== deleteProduct.id);

            const newFilteredLength = searchQuery.trim()
               ? updated.filter((p) =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
                 ).length
               : updated.length;

            const newTotalPages = Math.ceil(newFilteredLength / ITEMS_PER_PAGE);
            if (currentPage > newTotalPages) {
               setCurrentPage(newTotalPages || 1);
            }

            return updated;
         });

         setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(deleteProduct.id);
            return next;
         });

         toast.success(`${deleteProduct.title} is sent to trash successfully`);
      } catch (error) {
         toast.error(`${deleteProduct.title} is failed to sent to trash`);
      } finally {
         setDeleteProduct(null);
         setOpenDeletedModal(false);
      }
   }

   // Delete Products (Bulk)
   async function handleBulkDelete() {
      const ids = Array.from(selectedIds);
      console.log("ids => ", ids);
      if (ids.length === 0) return;

      setBulkDeleting(true);
      try {
         await api.delete("admin/products/bulk", { data: ids });

         setAllProducts((prev) => {
            const updated = prev.filter((p) => !selectedIds.has(p.id));

            const newFilteredLength = searchQuery.trim()
               ? updated.filter((p) =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
                 ).length
               : updated.length;

            const newTotalPages = Math.ceil(newFilteredLength / ITEMS_PER_PAGE);
            if (currentPage > newTotalPages) {
               setCurrentPage(newTotalPages || 1);
            }

            return updated;
         });

         toast.success(
            `${ids.length} product${ids.length > 1 ? "s" : ""} sent to trash`,
         );
         clearSelection();
      } catch (error) {
         toast.error("Failed to delete selected products");
      } finally {
         setBulkDeleting(false);
         setOpenBulkDeleteModal(false);
      }
   }

   return (
      <>
         {/* Header */}
         <section className="flex justify-between items-end mb-8">
            <div>
               <h2 className="page-title">Products Inventory</h2>
               <p className="page-subtitle">
                  Manage your enterprise catalog, track stock levels, and update
                  pricing.
               </p>
            </div>
            <div className="flex gap-2">
               <Link
                  to="/products/trash"
                  className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all"
               >
                  Trash
               </Link>

               <Link
                  to="/products/create-product"
                  className="px-4 py-2 bg-primary text-on-primary-fixed rounded-lg hover:opacity-90 transition-all"
               >
                  Create New Product
               </Link>
            </div>
         </section>

         <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            {/* Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 border-b border-outline-variant">
               <div className="relative w-full sm:w-64">
                  <FilterAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant !text-sm" />
                  <input
                     type="text"
                     placeholder="Search by product name..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 pr-4 py-2 w-full bg-surface-container-lowest outline-none border border-outline-variant focus:border-primary rounded-lg focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
                  />
               </div>

               <div className="flex items-center gap-2">
                  <span className="text-sm text-on-surface-variant mr-2">
                     {filteredProducts.length === 0
                        ? "No results"
                        : `${startIndex}–${endIndex} of ${filteredProducts.length} ${searchQuery.trim() ? "results" : "products"}`}
                  </span>
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                     <DownloadIcon />
                  </button>
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                     <PrintIcon />
                  </button>
               </div>
            </div>

            {/* Bulk action bar — only shows when something is selected */}
            {selectedIds.size > 0 && (
               <div className="flex items-center justify-between gap-4 bg-primary/10 px-4 py-3 border-b border-outline-variant">
                  <span className="text-sm font-medium text-on-surface">
                     {selectedIds.size} product{selectedIds.size > 1 ? "s" : ""}{" "}
                     selected
                  </span>
                  <div className="flex items-center gap-2">
                     <button
                        onClick={clearSelection}
                        className="px-3 py-1.5 text-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                     >
                        Clear
                     </button>
                     <button
                        onClick={() => setOpenBulkDeleteModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-error border border-error/30 hover:bg-error/10 rounded-lg transition-colors"
                     >
                        <DeleteIcon className="!text-sm" />
                        Delete Selected
                     </button>
                  </div>
               </div>
            )}

            {/* Loading */}
            {loading && (
               <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
               </div>
            )}

            {/* Table */}
            {!loading && (
               <div className="overflow-x-auto">
                  <table className="min-w-[850px] w-full text-left">
                     <thead>
                        <tr className="bg-surface-container-low text-left">
                           <th className="px-6 py-4 text-on-surface-variant border-b border-outline-variant">
                              <input
                                 className="text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                 type="checkbox"
                                 checked={allOnPageSelected}
                                 ref={(ele) => {
                                    if (ele)
                                       ele.indeterminate = someOnPageSelected;
                                 }}
                                 onChange={toggleSelectAllOnPage}
                                 disabled={currentProducts.length === 0}
                              />
                           </th>
                           {TABLE_HEADER.map((h) => (
                              <th
                                 key={h}
                                 className={`px-6 py-4 text-on-surface-variant border-b border-outline-variant ${
                                    h === "Actions" ? "text-right" : ""
                                 }`}
                              >
                                 {h}
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-outline-variant">
                        {currentProducts.length === 0 ? (
                           <tr>
                              <td
                                 colSpan={TABLE_HEADER.length + 1}
                                 className="px-6 py-16 text-center text-on-surface-variant"
                              >
                                 <InventoryIcon
                                    style={{ fontSize: 40, opacity: 0.3 }}
                                 />
                                 <p className="mt-3">No products found.</p>
                                 {searchQuery && (
                                    <button
                                       className="mt-2 text-primary underline text-sm"
                                       onClick={() => setSearchQuery("")}
                                    >
                                       Clear search
                                    </button>
                                 )}
                              </td>
                           </tr>
                        ) : (
                           currentProducts.map((product) => (
                              <tr
                                 className={`hover:bg-surface-container-low transition-colors ${
                                    selectedIds.has(product.id)
                                       ? "bg-primary/5"
                                       : ""
                                 }`}
                                 key={product.id}
                              >
                                 <td className="px-6 py-4">
                                    <input
                                       className="text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                       type="checkbox"
                                       checked={selectedIds.has(product.id)}
                                       onChange={() =>
                                          toggleSelectOne(product.id)
                                       }
                                    />
                                 </td>
                                 <td className="px-8 py-4">
                                    <div className="flex items-center gap-3">
                                       <img
                                          alt={`${product.title} Image`}
                                          className="w-10 h-10 object-cover border border-slate-200 rounded-lg"
                                          src={`${BASE_URL}${product.primaryImageUrl}`}
                                       />
                                       <div>
                                          <p className="text-on-surface text-sm font-semibold">
                                             {product.title}
                                          </p>
                                          {product.occasion && (
                                             <p className="text-on-surface-variant text-xs">
                                                {product?.occasion?.name}
                                             </p>
                                          )}
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    {product?.category?.name}
                                 </td>
                                 <td className="px-6 py-4">
                                    <p className="line-clamp-1">
                                       {product.description}
                                    </p>
                                 </td>
                                 <td className="px-6 py-4 text-on-surface text-sm font-semibold">
                                    ${product.price}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <Link
                                       to={`/products/update-product/${product.id}`}
                                       className="text-on-surface hover:text-primary transition-colors cursor-pointer"
                                    >
                                       <EditIcon />
                                    </Link>
                                    <button
                                       className="ml-2 text-on-surface hover:text-error transition-colors cursor-pointer"
                                       onClick={() => {
                                          setDeleteProduct(product);
                                          setOpenDeletedModal(true);
                                       }}
                                    >
                                       <DeleteIcon />
                                    </button>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            )}

            {/* Pagination */}
            <Pagination
               itemsPerPage={ITEMS_PER_PAGE}
               maxVisiblePages={MAX_VISIBLE_PAGES}
               currentPage={currentPage}
               setCurrentPage={setCurrentPage}
               totalItems={filteredProducts.length}
               loading={loading}
            />
         </div>

         {/* Single Delete Modal */}
         {openDeletedModal && deleteProduct && (
            <DeletedModal
               isOpen={openDeletedModal}
               name={deleteProduct.title}
               onClose={() => {
                  setOpenDeletedModal(false);
                  setDeleteProduct(null);
               }}
               onConfirm={handleDeleteProduct}
               status="soft"
            />
         )}

         {/* Bulk Delete Modal */}
         {openBulkDeleteModal && (
            <DeletedModal
               isOpen={openBulkDeleteModal}
               name={`${selectedIds.size} selected product${selectedIds.size > 1 ? "s" : ""}`}
               onClose={() => setOpenBulkDeleteModal(false)}
               onConfirm={handleBulkDelete}
               mode="soft"
            />
         )}
      </>
   );
};

export default Products;
