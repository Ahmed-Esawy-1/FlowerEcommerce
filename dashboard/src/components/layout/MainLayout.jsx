import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import api from "../../api/axios";
import Sidebar from "../Sidebar";
import Header from "../Header";
const MainLayout = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await api.get("/users/me");
        setLoading(false);
      } catch (error) {
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
      <Outlet />
    </div>
  );
};

export default MainLayout;
