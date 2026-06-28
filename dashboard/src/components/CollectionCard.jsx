import EventIcon from "@mui/icons-material/Event";
import { BASE_URL } from "@/api/config";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

const CollectionCard = ({
   data,
   fallbackIcon,
   setDeletedata, // setDeletedata(Data)
   setOpenDeletedModal, // setOpenDeletedModal(Boolean)
   onEdit, // onEdit(Data)
}) => {
   const Icon = fallbackIcon || EventIcon;
   const { language } = useLanguage();

   useEffect(() => {
      console.log(data);
   }, [data]);

   return (
      <div className="group bg-surface-container border border-surface-variant hover:border-primary rounded-xl overflow-hidden transition-all duration-300">
         {/* Image */}
         <div className="h-72 bg-surface-container-high relative overflow-hidden">
            {data.imageUrl ? (
               <img
                  src={`${BASE_URL}${data.imageUrl}`}
                  alt={data.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               />
            ) : (
               <div className="w-full h-full flex items-center justify-center opacity-20">
                  <Icon
                     style={{
                        fontSize: 48,
                     }}
                  />
               </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-surface-container/90 to-transparent" />
         </div>

         {/* Content */}
         <div className="p-4">
            <h3 className="text-on-surface text-xl font-semibold mb-2">
               {language == "en" ? data.nameEn : data.nameAr}
            </h3>

            <div className="flex items-center gap-2 border-t border-surface-variant pt-4">
               <button
                  onClick={() => onEdit(data)}
                  className="flex-1 py-2 px-3 text-center text-on-surface-variant hover:text-primary font-semibold border border-surface-variant rounded-lg hover:bg-surface-variant transition-colors"
               >
                  Update
               </button>

               <button
                  onClick={() => {
                     setDeletedata(data);
                     setOpenDeletedModal(true);
                  }}
                  className="flex-1 py-2 px-3 text-on-surface-variant hover:text-error font-semibold border border-surface-variant rounded-lg hover:bg-surface-variant transition-colors"
               >
                  Delete
               </button>
            </div>
         </div>
      </div>
   );
};

export default CollectionCard;
