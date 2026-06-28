import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import api from "../api/axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Loading from "./Loading";

const MainLayout = () => {
   const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

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

   // MainLayout.jsx
   useEffect(() => {
      if (sidebarOpen && window.innerWidth < 1024) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "";
      }

      return () => {
         document.body.style.overflow = "";
      };
   }, [sidebarOpen]);

   // When resize window
   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth >= 1024) {
            setSidebarOpen(true);
         } else {
            setSidebarOpen(false);
         }
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   if (loading) return <Loading />;

   return (
      <div className="bg-background text-on-background min-h-screen">
         <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

         <Header onMenuClick={() => setSidebarOpen(true)} />
         <main className="min-h-screen p-4 md:p-8 lg:ltr:ml-[280px] lg:rtl:mr-[280px]">
            <Outlet />
         </main>
      </div>
   );
};;

export default MainLayout;
