import { NavLink, useNavigate } from "react-router";
import api from "../api/axios";
import { BASE_URL } from "../api/config";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";

const links = [
   { title: "Home", path: "/dashboard", icon: DashboardIcon },
   { title: "Products", path: "/products", icon: Inventory2Icon },
   { title: "Occasions", path: "/occasions", icon: CategoryIcon },
   { title: "Categories", path: "/categories", icon: CategoryIcon },
   { title: "Orders", path: "/orders", icon: CategoryIcon },
   { title: "Users", path: "/users", icon: GroupIcon },
   { title: "Colors", path: "/colors", icon: GroupIcon },
   { title: "Sections", path: "/sections", icon: GroupIcon },
];

const Sidebar = () => {
   const navigate = useNavigate();
   const user =
      JSON.parse(localStorage.getItem("userLogin")) ||
      JSON.parse(sessionStorage.getItem("userLogin")) ||
      {};

   async function handleLogout(params) {
      try {
         console.log(await api.post("/auth/logout"));
      } catch (error) {
         console.log(error);
      } finally {
         localStorage.removeItem("userLogin");
         sessionStorage.removeItem("userLogin");
         navigate("/");
      }
   }

   return (
      <aside className="fixed left-0 top-0 z-50 h-full flex flex-col bg-surface-container w-[280px] border-r border-surface-variant shadow-sm">
         <div className="px-6 py-8">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 flex items-center justify-center text-white bg-primary-container rounded-lg">
                  <Inventory2Icon />
               </div>
               <div>
                  <h1 className="text-primary tracking-tight">Inventory Pro</h1>
                  <p className="text-on-surface-variant">Enterprise Admin</p>
               </div>
            </div>
            <nav className="space-y-1">
               {links.map((link, i) => {
                  const Icon = link.icon;
                  return (
                     <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                           `page-label flex items-center gap-3 px-4 py-3 ${isActive ? "border-l-4 border-primary bg-primary-container text-on-primary-container transition-all duration-200 ease-in-out" : "text-on-surface-variant hover:bg-surface-variant rounded-xl transition-colors"}`
                        }
                        key={i}
                     >
                        <Icon fontSize="small" />
                        <span className="">{link.title}</span>
                     </NavLink>
                  );
               })}
            </nav>
         </div>
         <div className="mt-auto px-6 py-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
               <img
                  alt="User Profile"
                  className="w-10 h-10 bg-slate-200 rounded-full"
                  src={
                     user?.imageUrl
                        ? `${BASE_URL}${user.imageUrl}`
                        : "https://lh3.googleusercontent.com/aida-public/AB6AXuDOTZDSwN1IvFnDOFgkzZfSEuAZ-RWrXJp2IKEzxeDa502zL8ryIvZc_efmUQ-1Y6iRpvEGFyrfs6HsDpUTDljvc5qKLsu4BVyywU9FCDEVoQ95X87BPB4pVuFqCXSa3_80G393hVTrN91CTblf7ye_gFWo91Pum92Pyk2qtxl2WsUEbtCd6n17GHakXwTZVr1hd4xieJsKWlvPM4_CUTe_6xYmsQAQvCYGTr7OJ531pRrFAq0HtP5msz4Py1gziBnL--WkyG1s8RU"
                  }
               />
               <div>
                  <p className="text-on-surface">{user?.userName}</p>
                  <p className="text-secondary text-[10px]">
                     System {user?.role}
                  </p>
               </div>
               <button
                  className="ml-auto text-slate-400 hover:text-primary transition-colors"
                  onClick={handleLogout}
               >
                  <LogoutIcon />
               </button>
            </div>
         </div>
      </aside>
   );
};

export default Sidebar;
