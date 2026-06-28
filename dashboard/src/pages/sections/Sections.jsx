import api from "@/api/axios";
import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const API = "/api/admin/sections";

export default function Sections() {
   const navigate = useNavigate();

   const [sections, setSections] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [expanded, setExpanded] = useState({});
   const [deleting, setDeleting] = useState(null);
   const [confirmDelete, setConfirmDelete] = useState(null);

   // Fetch Sections
   async function getSections() {
      try {
         setLoading(true);
         const { data } = await api("/sections");
         setSections(data);
      } catch (e) {
         setError(e?.response?.data?.message);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getSections();
   }, []);

   function toggleExpand(id) {
      setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
   }

   async function handleDelete(section) {
      if (confirmDelete?.id !== section.id) {
         setConfirmDelete(section);
         return;
      }
      try {
         setDeleting(section.id);
         const res = await fetch(`${API}/${section.id}`, { method: "DELETE" });
         if (!res.ok) throw new Error("Delete failed");
         setSections((prev) => prev.filter((s) => s.id !== section.id));
         setConfirmDelete(null);
      } catch (e) {
         setError(e.message);
      } finally {
         setDeleting(null);
      }
   }

   if (loading) return <PageState icon="⏳" message="Loading sections…" />;
   if (error)
      return <PageState icon="⚠️" message={error} onRetry={getSections} />;

   return (
      <>
         {/* Header */}
         <PageHeader
            title="Shop Sections"
            subtitle={`${sections.length} section${sections.length !== 1 ? "s" : ""} ·
                  manage your storefront layout`}
         >
            <button
               onClick={() => navigate("/sections/create/")}
               className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
               <span className="text-lg leading-none">+</span>
               New Section
            </button>
         </PageHeader>

         {/* Empty state */}
         {sections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
               <span className="text-5xl mb-4">🗂️</span>
               <p className="text-on-surface-variant text-lg font-medium mb-2">
                  No sections yet
               </p>
               <p className="text-on-surface-variant/60 text-sm mb-6">
                  Create your first section to start organising your shop.
               </p>
               <button
                  onClick={() => navigate("/admin/sections/create")}
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
               >
                  Create Section
               </button>
            </div>
         )}

         {/* Section list */}
         <div className="flex flex-col gap-4">
            {sections.map((section, idx) => (
               <SectionCard
                  key={section.id}
                  section={section}
                  index={idx}
                  expanded={!!expanded[section.id]}
                  onToggle={() => toggleExpand(section.id)}
                  onEdit={() => navigate(`/admin/sections/${section.id}/edit`)}
                  onDelete={() => handleDelete(section)}
                  deleting={deleting === section.id}
                  confirmDelete={confirmDelete?.id === section.id}
                  onCancelDelete={() => setConfirmDelete(null)}
               />
            ))}
         </div>
      </>
   );
}

function SectionCard({
   section,
   index,
   expanded,
   onToggle,
   onEdit,
   onDelete,
   deleting,
   confirmDelete,
   onCancelDelete,
}) {
   return (
      <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/40 transition-shadow hover:shadow-md">
         {/* Card header */}
         <div className="flex items-center gap-4 px-5 py-4">
            {/* Order badge */}
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center justify-center">
               {index + 1}
            </span>

            {/* Names */}
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-on-surface truncate">
                     {section.nameEn}
                  </span>
                  <span className="text-on-surface-variant/50">·</span>
                  <span
                     className="text-on-surface-variant font-medium"
                     dir="rtl"
                  >
                     {section.nameAr}
                  </span>
               </div>
               <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-on-surface-variant/60">
                     /{section.visitUrl}
                  </span>
                  <span className="text-xs text-on-surface-variant/40">·</span>
                  <span className="text-xs text-on-surface-variant/60">
                     {section.products?.length ?? 0} product
                     {(section.products?.length ?? 0) !== 1 ? "s" : ""}
                  </span>
               </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
               <button
                  onClick={onEdit}
                  className="px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
               >
                  Edit
               </button>

               {confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                     <span className="text-xs text-error font-medium">
                        Sure?
                     </span>
                     <button
                        onClick={onDelete}
                        disabled={deleting}
                        className="px-3 py-1.5 text-xs font-medium bg-error text-on-error rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
                     >
                        {deleting ? "…" : "Yes"}
                     </button>
                     <button
                        onClick={onCancelDelete}
                        className="px-3 py-1.5 text-xs font-medium text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors"
                     >
                        No
                     </button>
                  </div>
               ) : (
                  <button
                     onClick={onDelete}
                     className="px-3 py-1.5 text-xs font-medium text-error border border-error/30 rounded-lg hover:bg-error/10 transition-colors"
                  >
                     Delete
                  </button>
               )}

               <button
                  onClick={onToggle}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all"
                  style={{
                     transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
               >
                  ▾
               </button>
            </div>
         </div>

         {/* Product grid (expanded) */}
         {expanded && (
            <div className="border-t border-outline-variant/30 px-5 py-4 bg-surface-container-low">
               {!section.products || section.products.length === 0 ? (
                  <p className="text-sm text-on-surface-variant/60 py-2">
                     No products in this section.
                  </p>
               ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                     {section.products.map((product, pIdx) => (
                        <ProductChip
                           key={product.id}
                           product={product}
                           order={pIdx + 1}
                        />
                     ))}
                  </div>
               )}
            </div>
         )}
      </div>
   );
}

function ProductChip({ product, order }) {
   return (
      <div className="flex items-center gap-2 bg-surface-container rounded-xl p-2 border border-outline-variant/30">
         {product.imageUrl ? (
            <img
               src={product.imageUrl}
               alt={product.nameEn}
               className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
         ) : (
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-on-surface-variant/40 text-xs">
               🌸
            </div>
         )}
         <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-on-surface truncate">
               {product.nameEn}
            </p>
            <p className="text-xs text-on-surface-variant/60">#{order}</p>
         </div>
      </div>
   );
}

function PageState({ icon, message, onRetry }) {
   return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
         <div className="text-center">
            <div className="text-4xl mb-3">{icon}</div>
            <p className="text-on-surface-variant">{message}</p>
            {onRetry && (
               <button
                  onClick={onRetry}
                  className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
               >
                  Retry
               </button>
            )}
         </div>
      </div>
   );
}
