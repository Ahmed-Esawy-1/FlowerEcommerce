import React from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Tooltip,
   Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function TopProductsChart({ topProducts }) {
   const { t, i18n } = useTranslation("dashboard");
   const isRTL = i18n.dir() === "rtl";

   const labels = topProducts.map((p) => p.name);
   const orderCounts = topProducts.map((p) => p.orderCount);

   const data = {
      labels,
      datasets: [
         {
            label: t("topProducts.orderCount"),
            data: orderCounts,
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            borderRadius: 4,
         },
      ],
   };

   const options = {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      locale: i18n.language,
      plugins: {
         legend: { display: false },
         title: {
            display: true,
            text: t("topProducts.title"),
            rtl: isRTL,
            textDirection: isRTL ? "rtl" : "ltr",
         },
         tooltip: {
            rtl: isRTL,
            textDirection: isRTL ? "rtl" : "ltr",
            callbacks: {
               label: (ctx) =>
                  t("topProducts.ordersTooltip", { count: ctx.raw }),
            },
         },
      },
      scales: {
         x: {
            beginAtZero: true,
            ticks: { precision: 0 },
            reverse: isRTL,
         },
         y: {
            position: isRTL ? "right" : "left",
         },
      },
   };

   return (
      <div
         dir={i18n.dir()}
         className="min-w-150 flex-2 flex flex-col bg-surface-container border border-surface-variant rounded-xl shadow-sm"
      >
         <div className="p-6 border-b border-surface-variant">
            <h4>{t("topProducts.title")}</h4>
            <p className="text-secondary">{t("topProducts.subTitle")}</p>
         </div>

         <div className="flex-1 p-6">
            <div
               style={{ position: "relative", height: "100%", width: "100%" }}
            >
               <Bar data={data} options={options} />
            </div>
         </div>
      </div>
   );
}

export default TopProductsChart;
