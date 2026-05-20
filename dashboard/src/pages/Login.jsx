import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";
import InventoryIcon from "@mui/icons-material/Inventory";
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { appBarClasses } from "@mui/material/AppBar";

const Login = () => {
   const navigate = useNavigate();
   const [userInfo, setUserInfo] = useState({
      email: "",
      password: "",
      rememberMe: false,
   });
   const [error, setError] = useState("");

   function handleInputChange(e) {
      const { name, value, type, checked } = e.target;
      setUserInfo((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }));
   }

   async function handleFormSubmit(e) {
      e.preventDefault();

      const data = {
         email: userInfo.email.trim(),
         password: userInfo.password.trim(),
         rememberMe: userInfo.rememberMe,
      };

      try {
         const response = await api.post("/auth/login", data);
         const user = response.data;

         if (user.role === "USER") {
            setError(() => "Access denied. Admins and Managers only.");
            alert("Access denied. Admins and Managers only.");
            return;
         }

         if (userInfo.rememberMe) {
            localStorage.setItem("userLogin", JSON.stringify(user));
         } else {
            sessionStorage.setItem("userLogin", JSON.stringify(user));
         }

         navigate("/dashboard");
      } catch (error) {
         const msg = err.response?.data || "Invalid email or password";
         setError(msg);
         alert(msg);
      }
   }

   return (
      <div className="bg-surface-container-low min-h-screen flex items-center justify-center p-6">
         <div className="w-full max-w-[440px]">
            <div className="flex flex-col items-center mb-8">
               <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-lg shadow-primary/20 mb-4">
                  <InventoryIcon className="text-on-primary !text-[28px]" />
               </div>
               <h1 className="text-on-surface text-2xl font-bold tracking-wider">
                  Flow Dashboard
               </h1>
               <p className="text-on-surface-variant mt-1">
                  Enterprise Asset Management
               </p>
            </div>
            {/*  Login Card  */}
            <div className="bg-surface-container-lowest p-8 border border-outline-variant rounded-xl shadow-sm">
               <div className="mb-6">
                  <h2 className="text-on-surface text-2xl/6 font-bold tracking-wider">
                     Sign In
                  </h2>
                  <p className="text-on-surface-variant text-sm/6 tracking-wide">
                     Enter your credentials to access your dashboard
                  </p>
               </div>
               <form className="space-y-6" onSubmit={handleFormSubmit}>
                  {/*  Email  */}
                  <div className="space-y-1">
                     <label
                        className="text-on-surface-variant text-sm/6"
                        htmlFor="email"
                     >
                        Email Address
                     </label>
                     <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
                        <input
                           className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest text-on-surface text-sm/6 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
                           id="email"
                           name="email"
                           placeholder="example@gmail.com"
                           type="email"
                           value={userInfo.email}
                           onChange={handleInputChange}
                        />
                     </div>
                  </div>
                  {/*  Password */}
                  <div className="space-y-1">
                     <div className="flex justify-between items-center">
                        <label
                           className="text-on-surface-variant text-sm leading-6"
                           htmlFor="password"
                        >
                           Password
                        </label>
                        <a
                           className="text-primary font-semibold hover:underline"
                           href="#"
                        >
                           Forgot password?
                        </a>
                     </div>
                     <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline !text-[20px]" />
                        <input
                           className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest text-on-surface text-sm/6 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
                           id="password"
                           name="password"
                           placeholder="********"
                           type="password"
                           value={userInfo.password}
                           onChange={handleInputChange}
                        />
                     </div>
                  </div>
                  {/*  Remember Me  */}
                  <div className="flex items-center gap-1">
                     <input
                        className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                        id="remember"
                        name="rememberMe"
                        type="checkbox"
                        checked={userInfo.rememberMe}
                        onChange={handleInputChange}
                     />
                     <label
                        className="text-on-surface leading-7 tracking-wide"
                        htmlFor="rememberMe"
                     >
                        Remember me
                     </label>
                  </div>
                  <button
                     className="flex items-center justify-center gap-1 w-full py-3 px-4 bg-primary hover:bg-primary-container text-on-primary rounded-lg shadow-md shadow-primary/10 active:scale-[0.98] transition-all"
                     type="submit"
                  >
                     Sign In
                     <ArrowForwardIcon className="!text-[20px]" />
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
};

export default Login;
