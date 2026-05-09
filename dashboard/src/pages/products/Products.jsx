import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../../api/axios";
import DeletedModal from "./DeletedModal";

import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import PaymentsIcon from "@mui/icons-material/Payments";
import CategoryIcon from "@mui/icons-material/Category";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDeletedModal, setOpenDeletedModal] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);
  console.log(allProducts);

  // Pagination
  const productsPerPage = 3;
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  const maxVisiblePages = 4;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = allProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  // All Products
  useEffect(() => {
    async function getProducts() {
      try {
        const response = await api.get("products");
        const productsData = response.data;
        setAllProducts(productsData);
      } catch (error) {
        console.log(error);
      }
    }
    getProducts();
  }, []);

  // Delete Product
  async function handleDeleteProduct() {
    try {
      await api.delete(`products/${deleteProduct.id}`);

      setAllProducts((prev) => {
        const updated = prev.filter((p) => p.id !== deleteProduct.id);

        const newTotalPages = Math.ceil(updated.length / productsPerPage);

        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        }

        return updated;
      });
      setDeleteProduct({});

      setOpenDeletedModal(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="min-h-screen ml-[280px] p-8 bg-surface">
      {/* header */}
      <section className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-on-background text-lg font-bold">
            Products Inventory
          </h2>
          <p className="text-secondary text-sm">
            Manage your enterprise catalog, track stock levels, and update
            pricing.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/products/create-product"
            className="bg-primary px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all"
          >
            Create Product
          </Link>
        </div>
      </section>
      {/* Cards*/}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <InventoryIcon className="text-indigo-600" />
            </div>
            <span className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-secondary uppercase">Total Products</p>
          <p className="text-on-surface mt-1">1,284</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <WarningIcon className="text-orange-600" />
            </div>
            <span className="text-orange-600 text-xs font-semibold bg-orange-50 px-2 py-1 rounded-full">
              8 items
            </span>
          </div>
          <p className="text-secondary uppercase">Low Stock</p>
          <p className="text-on-surface mt-1">42</p>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <PaymentsIcon className="text-emerald-600" />
            </div>
          </div>
          <p className="text-secondary uppercase">Inventory Value</p>
          <p className="text-on-surface mt-1">$452.9k</p>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <CategoryIcon className="text-purple-600" />
            </div>
          </div>
          <p className="text-secondary uppercase">Active Categories</p>
          <p className="text-on-surface mt-1">24</p>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
              <FilterListIcon className="!text-sm" />
              All Categories
              <KeyboardArrowDownIcon className="!text-xs" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
              Status: Active
              <KeyboardArrowDownIcon className="!text-xs" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-500 mr-2">
              Displaying 1-10 of 1,284
            </p>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden">
              <button className="p-2 text-slate-400 border-r border-slate-200 hover:bg-slate-50">
                <ChevronLeftIcon className="!text-sm" />
              </button>
              <button className="p-2 text-slate-400 hover:bg-slate-50">
                <ChevronRightIcon className="!text-sm" />
              </button>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4">
                  <input
                    className="text-indigo-600 border-slate-300  rounded focus:ring-indigo-500"
                    type="checkbox"
                  />
                </th>
                <th className="px-6 py-4 text-slate-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-4 text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Products */}
              {currentProducts &&
                currentProducts.map((product) => (
                  <tr
                    className="hover:bg-slate-50 transition-colors"
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
                          src={`http://localhost:8080${product.images[0]?.url}`}
                        />
                        <div>
                          <p className="text-on-surface text-sm font-semibold">
                            {product.title}
                          </p>
                          {product.category && (
                            <p className="text-slate-400 text-xs">
                              {product.category.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="line-clamp-1">{product.description}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-900 text-sm font-semibold">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/products/update-product/${product.id}`}
                        className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        <EditIcon />
                      </Link>
                      <button
                        className="ml-2 text-slate-400 hover:text-error transition-colors cursor-pointer"
                        onClick={() => {
                          setDeleteProduct(product);
                          setOpenDeletedModal(true);
                        }}
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* <!-- Pagination Footer --> */}

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing page 1 of 129</p>
          <div className="flex items-center gap-1">
            {startPage > 1 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-3 py-1 text-slate-600 text-sm font-medium border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                >
                  1
                </button>
                {startPage > 2 && <span>...</span>}
              </>
            )}

            {visiblePages.map((page, i) => (
              <button
                key={i}
                className={`px-3 py-1 text-sm font-medium border rounded ${currentPage == page ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-50 border-slate-200 transition-colors"}`}
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
                  className="px-3 py-1 text-slate-600 text-sm font-medium border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Modal */}
      {openDeletedModal && deleteProduct && (
        <DeletedModal
          isOpen={openDeletedModal}
          productName={deleteProduct.title}
          onClose={() => setOpenDeletedModal(false)}
          onConfirm={handleDeleteProduct}
        />
      )}
    </main>
  );
};

export default Products;
