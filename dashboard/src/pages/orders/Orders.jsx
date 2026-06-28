import React, { useState, useEffect, useCallback, useTransition } from "react";

import api from "../../api/axios";
import { BASE_URL } from "../../api/config";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import DeletedModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { useTranslation } from "react-i18next";

const ORDERS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 5;

const STATUS_OPTIONS = ["ALL", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_STYLES = {
   PENDING: "bg-gray-100 text-gray-800",
   SHIPPED: "bg-amber-100 text-amber-800",
   DELIVERED: "bg-emerald-100 text-emerald-800",
   CANCELLED: "bg-red-100 text-red-800",
};

const TABLE_HEADER = ["id", "customer", "date", "amount", "status", "actions"];
const DEFAULT_AVATAR = "/default_user_profile.png";

const Orders = () => {
   const [orders, setOrders] = useState([]);
   const [totalOrders, setTotalOrders] = useState(0);
   const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [selectedStatus, setSelectedStatus] = useState("ALL");
   const [openDeletedModal, setOpenDeletedModal] = useState(false);
   const [deleteOrder, setDeleteOrder] = useState(null);

   const [isPending, startTransition] = useTransition();

   const { t } = useTranslation("orders");

   // Get Orders
   const getOrders = useCallback(async (page, status) => {
      try {
         setLoading(true);
         const statusParam =
            status && status !== "ALL" ? `&status=${status}` : "";
         const { data } = await api.get(
            `/orders?page=${page - 1}&size=${ORDERS_PER_PAGE}${statusParam}`,
         );
         setOrders(data.content);
         setTotalOrders(data.totalElements);
      } catch (error) {
         console.error("Failed to fetch orders:", error);
         setOrders([]);
         setTotalOrders(0);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      getOrders(currentPage, selectedStatus);
   }, [currentPage, selectedStatus, getOrders]);

   // Scroll to top on page change (Pagination)
   useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, [currentPage]);

   //  Filter By Status
   const handleStatusChange = (e) => {
      startTransition(() => {
         setSelectedStatus(e.target.value);
         setCurrentPage(1);
      });
   };

   const startIndex =
      totalOrders === 0 ? 0 : (currentPage - 1) * ORDERS_PER_PAGE + 1;
   const endIndex = Math.min(currentPage * ORDERS_PER_PAGE, totalOrders);
   const hasResults = !loading && orders.length > 0;
   const noResults = !loading && orders.length === 0;

   // Open Delete Modal
   const handleOpenDelete = useCallback((order) => {
      setDeleteOrder(order);
      setOpenDeletedModal(true);
   }, []);

   // Delete Order
   const handleDeleteOrder = useCallback(async () => {
      if (!deleteOrder) return;
      try {
         await api.delete(`/orders/${deleteOrder.id}`);
         const newTotalPages = Math.ceil((totalOrders - 1) / ORDERS_PER_PAGE);
         const pageToFetch =
            currentPage > newTotalPages ? newTotalPages || 1 : currentPage;
         setCurrentPage(pageToFetch);
         getOrders(pageToFetch, selectedStatus);
         setDeleteOrder(null);
         setOpenDeletedModal(false);
      } catch (error) {
         console.error("Failed to delete order:", error);
      }
   }, [deleteOrder, totalOrders, currentPage, selectedStatus, getOrders]);

   return (
      <>
         {/* Header */}
         <div className="mb-8">
            <h1 className="page-title">{t("title")}</h1>
            <p className="page-subtitle">{t("subTitle")}</p>
         </div>

         <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            {/* Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 border-b border-outline-variant">
               <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                     <FilterAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant !text-sm" />
                     <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="pl-10 pr-4 py-2 w-full bg-surface-container-lowest outline-none border border-outline-variant rounded-lg appearance-none"
                     >
                        {STATUS_OPTIONS.map((s) => (
                           <option key={s} value={s}>
                              {s === "ALL"
                                 ? t("table.filter")
                                 : t(`status.${s.toLowerCase()}`)}
                           </option>
                        ))}
                     </select>
                  </div>

                  {totalOrders > 0 && (
                     <p className="text-on-surface-variant text-sm whitespace-nowrap hidden sm:block">
                        {t("table.showingResults", {
                           from: startIndex,
                           to: endIndex,
                           total: totalOrders,
                        })}
                        {selectedStatus !== "ALL" && (
                           <span className="ml-2 text-primary font-medium">
                              ({selectedStatus.toLowerCase()})
                           </span>
                        )}
                     </p>
                  )}
               </div>

               <div className="flex items-center gap-2">
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                     <DownloadIcon />
                  </button>
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                     <PrintIcon />
                  </button>
               </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
               <table className="min-w-215 w-full border-collapse">
                  <thead>
                     <tr className="bg-surface-container-low ltr:text-left rtl:text-right">
                        {TABLE_HEADER.map((h) => (
                           <th
                              key={h}
                              className={`px-6 py-4 text-on-surface-variant border-b border-outline-variant ${h === "actions" ? "text-right" : ""}`}
                           >
                              {t(`table.${h}`)}
                           </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                     {loading && (
                        <tr>
                           <td colSpan={TABLE_HEADER.length} className="py-20">
                              <div className="flex justify-center items-center">
                                 <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                              </div>
                           </td>
                        </tr>
                     )}

                     {noResults && (
                        <tr>
                           <td colSpan={TABLE_HEADER.length} className="py-16">
                              <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                                 <ShoppingBagIcon fontSize="large" />
                                 <p>
                                    No orders found
                                    {selectedStatus !== "ALL"
                                       ? ` for status "${selectedStatus.toLowerCase()}"`
                                       : ""}
                                    .
                                 </p>
                                 {selectedStatus !== "ALL" && (
                                    <button
                                       onClick={() => {
                                          setSelectedStatus("ALL");
                                          setCurrentPage(1);
                                       }}
                                       className="text-primary underline text-sm"
                                    >
                                       Clear filter
                                    </button>
                                 )}
                              </div>
                           </td>
                        </tr>
                     )}

                     {hasResults &&
                        orders.map((order) => (
                           <tr
                              className="hover:bg-surface-container-low transition-colors group"
                              key={order.id}
                           >
                              <td className="px-6 py-4 text-primary font-bold">
                                 #{order.id}
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <img
                                       src={
                                          order.customerImage
                                             ? `${BASE_URL}${order.customerImage}`
                                             : DEFAULT_AVATAR
                                       }
                                       onError={(e) => {
                                          e.currentTarget.onerror = null;
                                          e.currentTarget.src = DEFAULT_AVATAR;
                                       }}
                                       alt=""
                                       className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div>
                                       <p className="text-on-surface font-normal leading-5">
                                          {order.customerName}
                                       </p>
                                       <p className="text-on-surface-variant text-xs">
                                          {order.customerEmail}
                                       </p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-on-surface font-medium">
                                 {order?.createdAt?.split("T")[0]}
                              </td>
                              <td className="px-6 py-4 text-on-surface font-medium">
                                 {order.totalPrice} {t("table.pound")}
                              </td>
                              <td className="px-6 py-4">
                                 <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order?.status]}`}
                                 >
                                    {t(
                                       `status.${order?.status?.toLowerCase()}`,
                                    )}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1 hover:text-primary transition-colors">
                                       <VisibilityIcon fontSize="medium" />
                                    </button>
                                    <button className="p-1 hover:text-primary transition-colors">
                                       <EditIcon fontSize="medium" />
                                    </button>
                                    <button
                                       onClick={() => handleOpenDelete(order)}
                                       className="p-1 hover:text-red-500 transition-colors"
                                    >
                                       <DeleteIcon />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                  </tbody>
               </table>
            </div>

            {/* Pagination */}
            <Pagination
               itemsPerPage={ORDERS_PER_PAGE}
               maxVisiblePages={MAX_VISIBLE_PAGES}
               currentPage={currentPage}
               setCurrentPage={setCurrentPage}
               totalItems={totalOrders}
               loading={loading}
            />
         </div>

         {/* Deleted */}
         {openDeletedModal && deleteOrder && (
            <DeletedModal
               isOpen={openDeletedModal}
               name={`#${deleteOrder.id}`}
               onClose={() => {
                  setOpenDeletedModal(false);
                  setDeleteOrder(null);
               }}
               onConfirm={handleDeleteOrder}
            />
         )}
      </>
   );
};

export default Orders;
