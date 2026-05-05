import { useState } from "react";

import { Routes, Route } from "react-router";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Home from "./pages/dashboard/Home";
import Products from "./pages/products/Products";
import CreateProduct from "./pages/products/CreateProduct";
import UpdateProduct from "./pages/products/UpdateProduct";
import Users from "./pages/Users/Users";
import axios from "axios";

function App() {
  axios.defaults.withCredentials = true;

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
        {/* 
        <Route path="/categories">
          <Route index element={<Categories />} />
        </Route>

        <Route path="/posts">
          <Route index element={<Posts />} />
          <Route path=":postId" element={<PostDetails />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="update-post" element={<UpdatePost />} />
        </Route>*/}

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
