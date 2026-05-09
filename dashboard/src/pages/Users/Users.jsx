import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { BASE_URL } from "../../api/config";

import ShieldIcon from "@mui/icons-material/Shield";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SecurityIcon from "@mui/icons-material/Security";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allUser, setAllUser] = useState([]);

  useEffect(() => {
    async function getAllUsers() {
      try {
        const response = await api.get("users");
        console.log(response.data);
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
    <main className="min-h-screen ml-[280px] pt-6 p-8 space-y-8">
      {/*  Header Section  */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-on-surface text-2xl font-bold leading-6 tracking-wide">
            User Management
          </h2>
          <p className="text-on-surface-variant text-sm tracking-wide mt-1">
            Manage organization members and their access permissions.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 text-xs font-semibold">
            Total Users: 48
          </span>
          <span className="bg-emerald-50 px-3 py-1 rounded-full text-emerald-700 text-xs font-semibold">
            Online Now: 12
          </span>
        </div>
      </div>
      {/*  Cards  */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <ShieldIcon
              className="text-indigo-600 bg-indigo-50 p-2 rounded-lg"
              fontSize="large"
            />
            <span className="text-emerald-600 text-xs font-medium">+2%</span>
          </div>
          <p className="text-slate-500 text-xs font-medium">Admins</p>
          <p className="text-on-surface text-xl font-bold">4</p>
        </div>
        <div className="col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <EditNoteIcon
              className="text-on-tertiary-container bg-tertiary-fixed p-2 rounded-lg"
              fontSize="large"
            />
            <span className="text-slate-400 text-xs font-medium">0%</span>
          </div>
          <p className="text-slate-500 text-xs font-medium">Editors</p>
          <p className="text-on-surface text-xl font-bold">18</p>
        </div>
        <div className="col-span-1 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <VisibilityIcon
              className="text-secondary bg-secondary-container p-2 rounded-lg"
              fontSize="large"
            />
            <span className="text-emerald-600 text-xs font-medium">+5%</span>
          </div>
          <p className="text-slate-500 text-xs font-medium">Viewers</p>
          <p className="text-on-surface text-xl font-bold">26</p>
        </div>
        <div className="col-span-1 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <NoAccountsIcon
              className="text-error bg-error-container p-2 rounded-lg"
              fontSize="large"
            />
            <span className="text-error-container text-xs font-medium  bg-error px-1 rounded">
              -1
            </span>
          </div>
          <p className="text-slate-500 text-xs font-medium">Inactive</p>
          <p className="text-on-surface text-xl font-bold">3</p>
        </div>
      </div>

      {/*  Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center bg-slate-50/50 p-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">
              <FilterListIcon className="!text-lg" />
              Filter
            </button>
            <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">
              <SortIcon className="!text-lg" />
              Sort
            </button>
          </div>
          <p className="text-slate-400 text-xs font-medium">
            Showing 10 of 48 users
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-slate-500 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-8 py-4 text-slate-500 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-8 py-4 text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-8 py-4 text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-4 text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/*  User */}
              {currentUsers.map((user, i) => (
                <tr
                  className="hover:bg-slate-50 transition-colors group"
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
                          {user.name}
                        </p>
                        <p className="text-slate-400 text-xs">
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
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </button>
          </div>
          <div className="flex items-center gap-1">
            {startPage > 1 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="w-8 h-8 flex items-center justify-center rounded text-slate-600 text-xs font-medium hover:bg-slate-100 cursor-pointer"
                >
                  1
                </button>
                {startPage > 2 && <span>...</span>}
              </>
            )}

            {visiblePages.map((page, i) => (
              <button
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded text-slate-600 text-xs font-medium ${currentPage == page ? "bg-primary text-white pointer-events-none" : "text-slate-600 hover:bg-slate-100 border-slate-200 transition-colors cursor-pointer"}`}
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
                  className="w-8 h-8 flex items-center justify-center rounded text-slate-600 text-xs font-medium hover:bg-slate-100 cursor-pointer"
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
            <h3 className="text-2xl tracking-wider mb-2">Team Security</h3>
            <p className="max-w-sm text-sm opacity-90 mb-6">
              Enable Two-Factor Authentication for all users to secure your
              enterprise inventory data.
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
    </main>
  );
};

export default Users;
