import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
const Header = () => {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-8 py-4 ml-[280px] w-[calc(100%-280px)] bg-white/80 backdrop-blur-md">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-body-md text-body-md"
            placeholder="Search analytics, products, or users..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6 ml-8">
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 hover:text-primary transition-colors">
            <NotificationsIcon />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="p-2 text-slate-500 hover:text-primary transition-colors">
            <SettingsIcon />
          </button>
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex items-center gap-3">
          <span className="text-primary font-semibold">Dashboard</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
