import React from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DownloadIcon from "@mui/icons-material/Download";
import PaymentsIcon from "@mui/icons-material/Payments";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import ImageIcon from "@mui/icons-material/Image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
const Home = () => {
  return (
    <>
      <main className="ml-[280px] p-8 space-y-8">
        {/* Welcome Section*/}
        <section className="flex justify-between items-end">
          <div>
            <h2 className="text-on-background">System Overview</h2>
            <p className="text-secondary">
              Monitoring key performance indicators and operational metrics.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 text-secondary bg-white px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
              <CalendarTodayIcon className="!text-[18px]" />
              Last 30 Days
            </button>
            <button className="flex items-center gap-2 bg-primary px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all">
              <DownloadIcon className="!text-[18px]" />
              Export Report
            </button>
          </div>
        </section>
        {/* Metrics Grid (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Sales */}
          <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="text-primary bg-indigo-50 p-2 rounded-lg">
                <PaymentsIcon />
              </div>
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                <TrendingUpIcon className="!text-[14px]" />
                12.5%
              </span>
            </div>
            <p className="text-secondary uppercase tracking-wider">
              Total Sales
            </p>
            <h3 className="mt-1">$128,430.00</h3>
          </div>
          {/* Active Users */}
          <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <SentimentVerySatisfiedIcon />
              </div>
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                <TrendingUpIcon className="!text-[14px]" />
                8.2%
              </span>
            </div>
            <p className="text-secondary uppercase tracking-wider">
              Active Users
            </p>
            <h3 className="mt-1">2,845</h3>
          </div>
          {/* Orders */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="text-amber-600 p-2 bg-amber-50 rounded-lg">
                <ShoppingBagIcon />
              </div>
              <span className="flex items-center gap-1 text-error bg-error-container px-2 py-1 rounded">
                <TrendingDownIcon className="!text-[14px]" />
                2.1%
              </span>
            </div>
            <p className="text-secondary uppercase tracking-wider">
              Total Orders
            </p>
            <h3 className="mt-1">456</h3>
          </div>
          {/* Conversion Rate */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <QueryStatsIcon />
              </div>
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                <TrendingUpIcon className="!text-[14px]" />
                4.4%
              </span>
            </div>
            <p className="text-secondary uppercase tracking-wider">
              Conversion Rate
            </p>
            <h3 className="mt-1">3.24%</h3>
          </div>
        </div>
        {/* Main Content Area: Chart & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/*  Sales Trends Chart (Mock Visualization) */}
          <div className="lg:col-span-2 flex flex-col  bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div>
                <h4 className="">Sales Trends</h4>
                <p className="text-secondary">Revenue performance over time</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-secondary">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>{" "}
                  Current
                </span>
                <span className="flex items-center gap-1 text-secondary">
                  <span className="w-3 h-3 bg-slate-300 rounded-full"></span>{" "}
                  Previous
                </span>
              </div>
            </div>
            <div className="flex-1 p-8 min-h-[300px] relative">
              {/*- Chart Simulation using SVG */}
              <svg className="w-full h-full" viewBox="0 0 800 300">
                {/* Grid Lines*/}
                <line
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  x1="0"
                  x2="800"
                  y1="50"
                  y2="50"
                ></line>
                <line
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  x1="0"
                  x2="800"
                  y1="150"
                  y2="150"
                ></line>
                <line
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  x1="0"
                  x2="800"
                  y1="250"
                  y2="250"
                ></line>
                {/*Area Fill  */}
                <path
                  d="M0,250 L100,200 L200,220 L300,100 L400,120 L500,50 L600,80 L700,30 L800,60 L800,300 L0,300 Z"
                  fill="rgba(79, 70, 229, 0.05)"
                ></path>
                {/*  Main Line*/}
                <path
                  d="M0,250 L100,200 L200,220 L300,100 L400,120 L500,50 L600,80 L700,30 L800,60"
                  fill="none"
                  stroke="#4f46e5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                ></path>
                {/* Data Points*/}
                <circle
                  cx="300"
                  cy="100"
                  fill="#4f46e5"
                  r="5"
                  stroke="white"
                  strokeWidth="2"
                ></circle>
                <circle
                  cx="500"
                  cy="50"
                  fill="#4f46e5"
                  r="5"
                  stroke="white"
                  strokeWidth="2"
                ></circle>
                <circle
                  cx="700"
                  cy="30"
                  fill="#4f46e5"
                  r="5"
                  stroke="white"
                  strokeWidth="2"
                ></circle>
              </svg>
              {/* X-Axis*/}
              <div className="flex justify-between mt-px px-2">
                <span className="text-secondary">Week 1</span>
                <span className="text-secondary">Week 2</span>
                <span className="text-secondary">Week 3</span>
                <span className="text-secondary">Week 4</span>
              </div>
            </div>
          </div>
          {/* Recent Activity List */}
          <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h4 className="">Recent Activity</h4>
              <p className="text-secondary">Latest system events</p>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="flex gap-4" key={i}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600 rounded-full">
                    <ShoppingBagIcon className="!text-[20px]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-on-surface">
                      New order <span className="font-semibold">#12904</span>
                      <br />
                      received
                    </p>
                    <p className="text-secondary">2 minutes ago • $240.00</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 text-center">
              <button className="text-primary hover:underline transition-all">
                View All Activity
              </button>
            </div>
          </div>
        </div>
        {/*  Inventory Status / Table Section */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <h4 className="">Inventory Status</h4>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-surface-container text-secondary border border-outline-variant rounded-full">
                Filter by Category
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-secondary uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-secondary uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-secondary uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-secondary uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-secondary uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              {/* ============================================== */}
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center shrink-0 w-10 h-10 bg-slate-100 rounded-lg">
                        <ImageIcon className="text-slate-400" />
                      </div>
                      <span className="font-medium">
                        HyperX Cloud II Gaming Headset
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary">HX-CL2-RD</td>
                  <td className="px-6 py-4 text-secondary">Electronics</td>
                  <td className="px-6 py-4">124</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-100 rounded-full text-emerald-700 text-[11px] font-bold">
                      IN STOCK
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors">
                      <MoreVertIcon />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center shrink-0 w-10 h-10 bg-slate-100 rounded-lg">
                        <ImageIcon className="text-slate-400" />
                      </div>
                      <span className="font-medium">
                        Logitech G502 HERO Mouse
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary">LOG-G502-H</td>
                  <td className="px-6 py-4 text-secondary">Electronics</td>
                  <td className="px-6 py-4">5</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-amber-100 rounded-full text-amber-700 text-[11px] font-bold">
                      LOW STOCK
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors">
                      <MoreVertIcon />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center shrink-0 w-10 h-10 bg-slate-100 rounded-lg">
                        <ImageIcon className="text-slate-400" />
                      </div>
                      <span className="font-medium">
                        Secretlab Titan EVO 2024
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary">SL-T-24-BL</td>
                  <td className="px-6 py-4 text-secondary">Furniture</td>
                  <td className="px-6 py-4">0</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-error-container rounded-full text-on-error-container text-[11px] font-bold">
                      OUT OF STOCK
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors">
                      <MoreVertIcon />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center p-6 border-t border-slate-100">
            <span className="text-secondary">Showing 3 of 124 products</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 border border-slate-200 rounded text-slate-400">
                <ChevronLeftIcon className="!text-[18px]" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-primary-container/10 border border-primary rounded text-primary">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 border border-slate-200 rounded text-slate-600">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 border border-slate-200 rounded text-slate-400">
                <ChevronRightIcon className="!text-[18px]" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
