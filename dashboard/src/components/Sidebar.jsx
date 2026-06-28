import { NavLink, useNavigate } from "react-router";
import api from "../api/axios";
import { BASE_URL } from "../api/config";
import { useTranslation } from "react-i18next";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";

const links = [
   { title: "home", path: "/dashboard", icon: DashboardIcon },
   { title: "orders", path: "/orders", icon: CategoryIcon },
   { title: "products", path: "/products", icon: Inventory2Icon },
   { title: "occasions", path: "/occasions", icon: CategoryIcon },
   { title: "categories", path: "/categories", icon: CategoryIcon },
   { title: "colors", path: "/colors", icon: GroupIcon },
   { title: "sections", path: "/sections", icon: GroupIcon },
   { title: "users", path: "/users", icon: GroupIcon },
];

const Sidebar = ({ open, onClose }) => {
   const { t } = useTranslation();
   const navigate = useNavigate();
   const user =
      JSON.parse(localStorage.getItem("userLogin")) ||
      JSON.parse(sessionStorage.getItem("userLogin")) ||
      {};

   async function handleLogout() {
      try {
         await api.post("/auth/logout");
      } catch (error) {
         console.log(error);
      } finally {
         localStorage.removeItem("userLogin");
         sessionStorage.removeItem("userLogin");
         navigate("/");
      }
   }

   const handleLinkClick = () => {
      if (window.innerWidth < 1024) {
         onClose();
      }
   };

   return (
      <>
         {/* Overlay - ( Mobile ) */}
         {open && (
            <div
               className="fixed inset-0 z-40 bg-black/40 lg:hidden"
               onClick={onClose}
            />
         )}

         <aside
            className={`
               fixed ltr:left-0 rtl:right-0 top-0 z-50 h-full flex flex-col
               bg-surface-container w-[280px] border-r border-surface-variant shadow-sm
               transition-transform duration-300 ease-in-out
               ${open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}
               lg:translate-x-0
            `}
         >
            {/* Close button - ( Mobile ) */}
            <button
               className="absolute top-4 ltr:right-4 rtl:left-4 lg:hidden text-on-surface-variant hover:text-primary transition-colors"
               onClick={onClose}
            >
               <CloseIcon />
            </button>

            <div className="px-6 py-8">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 flex items-center justify-center text-white bg-primary-container rounded-lg">
                     <Inventory2Icon />
                  </div>
                  <div>
                     <h1 className="text-primary tracking-tight">
                        {t("sidebar.title")}
                     </h1>
                     <p className="text-on-surface-variant">
                        {t("sidebar.subTitle")}
                     </p>
                  </div>
               </div>

               {/* Links */}
               <nav className="space-y-1">
                  {links.map((link, i) => {
                     const Icon = link.icon;
                     return (
                        <NavLink
                           to={link.path}
                           onClick={handleLinkClick}
                           className={({ isActive }) =>
                              `page-label flex items-center gap-3 px-4 py-3 ${
                                 isActive
                                    ? "border-l-4 border-primary bg-primary-container text-on-primary-container transition-all duration-200 ease-in-out"
                                    : "text-on-surface-variant hover:bg-surface-variant rounded-xl transition-colors"
                              }`
                           }
                           key={i}
                        >
                           <Icon fontSize="small" />
                           <span>{t(`sidebar.${link.title}`)}</span>
                        </NavLink>
                     );
                  })}
               </nav>
            </div>

            <div className="mt-auto px-6 py-6 border-t border-slate-100">
               <div className="flex items-center gap-3">
                  <img
                     alt="User Profile"
                     className="w-10 h-10 bg-slate-200 rounded-full object-cover"
                     src={
                        user?.imageUrl
                           ? `${BASE_URL}${user.imageUrl}`
                           : "images/default_userImage.svg"
                     }
                  />
                  <div>
                     <p className="text-on-surface">{user?.userName}</p>
                     <p className="text-secondary text-[10px]">
                        System {user?.role}
                     </p>
                  </div>
                  <button
                     className="ml-auto text-slate-400 hover:text-error transition-colors"
                     onClick={handleLogout}
                  >
                     <LogoutIcon className="rtl:rotate-180" />
                  </button>
               </div>
            </div>
         </aside>
      </>
   );
};

export default Sidebar;
