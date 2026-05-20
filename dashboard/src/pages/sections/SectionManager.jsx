import { useState, useEffect } from "react";

const API = "http://localhost:8080/api/sections";

export default function SectionManager() {
   const [sections, setSections] = useState([]);
   const [newName, setNewName] = useState("");
   const [productInputs, setProductInputs] = useState({});

   const load = () =>
      fetch(API)
         .then((r) => r.json())
         .then(setSections);

   useEffect(() => {
      load();
   }, []);

   const createSection = async () => {
      if (!newName.trim()) return;
      await fetch(API, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ name: newName, isActive: true }),
      });
      setNewName("");
      load();
   };

   const toggleActive = async (section) => {
      await fetch(`${API}/${section.id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            name: section.name,
            isActive: !section.isActive,
         }),
      });
      load();
   };

   const deleteSection = async (id) => {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      load();
   };

   const addProduct = async (sectionId) => {
      const productId = productInputs[sectionId];
      if (!productId) return;
      const res = await fetch(`${API}/${sectionId}/products`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ productId: Number(productId) }),
      });
      if (!res.ok) {
         const err = await res.text();
         alert(err);
      }
      setProductInputs((p) => ({ ...p, [sectionId]: "" }));
      load();
   };

   const removeProduct = async (sectionId, productId) => {
      await fetch(`${API}/${sectionId}/products/${productId}`, {
         method: "DELETE",
      });
      load();
   };

   return (
      <div
         style={{
            maxWidth: 700,
            margin: "2rem auto",
            fontFamily: "sans-serif",
         }}
      >
         <h2>Shop Sections</h2>

         <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <input
               value={newName}
               onChange={(e) => setNewName(e.target.value)}
               placeholder="New section name"
               style={{ flex: 1, padding: 8 }}
            />
            <button onClick={createSection}>Add Section</button>
         </div>

         {sections.map((section) => (
            <div
               key={section.id}
               style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
               }}
            >
               <div
                  style={{
                     display: "flex",
                     justifyContent: "space-between",
                     alignItems: "center",
                  }}
               >
                  <strong>{section.name}</strong>
                  <div style={{ display: "flex", gap: 8 }}>
                     <button onClick={() => toggleActive(section)}>
                        {section.isActive ? "🟢 Active" : "🔴 Hidden"}
                     </button>
                     <button
                        onClick={() => deleteSection(section.id)}
                        style={{ color: "red" }}
                     >
                        Delete
                     </button>
                  </div>
               </div>

               <div style={{ marginTop: 12 }}>
                  <strong>Products ({section.products.length}/15):</strong>
                  <ul>
                     {section.products.map((p) => (
                        <li key={p.id}>
                           Product #{p.productId} (order: {p.sortOrder})
                           <button
                              onClick={() =>
                                 removeProduct(section.id, p.productId)
                              }
                              style={{
                                 marginLeft: 8,
                                 color: "red",
                                 fontSize: 12,
                              }}
                           >
                              ✕
                           </button>
                        </li>
                     ))}
                  </ul>

                  {section.products.length < 15 && (
                     <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <input
                           type="number"
                           placeholder="Product ID"
                           value={productInputs[section.id] || ""}
                           onChange={(e) =>
                              setProductInputs((p) => ({
                                 ...p,
                                 [section.id]: e.target.value,
                              }))
                           }
                           style={{ width: 120, padding: 6 }}
                        />
                        <button onClick={() => addProduct(section.id)}>
                           Add Product
                        </button>
                     </div>
                  )}
               </div>
            </div>
         ))}
      </div>
   );
}
