import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

import api from "../api/axios";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = () => {
   let navigate = useNavigate();
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      async function checkAuth() {
         try {
            const response = await api.get("/auth/me");
            const { user, dashboardAccess } = response.data;

            if (!dashboardAccess) {
               navigate("/");
            } else {
               const stored = localStorage.getItem("userLogin")
                  ? "localStorage"
                  : "sessionStorage";

               window[stored].setItem("userLogin", JSON.stringify(user));
               setLoading(false);
            }
         } catch (error) {
            localStorage.removeItem("userLogin");
            sessionStorage.removeItem("userLogin");
            navigate("/");
         }
      }

      checkAuth();
   }, []);

   if (loading) {
      return (
         <div className="h-screen flex items-center justify-center">
            Loading...
         </div>
      );
   }

   return (
      <div className="bg-background text-on-background">
         <Sidebar />
         <Header />
         <main className="min-h-screen ml-[280px] p-8">
            <Outlet />
         </main>
      </div>
   );
};

export default MainLayout;
