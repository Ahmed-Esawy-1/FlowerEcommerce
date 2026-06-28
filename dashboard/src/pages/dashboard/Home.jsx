import { useEffect, useState } from "react";
import api from "@/api/axios";
import { timeAgo } from "@/helpers/timeAgo";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DownloadIcon from "@mui/icons-material/Download";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ImageIcon from "@mui/icons-material/Image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TopProductsChart from "@/components/TopProductsChart.jsx";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
   const { t } = useTranslation("dashboard");
   const {language} = useLanguage()
   const [data, setData] = useState({});
   // Info
   async function getInfoSummary() {
      try {
         const response = await api.get("/dashboard");
         console.log(response);
         setData(response.data);
      } catch (err) {
         console.log(err);
      }
   }
   useEffect(() => {
      getInfoSummary();
   }, []);

   return (
      <>
         {/* Header */}
         <section className="flex justify-between items-end">
            <div>
               <h2 className="page-title">{t("title")}</h2>
               <p className="page-subtitle">{t("subTitle")}</p>
            </div>
            <div className="flex gap-2">
               <button className="flex items-center gap-2 px-4 py-2 text-secondary bg-surface-container hover:bg-surface-container-low border border-surface-variant rounded-lg transition-all">
                  <CalendarTodayIcon fontSize="small" />
                  {t("dateRange")}
               </button>
               <button className="flex items-center gap-2 px-4 py-2 text-secondary bg-surface-container hover:bg-surface-container-low border border-surface-variant rounded-lg transition-all">
                  <DownloadIcon fontSize="small" />
                  {t("exportReport")}
               </button>
            </div>
         </section>

         {/* Cards*/}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
            {/* Total Products */}
            <div className="dashboard-card">
               <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary-container text-on-primary p-3 rounded-xl">
                     <ProductionQuantityLimitsIcon fontSize="small" />
                  </div>
               </div>
               <p className="text-secondary uppercase tracking-wider">
                  {t("cards.products")}
               </p>
               <h3 className="text-2xl font-bold mt-1.5">
                  {data?.stats?.totalProducts}
               </h3>
            </div>
            {/* Total Orders */}
            <div className="dashboard-card">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                     <LocalShippingIcon fontSize="small" />
                  </div>
               </div>
               <p className="text-secondary uppercase tracking-wider">
                  {t("cards.orders")}
               </p>
               <h3 className="text-2xl font-bold mt-1.5">
                  {data?.stats?.totalOrders}
               </h3>
            </div>
            {/* Categories */}
            <div className="dashboard-card">
               <div className="flex justify-between items-start mb-4">
                  <div className="text-amber-600 p-2 bg-amber-50 rounded-lg">
                     <CategoryIcon fontSize="small" />
                  </div>
               </div>
               <p className="text-secondary uppercase tracking-wider">
                  {t("cards.categories")}
               </p>
               <h3 className="text-2xl font-bold mt-1.5">
                  {data?.stats?.totalCategories}
               </h3>
            </div>
            {/* Occasions */}
            <div className="dashboard-card">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                     <CategoryIcon />
                  </div>
               </div>
               <p className="text-secondary uppercase tracking-wider">
                  {t("cards.occasions")}
               </p>
               <h3 className="text-2xl font-bold mt-1.5">
                  {data?.stats?.totalOccasions}
               </h3>
            </div>
         </div>

         {/* Chart & Activity */}
         <div className="flex flex-wrap gap-6 mb-8">
            {/* Chart */}
            {data?.topProducts && (
               <TopProductsChart topProducts={data?.topProducts} />
            )}

            {/* Latest Orders */}
            <div className="min-w-100 flex-1 flex-col bg-surface-container border border-surface-variant rounded-xl shadow-sm">
               <div className="p-6 border-b border-surface-variant">
                  <h4 className="">{t("orders.title")}</h4>
                  <p className="text-secondary">{t("orders.subTitle")}</p>
               </div>
               <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                  {data?.latestOrders &&
                     data.latestOrders.map((order) => (
                        <div className="flex gap-4" key={order.id}>
                           <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-secondary-container text-on-secondary rounded-full">
                              <ShoppingBagIcon className="!text-[20px] text-blue-600" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-on-surface">
                                 {t("orders.order")}: #{order.id}{" "}
                                 <span className="mx-2 font-semibold">
                                    {t("orders.customer")}: {order.customerName}
                                 </span>
                                 <br />
                                 {t(`orders.status.${order.status}`)}
                              </p>
                              <p className="text-secondary">
                                 {timeAgo(order.createdAt, language)} •{" "}
                                 {order.total} {t("orders.currency")}
                              </p>
                           </div>
                        </div>
                     ))}
               </div>
               <div className="p-4 border-t border-surface-variant text-center">
                  <button className="text-primary hover:underline transition-all">
                     {t("orders.viewAll")}
                  </button>
               </div>
            </div>
         </div>
      </>
   );
};

export default Home;
