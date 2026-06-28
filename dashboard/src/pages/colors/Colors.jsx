import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/api/axios";
import DeletedModal from "@/components/DeleteModal";
import PageHeader from "@/components/PageHeader";
import ColorFormModal from "./ColorFormModal";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaletteIcon from "@mui/icons-material/Palette";

const TABLE_HEADER = ["Color", "Name", "Hex Code", "Actions"];

const Colors = () => {
   const { language } = useLanguage();

   const [colors, setColors] = useState([]);
   const [modalOpen, setModalOpen] = useState(false);
   const [editData, setEditData] = useState(null);
   const [openDeletedModal, setOpenDeletedModal] = useState(false);
   const [deleteColor, setDeleteColor] = useState(null);

   // Search
   const [filtered, setFiltered] = useState([]);
   const [search, setSearch] = useState("");

   // Fetch Colors
   useEffect(() => {
      async function getColors() {
         try {
            const { data } = await api.get("colors");
            setColors(data);
         } catch (err) {
            console.error(err);
         }
      }
      getColors();
   }, []);

   // Search Filter
   useEffect(() => {
      const q = search.toLowerCase();
      setFiltered(
         colors.filter(
            (c) =>
               c.nameEn.toLowerCase().includes(q) ||
               c.nameAr.toLowerCase().includes(q) ||
               c.hexCode?.toLowerCase().includes(q),
         ),
      );
   }, [search, colors]);

   // --- ACTIONS --------------------------------------------------------
   const handleAdd = async (form) => {
      try {
         const { data } = await api.post("colors", form);
         setColors((prev) => [data, ...prev]);
         toast.success("Color created successfully!");
      } catch (error) {
         toast.error(
            error?.response?.data?.message || "Failed to create color.",
         );
      }
   };

   const handleEdit = async (form) => {
      try {
         const { data } = await api.put(`colors/${editData.id}`, form);
         setColors((prev) => [data, ...prev.filter((c) => c.id !== data.id)]);
         toast.success("Color updated successfully!");
         setEditData(null);
         setModalOpen(false);
      } catch (err) {
         toast.error(err?.response?.data?.message || "Failed to update color.");
      }
   };

   const handleDelete = async () => {
      try {
         await api.delete(`colors/${deleteColor.id}`);
         setColors((prev) => prev.filter((c) => c.id !== deleteColor.id));
         const msg =
            language === "en"
               ? `Color "${deleteColor.nameEn}" deleted successfully.`
               : `تم حذف اللون "${deleteColor.nameAr}" بنجاح.`;
         toast.success(msg);
      } catch (err) {
         toast.error(err?.response?.data?.message || "Failed to delete color.");
      } finally {
         setOpenDeletedModal(false);
         setDeleteColor(null);
      }
   };

   return (
      <>
         {/* Header */}
         <PageHeader
            title="Color Management"
            subtitle="Manage product color variants and their images."
         >
            <button
               onClick={() => {
                  setEditData(null);
                  setModalOpen(true);
               }}
               className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary-fixed rounded-lg hover:opacity-90 transition-all text-sm font-medium"
            >
               <AddIcon fontSize="small" />
               Add Color
            </button>
         </PageHeader>

         {/* Content */}
         <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            {/* Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 border-b border-outline-variant">
               <div className="relative w-full sm:w-72">
                  <FilterAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant !text-sm" />
                  <input
                     type="text"
                     placeholder="Search by name or hex"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="pl-9 pr-4 py-2 w-full bg-surface-container-lowest outline-none border border-outline-variant rounded-lg text-sm text-on-surface placeholder:text-outline"
                  />
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-xs text-outline">
                     {filtered.length} color{filtered.length !== 1 ? "s" : ""}
                  </span>
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
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-surface-container-low text-left">
                        {TABLE_HEADER.map((h) => (
                           <th
                              key={h}
                              className={`px-6 py-4 text-on-surface-variant text-sm font-medium border-b border-outline-variant ${h === "Actions" ? "text-right" : ""}`}
                           >
                              {h}
                           </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                     {filtered.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center gap-2 text-outline">
                                 <PaletteIcon className="!text-4xl opacity-30" />
                                 <p className="text-sm">No colors found</p>
                              </div>
                           </td>
                        </tr>
                     ) : (
                        filtered.map((color) => (
                           <tr
                              key={color.id}
                              className="hover:bg-surface-container-low transition-colors group"
                           >
                              <td className="px-6 py-4">
                                 <div
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                    style={{ background: color.hexCode }}
                                 />
                              </td>

                              <td className="px-6 py-4">
                                 <p className="text-on-surface text-sm font-semibold">
                                    {language === "en"
                                       ? color.nameEn
                                       : color.nameAr}
                                 </p>
                              </td>

                              <td className="px-6 py-4">
                                 <span className="font-mono text-xs px-2.5 py-1 bg-surface-container border border-outline-variant rounded-lg text-on-surface-variant">
                                    {color.hexCode}
                                 </span>
                              </td>

                              <td className="px-6 py-4 text-right">
                                 <button
                                    onClick={() => {
                                       setEditData(color);
                                       setModalOpen(true);
                                    }}
                                    className="text-on-surface hover:text-primary transition-colors cursor-pointer"
                                 >
                                    <EditIcon />
                                 </button>
                                 <button
                                    className="ml-2 text-on-surface hover:text-error transition-colors cursor-pointer"
                                    onClick={() => {
                                       setDeleteColor(color);
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
         </div>

         {/* Add / Edit Modal */}
         <ColorFormModal
            isOpen={modalOpen}
            onClose={() => {
               setModalOpen(false);
               setEditData(null);
            }}
            onSaved={editData ? handleEdit : handleAdd}
            editData={editData}
         />

         {/* Delete Modal */}
         {openDeletedModal && deleteColor && (
            <DeletedModal
               isOpen={openDeletedModal}
               name={
                  language === "en" ? deleteColor.nameEn : deleteColor.nameAr
               }
               onClose={() => {
                  setOpenDeletedModal(false);
                  setDeleteColor(null);
               }}
               onConfirm={handleDelete}
               mode="soft"
            />
         )}
      </>
   );
};

export default Colors;
