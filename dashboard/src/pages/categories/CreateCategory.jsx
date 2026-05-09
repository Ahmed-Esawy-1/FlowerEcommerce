import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../../api/axios";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

const CreateCategory = () => {
  const [category, setCategory] = useState({
    name: "",
    image: null,
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    console.log(category);
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({
      ...category,
      [name]: value,
    });
  };

  // Handle Images
  const handleFileChange = (e) => {
    const file = Array.from(e.target.files)[0];
    setCategory((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const removeImage = () => {
    setCategory((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // Send Form To backend
  async function handleFormSubmit(e) {
    console.log(category);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", category.name);
      if (category.image) {
        formData.append("image", category.image);
      }

      await api.post("categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product saved ✅");

      setCategory({
        name: "",
        image: null,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen ml-[280px] p-8 overflow-y-auto">
      {/*  Breadcrumbs & Header  */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 mb-2 text-slate-500 uppercase tracking-wide">
            <Link
              to="/Categories"
              className="text-xl font-bold hover:text-indigo-600 tracking-tighter"
            >
              Categories
            </Link>
            <ChevronRightIcon className="!text-xs" />
            <span className="text-indigo-600 font-bold">Create New</span>
          </nav>
          <h2 className="text-on-surface">Create New Category</h2>
          <p className="text-slate-500 mt-1">
            Configure your category details and inventory settings.
          </p>
        </div>
      </div>
      {/*  Form Layout: Bento Grid Style  */}
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-lg">
            <div className="col-span-2 mb-4">
              <label className="block text-slate-700 mb-2">
                Categgoty Name
              </label>
              <input
                className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                placeholder="e.g. Premium Wireless Headphones"
                type="text"
                name="name"
                value={category.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-slate-700 mb-2">image</label>
              <input
                className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {category.image && category.image instanceof File && (
                <div className="flex gap-3 mt-4 flex-wrap mb-4">
                  <div className="max-h-60 aspect-[6/7] relative">
                    <img
                      src={URL.createObjectURL(category.image)}
                      alt="preview"
                      className="w-full h-full object-cover border rounded-lg"
                    />
                    <CloseIcon
                      className="absolute top-2 right-2 bg-black p-2 rounded-full text-error font-black cursor-pointer"
                      fontSize="large"
                      onClick={() => removeImage()}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setCategory({
                    name: "",
                    image: null,
                  })
                }
                className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold  border border-slate-200 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
              >
                <SaveIcon className="!text-sm" />
                Save Product
              </button>
            </div>
          </div>
        </section>
      </form>
    </main>
  );
};

export default CreateCategory;
