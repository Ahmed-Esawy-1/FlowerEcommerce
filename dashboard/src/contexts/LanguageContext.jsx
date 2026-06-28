import { createContext, useContext, useState } from "react";
import i18n from "i18next";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
   const [language, setLanguage] = useState(() => {
      const savedLang = localStorage.getItem("lang") || "en";

      i18n.changeLanguage(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";

      return savedLang;
   });

   function changeLanguage(lang) {
      setLanguage(lang);

      i18n.changeLanguage(lang);

      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

      localStorage.setItem("lang", lang);
   }

   return (
      <LanguageContext.Provider value={{ language, changeLanguage }}>
         {children}
      </LanguageContext.Provider>
   );
};

export const useLanguage = () => useContext(LanguageContext);
