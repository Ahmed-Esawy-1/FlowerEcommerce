import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import DeletedModal from "../components/DeleteModal";

const iconMap = {
   product: Inventory2Icon,
   category: CategoryIcon,
   occasion: EventIcon,
   user: PersonIcon,
};

//  Props:
//        title           => Page Title
//        endpoint        => End Point to: Fetch the the Inactive Items [Products, Categories, Occasions]
//        restoreEndpoint => End Point to: restore Them
//        deleteEndpoint  => End Point to: Delete Them Permanently

const TrashPage = ({
   title,
   endpoint,
   restoreEndpoint,
   deleteEndpoint,
   type,
}) => {
   const Icon = iconMap[type];

   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(false);
   const [selectedItems, setSelectedItems] = useState([]);

   const [openModal, setOpenModal] = useState(false);
   const [deleteMode, setDeleteMode] = useState("single"); // single | bulk
   const [deleteId, setDeleteId] = useState(null);

   // Fetch Trash Items
   useEffect(() => {
      async function fetchData() {
         try {
            setLoading(true);
            const { data } = await api.get(endpoint);
            setItems(data);
         } catch (err) {
            toast.error("Failed to load trash items");
         } finally {
            setLoading(false);
         }
      }
      fetchData();
   }, [endpoint]);

   // -- Checkbox ----------------------------------------------------------------------
   const allSelected =
      items.length > 0 && selectedItems.length === items.length;
   const someSelected = selectedItems.length > 0 && !allSelected;

   function toggleSelect(id) {
      setSelectedItems((prev) =>
         prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
   }

   function handleSelectAll() {
      setSelectedItems(allSelected ? [] : items.map((i) => i.id));
   }

   // -- Modal ----------------------------------------------------------------------
   function openSingleDelete(id) {
      setDeleteMode("single");
      setDeleteId(id);
      setOpenModal(true);
   }

   function openBulkDelete() {
      setDeleteMode("bulk");
      setOpenModal(true);
   }

   function closeModal() {
      setOpenModal(false);
      setDeleteId(null);
   }

   // -- Restore ----------------------------------------------------------------------
   async function handleRestore(id) {
      try {
         await api.put(`${restoreEndpoint}/${id}/restore`);
         setItems((prev) => prev.filter((i) => i.id !== id));
         setSelectedItems((prev) => prev.filter((x) => x !== id));
         toast.success("Restored successfully");
      } catch (err) {
         toast.error("Restore failed");
      }
   }

   async function handleBulkRestore() {
      try {
         await api.put(`${restoreEndpoint}/restore`, selectedItems);
         setItems((prev) => prev.filter((i) => !selectedItems.includes(i.id)));
         setSelectedItems([]);
         toast.success("Items restored");
      } catch (err) {
         toast.error("Bulk restore failed");
      }
   }

   // -- Delete ----------------------------------------------------------------------
   async function handleDelete(id) {
      try {
         await api.delete(`${deleteEndpoint}/${id}/permanent`);
         setItems((prev) => prev.filter((i) => i.id !== id));
         setSelectedItems((prev) => prev.filter((x) => x !== id));
         toast.success("Deleted permanently");
      } catch (err) {
         toast.error("Delete failed");
      } finally {
         closeModal();
      }
   }

   async function handleBulkDelete() {
      try {
         await api.delete(`${deleteEndpoint}/permanent`, {
            data: selectedItems,
         });
         setItems((prev) => prev.filter((i) => !selectedItems.includes(i.id)));
         setSelectedItems([]);
         toast.success("Items deleted permanently");
      } catch (err) {
         toast.error("Bulk delete failed");
      } finally {
         closeModal();
      }
   }

   // ── Confirm Router ────────────────────────────────────────────────
   function handleConfirm() {
      if (deleteMode === "bulk") {
         handleBulkDelete();
      } else {
         handleDelete(deleteId);
      }
   }

   // ── Modal Name ────────────────────────────────────────────────────
   const modalName =
      deleteMode === "single"
         ? (items.find((i) => i.id === deleteId)?.title ??
           items.find((i) => i.id === deleteId)?.name ??
           "this item")
         : `${selectedItems.length} selected item${selectedItems.length > 1 ? "s" : ""}`;

   return (
      <section className="p-4 space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
            <div>
               <h2 className="page-title">{title}</h2>
               <p className="page-subtitle">Manage deleted items safely.</p>
            </div>
            <div className="flex gap-2">
               {selectedItems.length > 0 && (
                  <>
                     <button
                        onClick={handleBulkRestore}
                        className="px-4 py-2 rounded-lg bg-primary text-white"
                     >
                        Restore Selected
                     </button>
                     <button
                        onClick={openBulkDelete}
                        className="px-4 py-2 rounded-lg bg-error text-white"
                     >
                        Delete Selected
                     </button>
                  </>
               )}
            </div>
         </div>

         {/* Count */}
         <div className="glass-card p-4 rounded-xl">
            <p className="text-sm text-on-surface-variant">Pending Deletion</p>
            <h3 className="text-3xl font-bold">{items.length}</h3>
         </div>

         {/* Table */}
         <div className="bg-surface-container rounded-xl overflow-hidden border border-surface-variant">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-surface-variant">
                        <th className="p-4">
                           <input
                              type="checkbox"
                              checked={allSelected}
                              ref={(el) => {
                                 if (el) el.indeterminate = someSelected;
                              }}
                              onChange={handleSelectAll}
                              disabled={items.length === 0}
                           />
                        </th>
                        <th className="p-4 text-left">Item</th>
                        <th className="p-4 text-left">Deleted At</th>
                        <th className="p-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                        <tr>
                           <td colSpan={4} className="py-16 text-center">
                              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                           </td>
                        </tr>
                     ) : items.length === 0 ? (
                        <tr>
                           <td
                              colSpan={4}
                              className="py-16 text-center text-on-surface-variant"
                           >
                              Trash is empty
                           </td>
                        </tr>
                     ) : (
                        items.map((item) => (
                           <tr
                              key={item.id}
                              className={`border-b transition-colors ${selectedItems.includes(item.id) ? "bg-primary/5" : ""}`}
                           >
                              <td className="p-4">
                                 <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => toggleSelect(item.id)}
                                 />
                              </td>
                              <td className="p-4">
                                 <div className="flex items-center gap-3">
                                    <Icon />
                                    {/* support both .title (products) and .name (others) */}
                                    <span>{item.title ?? item.nameEn}</span>
                                 </div>
                              </td>
                              <td className="p-4 text-sm text-gray-500">
                                 {item.deletedAt
                                    ? new Date(
                                         item.deletedAt,
                                      ).toLocaleDateString()
                                    : "Recently"}
                              </td>
                              <td className="p-4">
                                 <div className="flex justify-end gap-2">
                                    <button
                                       onClick={() => handleRestore(item.id)}
                                       className="text-on-surface-variant hover:text-primary"
                                    >
                                       <RestoreIcon />
                                    </button>
                                    <button
                                       onClick={() => openSingleDelete(item.id)}
                                       className="text-on-surface-variant hover:text-error"
                                    >
                                       <DeleteForeverIcon />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Modal */}
         <DeletedModal
            isOpen={openModal}
            onClose={closeModal}
            onConfirm={handleConfirm}
            mode="hard"
            name={modalName}
         />
      </section>
   );
};

export default TrashPage;
