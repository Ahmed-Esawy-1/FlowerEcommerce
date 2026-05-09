import { Routes, Route } from "react-router";

import Login from "./pages/Login";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/dashboard/Home";

import Products from "./pages/products/Products";
import CreateProduct from "./pages/products/CreateProduct";
import UpdateProduct from "./pages/products/UpdateProduct";

import Categories from "./pages/categories/Categories";
import CreateCategory from "./pages/categories/CreateCategory";
import UpdateCategory from "./pages/categories/UpdateCategory";

import Users from "./pages/Users/Users";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Home />} />

        <Route path="/products">
          <Route index element={<Products />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="update-product/:productId" element={<UpdateProduct />} />
        </Route>

        <Route path="/categories">
          <Route index element={<Categories />} />
          <Route path="create-category" element={<CreateCategory />} />
          <Route
            path="update-category/:categoryId"
            element={<UpdateCategory />}
          />
        </Route>

        <Route path="/users">
          <Route index element={<Users />} />
          {/* <Route path=":userId" element={<UserDetails />} /> */}
        </Route>
      </Route>
      {/* 
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
