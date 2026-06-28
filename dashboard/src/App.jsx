import { Routes, Route } from "react-router";

import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import Home from "./pages/dashboard/Home";

import Products from "./pages/products/Products";
import CreateProduct from "./pages/products/CreateProduct";
import UpdateProduct from "./pages/products/UpdateProduct";

import Occasions from "./pages/occasions/Occasions";

import Categories from "./pages/categories/Categories";

import Colors from "./pages/colors/Colors";

import Orders from "./pages/orders/Orders";
import UpdateOrder from "./pages/orders/UpdateOrder";

import Sections from "./pages/sections/Sections";
import CreateSection from "./pages/sections/CreateSection";
import EditSection from "./pages/sections/EditSection";

import Users from "./pages/Users/Users";

import TrashPage from "./pages/TrashPage";

function App() {
   return (
      <Routes>
         <Route path="/" element={<Login />} />

         <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Home />} />

            <Route path="/products">
               <Route index element={<Products />} />
               <Route path="create-product" element={<CreateProduct />} />
               <Route
                  path="update-product/:productId"
                  element={<UpdateProduct />}
               />
            </Route>

            <Route path="/occasions" element={<Occasions />} />
            <Route path="/categories" element={<Categories />} />

            <Route path="/orders">
               <Route index element={<Orders />} />
               <Route path="update-order/:orderId" element={<UpdateOrder />} />
            </Route>

            <Route path="/users">
               <Route index element={<Users />} />
            </Route>

            <Route path="/sections">
               <Route index element={<Sections />} />
               <Route path="create" element={<CreateSection />} />
               <Route path="edit/:sectionId" element={<EditSection />} />
            </Route>

            <Route path="/colors">
               <Route index element={<Colors />} />
            </Route>

            {/* Trash */}
            <Route
               path="/products/trash"
               element={
                  <TrashPage
                     title="Products Trash"
                     endpoint="/admin/products/trash"
                     restoreEndpoint="/admin/products"
                     deleteEndpoint="/admin/products"
                     type="product"
                  />
               }
            />

            <Route
               path="/categories/trash"
               element={
                  <TrashPage
                     title="Categories Trash"
                     endpoint="/categories/trash"
                     restoreEndpoint="/categories"
                     deleteEndpoint="/categories"
                     type="category"
                  />
               }
            />

            <Route
               path="/occasions/trash"
               element={
                  <TrashPage
                     title="Occasions Trash"
                     endpoint="/occasions/trash"
                     restoreEndpoint="/occasions"
                     deleteEndpoint="/occasions"
                     type="occasion"
                  />
               }
            />
         </Route>

         {/* 
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} /> */}
      </Routes>
   );
}

export default App;
