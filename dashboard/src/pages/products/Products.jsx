import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import api from "../../api/axios";
import { BASE_URL } from "../../api/config";

import DeletedModal from "./DeletedModal";

import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import PaymentsIcon from "@mui/icons-material/Payments";
import CategoryIcon from "@mui/icons-material/Category";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TABLE_HEADER = [
   "Product Name",
   "Category",
   "Description",
   "Price",
   "Actions",
];

const PRODUCTS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 4;

const Products = () => {
   const [allProducts, setAllProducts] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");

   const [openDeletedModal, setOpenDeletedModal] = useState(false);
   const [deleteProduct, setDeleteProduct] = useState(null);

   // Fetch Products
   useEffect(() => {
      async function getProducts() {
         try {
            setLoading(true);
            const { data } = await api.get("products");
            setAllProducts(data);
         } catch (error) {
            console.log(error);
         } finally {
            setLoading(false);
         }
      }
      getProducts();
   }, []);

   // Reset to page 1 when search changes
   useEffect(() => {
      setCurrentPage(1);
   }, [searchQuery]);

   // Filter products by search query
   const filteredProducts = useMemo(() => {
      if (!searchQuery.trim()) return allProducts;
      return allProducts.filter((p) =>
         p.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
   }, [allProducts, searchQuery]);

   // Pagination
   const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

   const currentProducts = useMemo(() => {
      const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      return filteredProducts.slice(startIndex, endIndex);
   }, [filteredProducts, currentPage]);

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
         { length: endPage - startPage + 1 },
         (_, i) => startPage + i,
      );
   }, [currentPage, totalPages]);

   // Display range
   const startIndex =
      filteredProducts.length === 0
         ? 0
         : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
   const endIndex = Math.min(
      currentPage * PRODUCTS_PER_PAGE,
      filteredProducts.length,
   );

   // Delete Product
   async function handleDeleteProduct() {
      if (!deleteProduct) return;

      try {
         await api.delete(`products/${deleteProduct.id}`);

         setAllProducts((prev) => {
            const updated = prev.filter((p) => p.id !== deleteProduct.id);

            const newFilteredLength = searchQuery.trim()
               ? updated.filter((p) =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
                 ).length
               : updated.length;

            const newTotalPages = Math.ceil(
               newFilteredLength / PRODUCTS_PER_PAGE,
            );
            if (currentPage > newTotalPages) {
               setCurrentPage(newTotalPages || 1);
            }

            return updated;
         });

         setDeleteProduct(null);
         setOpenDeletedModal(false);
      } catch (error) {
         console.log(error);
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
                  to="/products/create-product"
                  className="px-4 py-2 bg-primary text-on-primary-fixed rounded-lg hover:opacity-90 transition-all"
               >
                  Create New Product
               </Link>
            </div>
         </section>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface-container border border-surface-variant p-8 rounded-xl shadow-sm h-42">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                     <InventoryIcon className="text-indigo-600" />
                  </div>
                  <span className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                     +12%
                  </span>
               </div>
               <p className="text-on-surface-variant uppercase">
                  Total Products
               </p>
               <p className="text-2xl font-bold mt-1.5">{allProducts.length}</p>
            </div>

            <div className="bg-surface-container border border-surface-variant p-8 rounded-xl shadow-sm h-42">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-orange-50 rounded-lg">
                     <WarningIcon className="text-orange-600" />
                  </div>
                  <span className="text-orange-600 text-xs font-semibold bg-orange-50 px-2 py-1 rounded-full">
                     8 items
                  </span>
               </div>
               <p className="text-on-surface-variant uppercase">Low Stock</p>
               <p className="text-2xl font-bold mt-1.5">42</p>
            </div>

            <div className="bg-surface-container border border-surface-variant p-8 rounded-xl shadow-sm h-42">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                     <PaymentsIcon className="text-emerald-600" />
                  </div>
               </div>
               <p className="text-on-surface-variant uppercase">
                  Inventory Value
               </p>
               <p className="text-2xl font-bold mt-1.5">$452.9k</p>
            </div>

            <div className="bg-surface-container border border-surface-variant p-8 rounded-xl shadow-sm h-42">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                     <CategoryIcon className="text-purple-600" />
                  </div>
               </div>
               <p className="text-on-surface-variant uppercase">
                  Active Categories
               </p>
               <p className="text-2xl font-bold mt-1.5">24</p>
            </div>
         </div>

         <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            {/* Filter Bar */}
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
                           <th className="px-6 py-4">
                              <input
                                 className="text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                 type="checkbox"
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
                                 className="hover:bg-surface-container-low transition-colors"
                                 key={product.id}
                              >
                                 <td className="px-6 py-4">
                                    <input
                                       className="text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                       type="checkbox"
                                    />
                                 </td>
                                 <td className="px-8 py-4">
                                    <div className="flex items-center gap-3">
                                       <img
                                          alt={`${product.title} Image`}
                                          className="w-10 h-10 object-cover border border-slate-200 rounded-lg"
                                          src={`${BASE_URL}${product.images[0]?.imageUrl}`}
                                       />
                                       <div>
                                          <p className="text-on-surface text-sm font-semibold">
                                             {product.title}
                                          </p>
                                          {product.occasion && (
                                             <p className="text-on-surface-variant text-xs">
                                                {product.occasion?.name}
                                             </p>
                                          )}
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    {product.category?.name}
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
            {!loading && totalPages > 1 && (
               <div className="px-6 py-4 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-on-surface-variant">
                     Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-1">
                     <button
                        onClick={() =>
                           setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-1.5 text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <ChevronLeftIcon fontSize="small" />
                     </button>

                     {visiblePages[0] > 1 && (
                        <>
                           <button
                              onClick={() => setCurrentPage(1)}
                              className="w-8 h-8 flex items-center justify-center text-sm border border-outline-variant rounded hover:bg-surface-container-lowest transition-colors"
                           >
                              1
                           </button>
                           {visiblePages[0] > 2 && (
                              <span className="px-1 text-on-surface-variant">
                                 ...
                              </span>
                           )}
                        </>
                     )}

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

                     {visiblePages[visiblePages.length - 1] < totalPages && (
                        <>
                           {visiblePages[visiblePages.length - 1] <
                              totalPages - 1 && (
                              <span className="px-1 text-on-surface-variant">
                                 ...
                              </span>
                           )}
                           <button
                              onClick={() => setCurrentPage(totalPages)}
                              className="w-8 h-8 flex items-center justify-center text-sm border border-outline-variant rounded hover:bg-surface-container-lowest transition-colors"
                           >
                              {totalPages}
                           </button>
                        </>
                     )}

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
            )}
         </div>

         {/* Delete Modal */}
         {openDeletedModal && deleteProduct && (
            <DeletedModal
               isOpen={openDeletedModal}
               productName={deleteProduct.title}
               onClose={() => {
                  setOpenDeletedModal(false);
                  setDeleteProduct(null);
               }}
               onConfirm={handleDeleteProduct}
            />
         )}
      </>
   );
};

export default Products;
