import React, {
   useState,
   useEffect,
   useCallback,
   useTransition,
   useDeferredValue,
} from "react";

import api from "../../api/axios";
import { BASE_URL } from "../../api/config";

import DeletedModal from "./DeletedModal";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const ORDERS_PER_PAGE = 10;

const STATUS_OPTIONS = [
   "ALL",
   "PENDING",
   "CONFIRMED",
   "SHIPPED",
   "DELIVERED",
   "CANCELED",
];

const STATUS_STYLES = {
   PENDING: "bg-gray-100 text-gray-800",
   CONFIRMED: "bg-blue-100 text-blue-800",
   SHIPPED: "bg-amber-100 text-amber-800",
   DELIVERED: "bg-emerald-100 text-emerald-800",
   CANCELED: "bg-red-100 text-red-800",
};

const TABLE_HEADER = [
   "Order ID",
   "Customer",
   "Date",
   "Amount",
   "Status",
   "Actions",
];

function getPaginationPages(currentPage, totalPages) {
   if (totalPages <= 6)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

   const pages = [1];
   if (currentPage > 4) pages.push("...");

   const start = Math.max(2, currentPage - 1);
   const end = Math.min(totalPages - 1, currentPage + 1);
   for (let i = start; i <= end; i++) pages.push(i);

   if (currentPage < totalPages - 3) pages.push("...");
   pages.push(totalPages);

   return pages;
}

const Orders = () => {
   const [orders, setOrders] = useState([]);
   const [totalOrders, setTotalOrders] = useState(0);
   const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [selectedStatus, setSelectedStatus] = useState("ALL");
   const [openDeletedModal, setOpenDeletedModal] = useState(false);
   const [deleteOrder, setDeleteOrder] = useState(null);

   const [isPending, startTransition] = useTransition();

   console.log(orders);

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

   const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
   const startIndex = (currentPage - 1) * ORDERS_PER_PAGE + 1;
   const endIndex = Math.min(currentPage * ORDERS_PER_PAGE, totalOrders);

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
         <div className="mb-8">
            <h1 className="page-title">Orders</h1>
            <p className="page-subtitle">
               Manage and track your customer purchase lifecycle.
            </p>
         </div>

         {/* Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface-container border border-surface-variant p-8 rounded-xl shadow-sm h-42">
               <div className="flex justify-between items-start mb-2">
                  <span className="text-on-surface-variant">Total Orders</span>
                  <div className="bg-primary-fixed p-1 rounded text-on-primary-fixed">
                     <ShoppingBagIcon />
                  </div>
               </div>
               <div className="text-2xl font-bold mt-1.5">{totalOrders}</div>
               <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-1.5">
                  <TrendingUpIcon fontSize="small" /> 12% from last month
               </div>
            </div>

            <div className="bg-surface-container border border-surface-variant p-8 rounded-xl shadow-sm h-42">
               <div className="flex justify-between items-start mb-2">
                  <span className="text-on-surface-variant">Pending</span>
                  <div className="bg-tertiary-fixed p-1 rounded">
                     <PendingActionsIcon />
                  </div>
               </div>
               <div className="text-2xl font-bold mt-1.5">42</div>
               <div className="mt-1 text-on-surface-variant text-xs font-medium">
                  Requiring immediate action
               </div>
            </div>

            <div className="bg-surface-container border border-surface-variant p-8 rounded-xl shadow-sm h-42">
               <div className="flex justify-between items-start mb-2">
                  <span className="text-on-surface-variant">Completed</span>
                  <div className="p-1 bg-secondary-fixed rounded text-on-secondary-fixed">
                     <CheckCircleIcon />
                  </div>
               </div>
               <div className="text-2xl font-bold mt-1.5">1,150</div>
               <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-1.5">
                  <TrendingUpIcon fontSize="small" /> 8% fulfillment rate
               </div>
            </div>

            <div className="bg-surface-container border border-surface-variant p-8 rounded-xl shadow-sm h-42">
               <div className="flex justify-between items-start mb-2">
                  <span className="text-on-surface-variant">Revenue</span>
                  <div className="p-1 bg-primary-fixed-dim rounded text-on-primary-fixed">
                     <PaymentsIcon />
                  </div>
               </div>
               <div className="text-2xl font-bold mt-1.5">$124.5k</div>
               <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-1.5">
                  <TrendingUpIcon fontSize="small" /> 24% year-to-date
               </div>
            </div>
         </div>

         {loading && (
            <div className="flex justify-center items-center py-20">
               <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
         )}

         {!loading && orders.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
               {/* Filter */}
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 border-b border-outline-variant">
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
                                 ? "Filter by Status"
                                 : s.charAt(0) + s.slice(1).toLowerCase()}
                           </option>
                        ))}
                     </select>
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

               {/* Table */}
               <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                     <thead>
                        <tr className="bg-surface-container-low text-left">
                           {TABLE_HEADER.map((h) => (
                              <th
                                 key={h}
                                 className={`px-6 py-4 text-on-surface-variant border-b border-outline-variant ${h === "Actions" ? "text-right" : ""}`}
                              >
                                 {h}
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-outline-variant">
                        {orders.map((order) => (
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
                                             : "default_user_profile.png"
                                       }
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
                                 {order.totalPrice} EGP
                              </td>
                              <td className="px-6 py-4">
                                 <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order?.status]}`}
                                 >
                                    {order?.status?.toLowerCase()}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
               <div className="p-4 flex items-center justify-between bg-surface-container-low">
                  <p className="text-on-surface-variant text-sm">
                     Showing {startIndex} to {endIndex} of {totalOrders} results
                     {selectedStatus !== "ALL" && (
                        <span className="ml-2 text-primary font-medium">
                           ({selectedStatus.toLowerCase()})
                        </span>
                     )}
                  </p>

                  <div className="flex items-center gap-1">
                     <button
                        onClick={() =>
                           setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-lowest transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                     >
                        <NavigateBeforeIcon fontSize="small" />
                     </button>

                     {getPaginationPages(currentPage, totalPages).map(
                        (page, index) =>
                           page === "..." ? (
                              <span
                                 key={`ellipsis-${index}`}
                                 className="px-1 text-on-surface-variant"
                              >
                                 ...
                              </span>
                           ) : (
                              <button
                                 key={page}
                                 onClick={() => setCurrentPage(page)}
                                 className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                                    page === currentPage
                                       ? "bg-primary text-on-primary"
                                       : "bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-on-surface"
                                 }`}
                              >
                                 {page}
                              </button>
                           ),
                     )}

                     <button
                        onClick={() =>
                           setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-lowest transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                     >
                        <NavigateNextIcon fontSize="small" />
                     </button>
                  </div>
               </div>
            </div>
         )}

         {!loading && orders.length === 0 && (
            <div className="flex flex-col items-center py-20 gap-2 text-on-surface-variant">
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
         )}

         {openDeletedModal && deleteOrder && (
            <DeletedModal
               isOpen={openDeletedModal}
               productName={`#${deleteOrder.id}`}
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
