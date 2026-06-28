import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const SECTIONS_API = "/api/admin/sections";
const PRODUCTS_API = "/api/admin/products";

export default function EditSection() {
   const navigate = useNavigate();
   const { id } = useParams();

   const [loading, setLoading] = useState(true);
   const [loadError, setLoadError] = useState(null);

   const [form, setForm] = useState({ nameEn: "", nameAr: "", visitUrl: "" });
   const [originalForm, setOriginalForm] = useState(null);
   const [errors, setErrors] = useState({});

   const [products, setProducts] = useState([]);
   const [originalProducts, setOriginalProducts] = useState([]);

   const [saving, setSaving] = useState(false);
   const [saveError, setSaveError] = useState(null);
   const [saveSuccess, setSaveSuccess] = useState(false);

   // Product search
   const [searchQuery, setSearchQuery] = useState("");
   const [searchResults, setSearchResults] = useState([]);
   const [searching, setSearching] = useState(false);
   const [searchDone, setSearchDone] = useState(false);

   // ─── Load section ─────────────────────────────────────────────────────────

   useEffect(() => {
      fetchSection();
   }, [id]);

   async function fetchSection() {
      try {
         setLoading(true);
         setLoadError(null);
         const res = await fetch(`${SECTIONS_API}/${id}`);
         if (!res.ok) throw new Error("Section not found");
         const data = await res.json();
         const f = {
            nameEn: data.nameEn,
            nameAr: data.nameAr,
            visitUrl: data.visitUrl,
         };
         setForm(f);
         setOriginalForm(f);
         setProducts(data.products ?? []);
         setOriginalProducts(data.products ?? []);
      } catch (e) {
         setLoadError(e.message);
      } finally {
         setLoading(false);
      }
   }

   // ─── Dirty detection ──────────────────────────────────────────────────────

   const formDirty =
      originalForm &&
      (form.nameEn !== originalForm.nameEn ||
         form.nameAr !== originalForm.nameAr ||
         form.visitUrl !== originalForm.visitUrl);

   const productsDirty =
      products.length !== originalProducts.length ||
      products.some((p, i) => p.id !== originalProducts[i]?.id);

   const isDirty = formDirty || productsDirty;

   // ─── Form handlers ────────────────────────────────────────────────────────

   function handleField(field, value) {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
      setSaveSuccess(false);
   }

   function validate() {
      const e = {};
      if (!form.nameEn.trim()) e.nameEn = "English name is required";
      if (!form.nameAr.trim()) e.nameAr = "Arabic name is required";
      if (!form.visitUrl.trim()) e.visitUrl = "URL slug is required";
      else if (!/^[a-z0-9-]+$/.test(form.visitUrl))
         e.visitUrl = "Only lowercase letters, numbers, and hyphens";
      return e;
   }

   async function handleSave() {
      const e = validate();
      if (Object.keys(e).length) {
         setErrors(e);
         return;
      }
      if (!isDirty) return;

      try {
         setSaving(true);
         setSaveError(null);
         setSaveSuccess(false);

         const payload = {
            nameEn: form.nameEn.trim(),
            nameAr: form.nameAr.trim(),
            visitUrl: form.visitUrl.trim(),
            productIds: products.map((p) => p.id),
         };

         const res = await fetch(`${SECTIONS_API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
         });

         if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.message || "Failed to save");
         }

         const updated = await res.json();
         const f = {
            nameEn: updated.nameEn,
            nameAr: updated.nameAr,
            visitUrl: updated.visitUrl,
         };
         setOriginalForm(f);
         setOriginalProducts(updated.products ?? products);
         setSaveSuccess(true);
      } catch (err) {
         setSaveError(err.message);
      } finally {
         setSaving(false);
      }
   }

   function handleReset() {
      setForm(originalForm);
      setProducts(originalProducts);
      setErrors({});
      setSaveError(null);
      setSaveSuccess(false);
   }

   // ─── Product search ───────────────────────────────────────────────────────

   async function handleSearch() {
      if (!searchQuery.trim()) return;
      try {
         setSearching(true);
         setSearchDone(false);
         const res = await fetch(
            `${PRODUCTS_API}?search=${encodeURIComponent(searchQuery.trim())}`,
         );
         if (!res.ok) throw new Error("Search failed");
         const data = await res.json();
         const selectedIds = new Set(products.map((p) => p.id));
         setSearchResults(data.filter((p) => !selectedIds.has(p.id)));
         setSearchDone(true);
      } catch {
         setSearchResults([]);
         setSearchDone(true);
      } finally {
         setSearching(false);
      }
   }

   function addProduct(product) {
      setProducts((prev) => [...prev, product]);
      setSearchResults((prev) => prev.filter((p) => p.id !== product.id));
      setSaveSuccess(false);
   }

   function removeProduct(productId) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setSaveSuccess(false);
   }

   function moveProduct(index, direction) {
      const next = [...products];
      const swapIdx = direction === "up" ? index - 1 : index + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return;
      [next[index], next[swapIdx]] = [next[swapIdx], next[index]];
      setProducts(next);
      setSaveSuccess(false);
   }

   // ─── Loading / error ─────────────────────────────────────────────────────

   if (loading) {
      return (
         <div className="min-h-screen bg-surface flex items-center justify-center">
            <p className="text-on-surface-variant">Loading section…</p>
         </div>
      );
   }

   if (loadError) {
      return (
         <div className="min-h-screen bg-surface flex items-center justify-center flex-col gap-4">
            <p className="text-on-surface-variant">{loadError}</p>
            <button
               onClick={fetchSection}
               className="px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-medium"
            >
               Retry
            </button>
         </div>
      );
   }

   // ─── Render ───────────────────────────────────────────────────────────────

   return (
      <div className="min-h-screen bg-surface p-6 max-w-3xl mx-auto">
         {/* Header */}
         <div className="flex items-center gap-3 mb-8">
            <button
               onClick={() => navigate("/admin/sections")}
               className="w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
            >
               ←
            </button>
            <div>
               <h1 className="text-2xl font-semibold text-on-surface">
                  Edit Section
               </h1>
               <p className="text-sm text-on-surface-variant mt-0.5">
                  {originalForm?.nameEn}
               </p>
            </div>
            {/* Dirty indicator */}
            {isDirty && (
               <span className="ml-auto text-xs font-medium px-2.5 py-1 bg-tertiary-container text-on-tertiary-container rounded-full">
                  Unsaved changes
               </span>
            )}
         </div>

         {/* Banners */}
         {saveError && (
            <div className="mb-5 px-4 py-3 bg-error-container text-on-error-container rounded-xl text-sm">
               {saveError}
            </div>
         )}
         {saveSuccess && (
            <div className="mb-5 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-xl text-sm font-medium">
               ✓ Changes saved successfully
            </div>
         )}

         {/* ── Info card ── */}
         <div className="bg-surface-container rounded-2xl p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-sm font-semibold text-on-surface uppercase tracking-wide">
                  Section Info
               </h2>
               {formDirty && (
                  <span className="text-xs text-on-surface-variant/60">
                     · modified
                  </span>
               )}
            </div>
            <div className="flex flex-col gap-4">
               <Field label="English Name" error={errors.nameEn} required>
                  <input
                     value={form.nameEn}
                     onChange={(e) => handleField("nameEn", e.target.value)}
                     placeholder="e.g. Best Sellers"
                     className={inputCls(errors.nameEn)}
                  />
               </Field>

               <Field
                  label="Arabic Name (الاسم بالعربية)"
                  error={errors.nameAr}
                  required
               >
                  <input
                     dir="rtl"
                     value={form.nameAr}
                     onChange={(e) => handleField("nameAr", e.target.value)}
                     placeholder="مثال: الأكثر مبيعاً"
                     className={inputCls(errors.nameAr)}
                  />
               </Field>

               <Field
                  label="URL Slug"
                  hint="Changing this will break existing links"
                  error={errors.visitUrl}
                  required
               >
                  <div className="flex items-center">
                     <span className="px-3 py-2 bg-surface-container-high text-on-surface-variant/60 text-sm rounded-l-xl border border-r-0 border-outline-variant">
                        /shop/
                     </span>
                     <input
                        value={form.visitUrl}
                        onChange={(e) =>
                           handleField(
                              "visitUrl",
                              e.target.value.toLowerCase().replace(/\s+/g, "-"),
                           )
                        }
                        placeholder="best-sellers"
                        className={`${inputCls(errors.visitUrl)} rounded-l-none`}
                     />
                  </div>
                  {form.visitUrl !== originalForm?.visitUrl && (
                     <div className="mt-1.5 px-3 py-1.5 bg-tertiary-container/60 text-on-tertiary-container rounded-lg text-xs">
                        ⚠️ URL changed from{" "}
                        <code className="font-mono">
                           /{originalForm.visitUrl}
                        </code>{" "}
                        → <code className="font-mono">/{form.visitUrl}</code>
                     </div>
                  )}
               </Field>
            </div>
         </div>

         {/* ── Products card ── */}
         <div className="bg-surface-container rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-sm font-semibold text-on-surface uppercase tracking-wide">
                  Products
               </h2>
               <span className="text-xs text-on-surface-variant/60">
                  {products.length} product{products.length !== 1 ? "s" : ""}
                  {productsDirty && " · modified"}
               </span>
            </div>

            {/* Search */}
            <div className="flex gap-2 mb-4">
               <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search products to add…"
                  className="flex-1 px-3 py-2 bg-surface rounded-xl border border-outline-variant text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
               />
               <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
               >
                  {searching ? "…" : "Search"}
               </button>
            </div>

            {/* Search results */}
            {searchResults.length > 0 && (
               <div className="mb-4 flex flex-col gap-1 max-h-48 overflow-y-auto rounded-xl border border-outline-variant/40 bg-surface p-2">
                  {searchResults.map((p) => (
                     <ProductSearchRow
                        key={p.id}
                        product={p}
                        onAdd={() => addProduct(p)}
                     />
                  ))}
               </div>
            )}
            {searchDone && searchResults.length === 0 && searchQuery && (
               <p className="text-sm text-on-surface-variant/60 mb-4">
                  No products found.
               </p>
            )}

            {/* Current products */}
            {products.length === 0 ? (
               <EmptyProducts />
            ) : (
               <div className="flex flex-col gap-2">
                  {products.map((p, idx) => (
                     <ProductOrderRow
                        key={p.id}
                        product={p}
                        order={idx + 1}
                        isFirst={idx === 0}
                        isLast={idx === products.length - 1}
                        isNew={!originalProducts.find((op) => op.id === p.id)}
                        onMoveUp={() => moveProduct(idx, "up")}
                        onMoveDown={() => moveProduct(idx, "down")}
                        onRemove={() => removeProduct(p.id)}
                     />
                  ))}
               </div>
            )}

            {/* Removed products notice */}
            {(() => {
               const removed = originalProducts.filter(
                  (op) => !products.find((p) => p.id === op.id),
               );
               return removed.length > 0 ? (
                  <div className="mt-3 px-3 py-2 bg-error-container/40 text-on-error-container rounded-xl text-xs">
                     {removed.length} product{removed.length > 1 ? "s" : ""}{" "}
                     removed: {removed.map((p) => p.nameEn).join(", ")}
                  </div>
               ) : null;
            })()}
         </div>

         {/* Footer actions */}
         <div className="flex gap-3 justify-between">
            <button
               onClick={handleReset}
               disabled={!isDirty || saving}
               className="px-4 py-2.5 text-sm font-medium text-on-surface-variant border border-outline-variant rounded-xl hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
               Reset Changes
            </button>
            <div className="flex gap-3">
               <button
                  onClick={() => navigate("/admin/sections")}
                  className="px-5 py-2.5 text-sm font-medium text-on-surface-variant border border-outline-variant rounded-xl hover:bg-surface-container transition-colors"
               >
                  Cancel
               </button>
               <button
                  onClick={handleSave}
                  disabled={saving || !isDirty}
                  className="px-6 py-2.5 text-sm font-medium bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {saving ? "Saving…" : "Save Changes"}
               </button>
            </div>
         </div>
      </div>
   );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Field({ label, hint, error, required, children }) {
   return (
      <div>
         <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
            {label} {required && <span className="text-error">*</span>}
         </label>
         {children}
         {hint && !error && (
            <p className="text-xs text-on-surface-variant/50 mt-1">{hint}</p>
         )}
         {error && <p className="text-xs text-error mt-1">{error}</p>}
      </div>
   );
}

function ProductSearchRow({ product, onAdd }) {
   return (
      <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-surface-container transition-colors">
         {product.imageUrl ? (
            <img
               src={product.imageUrl}
               alt={product.nameEn}
               className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
            />
         ) : (
            <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-xs flex-shrink-0">
               🌸
            </div>
         )}
         <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-on-surface truncate">
               {product.nameEn}
            </p>
            {product.nameAr && (
               <p
                  className="text-xs text-on-surface-variant truncate"
                  dir="rtl"
               >
                  {product.nameAr}
               </p>
            )}
         </div>
         <button
            onClick={onAdd}
            className="px-2.5 py-1 text-xs font-medium bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0"
         >
            + Add
         </button>
      </div>
   );
}

function ProductOrderRow({
   product,
   order,
   isFirst,
   isLast,
   isNew,
   onMoveUp,
   onMoveDown,
   onRemove,
}) {
   return (
      <div
         className={[
            "flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-colors",
            isNew
               ? "bg-secondary-container/30 border-secondary/30"
               : "bg-surface border-outline-variant/30",
         ].join(" ")}
      >
         <span className="w-6 text-center text-xs font-bold text-on-surface-variant/50 flex-shrink-0">
            {order}
         </span>
         {product.imageUrl ? (
            <img
               src={product.imageUrl}
               alt={product.nameEn}
               className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
            />
         ) : (
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-xs flex-shrink-0">
               🌸
            </div>
         )}
         <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
               <p className="text-sm font-medium text-on-surface truncate">
                  {product.nameEn}
               </p>
               {isNew && (
                  <span className="text-xs font-medium px-1.5 py-0.5 bg-secondary text-on-secondary rounded-full flex-shrink-0">
                     New
                  </span>
               )}
            </div>
         </div>
         {/* Reorder */}
         <div className="flex gap-1 flex-shrink-0">
            <button
               onClick={onMoveUp}
               disabled={isFirst}
               className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors text-xs"
            >
               ↑
            </button>
            <button
               onClick={onMoveDown}
               disabled={isLast}
               className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors text-xs"
            >
               ↓
            </button>
            <button
               onClick={onRemove}
               className="w-7 h-7 flex items-center justify-center rounded-lg text-error hover:bg-error/10 transition-colors text-xs"
            >
               ✕
            </button>
         </div>
      </div>
   );
}

function EmptyProducts() {
   return (
      <div className="text-center py-8 text-on-surface-variant/50 text-sm border-2 border-dashed border-outline-variant/40 rounded-xl">
         <p className="text-2xl mb-2">🛒</p>
         Search and add products above
      </div>
   );
}

function inputCls(error) {
   return [
      "w-full px-3 py-2 bg-surface rounded-xl border text-sm text-on-surface",
      "placeholder:text-on-surface-variant/50 focus:outline-none transition-colors",
      error
         ? "border-error focus:border-error"
         : "border-outline-variant focus:border-primary",
   ].join(" ");
}
