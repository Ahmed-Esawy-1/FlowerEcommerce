import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { BASE_URL } from "../../api/config";

import ShieldIcon from "@mui/icons-material/Shield";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import SortIcon from "@mui/icons-material/Sort";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SecurityIcon from "@mui/icons-material/Security";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Link } from "react-router";

const TABLE_HEADER = [
   "User Name",
   "Email Address",
   "Role",
   "Status",
   "Actions",
];

const Users = () => {
   const [currentPage, setCurrentPage] = useState(1);
   const [allUser, setAllUser] = useState([]);

   useEffect(() => {
      console.log(allUser);
   }, [allUser]);

   useEffect(() => {
      async function getAllUsers() {
         try {
            const response = await api.get("admin/users");
            setAllUser(response.data);
         } catch (error) {
            console.log(error);
         }
      }
      getAllUsers();
   }, []);

   // Pagination
   const usersPerPage = 3;
   let totalPages = Math.ceil(allUser.length / usersPerPage);
   const maxVisiblePages = 4;
   const indexOfLastUser = currentPage * usersPerPage;
   const indexOfFirstUser = indexOfLastUser - usersPerPage;
   const currentUsers = allUser.slice(indexOfFirstUser, indexOfLastUser);

   let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
   let endPage = startPage + maxVisiblePages - 1;

   if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
   }

   const visiblePages = Array.from(
      {
         length: endPage - startPage + 1,
      },
      (_, i) => startPage + i,
   );

   return (
      <>
         {/* Header */}
         <div className="flex justify-between items-end">
            <div>
               <h2 className="page-title">User Management</h2>
               <p className="page-subtitle">
                  Manage organization members and their access permissions.
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
         </div>

         {/*  Cards  */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
            <div className="bg-surface-container border border-surface-variant p-8 rounded-xl shadow-sm h-40">
               <div className="flex items-center justify-between mb-2">
                  <ShieldIcon
                     className="text-indigo-600 bg-indigo-50 p-2 rounded-lg"
                     fontSize="large"
                  />
                  <span className="text-emerald-600 text-xs font-medium">
                     +2%
                  </span>
               </div>
               <p className="text-on-surface-variant text-xs font-medium">
                  Admins
               </p>
               <p className="text-on-surface text-xl font-bold">4</p>
            </div>

            <div className="bg-surface-container border border-surface-variant p-8 rounded-xl shadow-sm h-40">
               <div className="flex items-center justify-between mb-2">
                  <EditNoteIcon
                     className="text-on-tertiary-container bg-tertiary-fixed p-2 rounded-lg"
                     fontSize="large"
                  />
                  <span className="text-on-surface text-xs font-medium">
                     0%
                  </span>
               </div>
               <p className="text-on-surface-variant text-xs font-medium">
                  Editors
               </p>
               <p className="text-on-surface text-xl font-bold">18</p>
            </div>

            <div className="bg-surface-container border border-surface-variant p-8 rounded-xl shadow-sm h-40">
               <div className="flex items-center justify-between mb-2">
                  <VisibilityIcon
                     className="text-secondary bg-secondary-container p-2 rounded-lg"
                     fontSize="large"
                  />
                  <span className="text-emerald-600 text-xs font-medium">
                     +5%
                  </span>
               </div>
               <p className="text-on-surface-variant text-xs font-medium">
                  Viewers
               </p>
               <p className="text-on-surface text-xl font-bold">26</p>
            </div>

            <div className="bg-surface-container border border-surface-variant p-8 rounded-xl shadow-sm h-40">
               <div className="flex items-center justify-between mb-2">
                  <NoAccountsIcon
                     className="text-error bg-error-container p-2 rounded-lg"
                     fontSize="large"
                  />
                  <span className="text-error-container text-xs font-medium  bg-error px-1 rounded">
                     -1
                  </span>
               </div>
               <p className="text-on-surface-variant text-xs font-medium">
                  Inactive
               </p>
               <p className="text-on-surface text-xl font-bold">3</p>
            </div>
         </div>

         <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            {/* Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 border-b border-outline-variant">
               <div className="relative w-full sm:w-64">
                  <FilterAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant !text-sm" />
                  <select
                     // value={selectedStatus}
                     // onChange={handleStatusChange}
                     className="pl-10 pr-4 py-2 w-full bg-surface-container-lowest outline-none border border-outline-variant rounded-lg appearance-none"
                  >
                     <option>1</option>
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

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
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
                     {/*  User */}
                     {currentUsers.map((user, i) => (
                        <tr
                           className="hover:bg-surface-container-low transition-colors group"
                           key={i}
                        >
                           <td className="px-8 py-4">
                              <div className="flex items-center gap-3">
                                 <img
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                    data-alt="professional headshot of a smiling woman with dark hair in a corporate setting with neutral lighting"
                                    src={
                                       user?.imageUrl
                                          ? `${BASE_URL}${user.imageUrl}`
                                          : `https://lh3.googleusercontent.com/aida-public/AB6AXuDycsNhD7QLtcdq_eb5uwqOeFdCwjDe5B7NWUi2nNOkDAXTwvXoCBhNNOzut3q7gNuTkgpFDWqGVX6YboyGG09U_h9Q49fdQnBiI_NF0IItQInTFlwuvYhr30vmgchSrhzb3Z3EaNX4Lf6GVHNl4vImXRxifbahvQfhPnl0MKZEBBcG2jB7dfsJA8zx4A8_Jw0Y3pLxxDLxyDsLHQQKUqHXwUV42qcZ8naSsKbtEuM6g6Ud7hYoUWk4kOEJoMuCs67tbXoLarYaj5k`
                                    }
                                 />
                                 <div>
                                    <p className="text-on-surface text-sm font-semibold">
                                       {user.userName}
                                    </p>
                                    <p className="text-on-surface text-xs">
                                       Last active 2m ago
                                    </p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-4 text-slate-600 text-sm">
                              {user.email}
                           </td>
                           <td className="px-8 py-4">
                              <span className="bg-indigo-50 px-2.5 py-0.5 text-indigo-700 text-xs font-medium border border-indigo-100 rounded-full">
                                 {user.role}
                              </span>
                           </td>
                           <td className="px-8 py-4">
                              <div className="flex items-center gap-2">
                                 <span className="bg-emerald-500 w-2 h-2 rounded-full"></span>
                                 <span className="text-emerald-700 text-sm font-medium">
                                    Active
                                 </span>
                              </div>
                           </td>

                           <td className="px-8 py-4 text-right">
                              <button className="text-on-surface hover:text-primary transition-colors">
                                 <MoreVertIcon />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <button
                     className="px-3 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50"
                     disabled=""
                     onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  >
                     Previous
                  </button>
                  <button
                     className="px-3 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50"
                     onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                     }
                  >
                     Next
                  </button>
               </div>
               <div className="flex items-center gap-1">
                  {startPage > 1 && (
                     <>
                        <button
                           onClick={() => setCurrentPage(1)}
                           className="w-8 h-8 flex items-center justify-center rounded text-slate-600 text-xs font-medium hover:bg-surface-container-lowest cursor-pointer"
                        >
                           1
                        </button>
                        {startPage > 2 && <span>...</span>}
                     </>
                  )}

                  {visiblePages.map((page, i) => (
                     <button
                        key={i}
                        className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${currentPage == page ? "bg-primary text-on-primary" : "border border-outline-variant hover:bg-surface-container-lowest"}`}
                        onClick={() => setCurrentPage(page)}
                     >
                        {page}
                     </button>
                  ))}

                  {endPage < totalPages && (
                     <>
                        {endPage < totalPages - 1 && <span>...</span>}
                        <button
                           onClick={() => setCurrentPage(totalPages)}
                           className="w-8 h-8 flex items-center justify-center rounded text-slate-600 text-xs font-medium hover:bg-surface-container-lowest cursor-pointer"
                        >
                           {totalPages}
                        </button>
                     </>
                  )}
               </div>
            </div>
         </div>
         {/*  Contextual Help / Empty State Placeholder (Visual Interest)  */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative p-8 bg-gradient-to-br from-indigo-500 to-primary text-white rounded-2xl shadow-lg overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-2xl tracking-wider mb-2">
                     Team Security
                  </h3>
                  <p className="max-w-sm text-sm opacity-90 mb-6">
                     Enable Two-Factor Authentication for all users to secure
                     your enterprise inventory data.
                  </p>
                  <button className="text-indigo-600 text-sm font-bold bg-white hover:bg-opacity-90 px-6 py-2 rounded-lg transition-all">
                     Enable 2FA
                  </button>
               </div>
               <SecurityIcon className="absolute -right-4 -bottom-4 !text-[120px] opacity-10 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-8 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm">
               <div>
                  <h3 className="text-on-surface text-2xl tracking-wider mb-2">
                     Bulk Invitations
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                     Need to add a whole department? Upload a CSV file to invite
                     multiple users at once.
                  </p>
               </div>
               <button className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium py-3 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl transition-all">
                  <FileUploadIcon />
                  Upload CSV
               </button>
            </div>
         </div>
      </>
   );
};

export default Users;
