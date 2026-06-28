import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enDashboard from "./locales/en/dashboard.json";
import enOrders from "./locales/en/orders.json";
import arCommon from "./locales/ar/common.json";
import arDashboard from "./locales/ar/dashboard.json";
import arOrders from "./locales/ar/orders.json";


i18n.use(initReactI18next).init({
   lng: "en",
   ns: ["common", "dashboard", "orders"],
   defaultNS: "common",
   resources: {
      en: {
         common: enCommon,
         dashboard: enDashboard,
         orders: enOrders,
      },
      ar: {
         common: arCommon,
         dashboard: arDashboard,
         orders: arOrders,
      },
   },

   interpolation: {
      escapeValue: false, // react already safes from xss
   },
});
i18n.on("languageChanged", (lng) => {
   document.documentElement.dir = i18n.dir(lng);
   document.documentElement.lang = lng;
});
export default i18n;
