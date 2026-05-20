import { Routes, Route } from "react-router";

import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import Home from "./pages/dashboard/Home";

import Products from "./pages/products/Products";
import CreateProduct from "./pages/products/CreateProduct";
import UpdateProduct from "./pages/products/UpdateProduct";

import Occasions from "./pages/occasions/Occasions";
import CreateOccasion from "./pages/occasions/CreateOccasion";
import UpdateOccasion from "./pages/occasions/UpdateOccasion";

import Categories from "./pages/categories/Categories";
import CreateCategory from "./pages/categories/CreateCategory";
import UpdateCategory from "./pages/categories/UpdateCategory";

import Orders from "./pages/orders/Orders";
import UpdateOrder from "./pages/orders/UpdateOrder";

import Users from "./pages/Users/Users";
import SectionManager from "./pages/sections/SectionManager";
import Colors from "./pages/colors/Colors";

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

            <Route path="/occasions">
               <Route index element={<Occasions />} />
               <Route path="create-occasion" element={<CreateOccasion />} />
               <Route
                  path="update-occasion/:occasionId"
                  element={<UpdateOccasion />}
               />
            </Route>

            <Route path="/categories">
               <Route index element={<Categories />} />
               <Route path="create-category" element={<CreateCategory />} />
               <Route
                  path="update-category/:categoryId"
                  element={<UpdateCategory />}
               />
            </Route>

            <Route path="/orders">
               <Route index element={<Orders />} />
               <Route path="update-order/:orderId" element={<UpdateOrder />} />
            </Route>

            <Route path="/users">
               <Route index element={<Users />} />
               {/* <Route path=":userId" element={<UserDetails />} /> */}
            </Route>

            <Route path="/sections">
               <Route index element={<SectionManager />} />
            </Route>

            <Route path="/colors">
               <Route index element={<Colors />} />
            </Route>
         </Route>
         {/* 
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} /> */}
      </Routes>
   );
}

export default App;
