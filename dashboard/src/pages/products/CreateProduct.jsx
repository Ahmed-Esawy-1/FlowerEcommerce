import React, { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { Link } from "react-router";
const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/categories",
        );
        setCategories(response.data);

        if (response.data.length > 0) {
          setProduct((prev) => ({
            ...prev,
            categoryId: response.data[0].id.toString(),
          }));
        }
      } catch (error) {
        console.log(error);
      }
    }
    getCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  // Handle Images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prev) => {
      return { ...prev, images: [...prev.images, ...files] };
    });
  };

  useEffect(() => {
    const urls = product.images.map((file) => URL.createObjectURL(file));

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [product.images]);

  const removeImage = (indexToRemove) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));
  };

  // Send Form To backend
  async function handleFormSubmit(e) {
    console.log(product);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("categoryId", product.categoryId);
      product.images.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post("http://localhost:8080/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product saved ✅");

      setProduct({
        name: "",
        price: "",
        description: "",
        images: [],
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
              to="/products"
              className="text-xl font-bold hover:text-indigo-600 tracking-tighter"
            >
              Products
            </Link>
            <ChevronRightIcon className="!text-xs" />
            <span className="text-indigo-600 font-bold">Create New</span>
          </nav>
          <h2 className="text-on-surface">Create New Product</h2>
          <p className="text-slate-500 mt-1">
            Configure your product details and inventory settings.
          </p>
        </div>
      </div>
      {/*  Form Layout: Bento Grid Style  */}
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-lg">
            <div className="col-span-2">
              <label className="block text-slate-700 mb-2">Product Name</label>
              <input
                className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                placeholder="e.g. Premium Wireless Headphones"
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-700 mb-2">Price</label>
              <input
                className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                placeholder="$"
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-700 mb-2">Category</label>
              <select
                className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                name="categoryId"
                value={product.categoryId}
                onChange={handleChange}
              >
                {categories.map((cat, i) => (
                  <option value={cat.id} key={i}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-slate-700 mb-2">images</label>
              <input
                className="w-full px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              {product.images.length > 0 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {previews.map((src, i) => (
                    <div className="max-h-60 aspect-[6/7] relative" key={i}>
                      <img
                        src={src}
                        alt="preview"
                        className="w-full h-full object-cover border rounded-lg"
                      />
                      <CloseIcon
                        className="absolute top-2 right-2 bg-black p-2 rounded-full text-error font-black cursor-pointer"
                        fontSize="large"
                        onClick={() => removeImage(i)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-slate-700 mb-2">Description</label>
              <textarea
                className="w-full min-h-20 px-4 py-2.5 outline-none border border-slate-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                placeholder="Briefly describe the product's features and benefits..."
                rows="4"
                value={product.description}
                name="description"
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setProduct({
                    name: "",
                    price: "",
                    description: "",
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

export default CreateProduct;
