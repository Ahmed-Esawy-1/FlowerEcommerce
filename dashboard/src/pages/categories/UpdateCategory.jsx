import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../../api/axios";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const UpdateCategory = () => {
  const { categoryId } = useParams();

  const [category, setCategory] = useState({
    name: "",
    image: null,
  });

  const [existingImage, setExistingImage] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    console.log("category => ", category);
  }, [category]);

  // Get Category Info
  useEffect(() => {
    async function getCategoryById() {
      try {
        const response = await api.get("categories/" + categoryId);
        const data = response.data;
        console.log(data);
        setCategory({
          name: data.name,
          image: data.imageUrl,
        });

        if (data.imageUrl) {
          setExistingImage(`http://localhost:8080${data.imageUrl}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getCategoryById();
  }, [categoryId]);

  // Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image
  const handleFileChange = (e) => {
    const file = Array.from(e.target.files)[0];
    setCategory((prev) => ({
      ...prev,
      image: file,
    }));
    setNewImage(file);
  };
  const removeNewImage = (_) => setNewImage(null);

  // Form
  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", category.name);

      if (category.image) {
        formData.append("image", category.image);
      }

      await api.put("categories/" + categoryId, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product updated ✅");
    } catch (error) {
      console.error(error);
      alert("Error " + error);
    }
  }

  return (
    <main className="min-h-screen ml-[280px] py-2 px-6 overflow-y-auto">
      {/*  Breadcrumbs & Header  */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 mb-2 text-slate-500 uppercase tracking-wide">
            <Link
              to="/categories"
              className="text-xl font-bold hover:text-indigo-600 tracking-tighter"
              href="#"
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
            <div className="col-span-2">
              <label className="block text-slate-700 mb-2">Category Name</label>
              <input
                className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                placeholder="e.g. Premium Wireless Headphones"
                type="text"
                name="name"
                value={category.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-700 mb-2">Image</label>
              <input
                className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="flex gap-5 mt-4 flex-wrap mb-5">
                {existingImage ? (
                  <div className="flex items-center gap-3">
                    <p>Current Image:</p>
                    <div className="max-h-60 aspect-[6/7] relative">
                      <img
                        src={existingImage}
                        alt="preview"
                        className="w-full h-full object-cover border rounded-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="mb-4">Not Exist Image</p>
                )}
                {newImage && newImage instanceof File && (
                  <div className="flex items-center gap-3 flex-wrap">
                    <p>New Image:</p>
                    <div className="max-h-60 aspect-[6/7] relative">
                      <img
                        src={URL.createObjectURL(newImage)}
                        alt="preview"
                        className="w-full h-full object-cover border rounded-lg"
                      />
                      <CloseIcon
                        className="absolute top-2 right-2 bg-black p-2 rounded-full text-error font-black cursor-pointer"
                        fontSize="large"
                        onClick={removeNewImage}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setCategory({
                    title: "",
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
                Save Category
              </button>
            </div>
          </div>
        </section>
      </form>
    </main>
  );
};

export default UpdateCategory;
