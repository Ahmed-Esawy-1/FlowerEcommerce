export default function ProductSkeleton() {
   return (
      <div className="animate-pulse bg-white rounded-2xl overflow-hidden border border-slate-100">
         {/* Image */}
         <div className="h-56 bg-slate-200" />

         {/* Content */}
         <div className="p-4">
            <div className="h-3 w-20 bg-slate-200 rounded mb-3" />

            <div className="h-5 w-full bg-slate-200 rounded mb-2" />
            <div className="h-5 w-3/4 bg-slate-200 rounded mb-4" />

            <div className="flex justify-between mb-4">
               <div className="h-6 w-24 bg-slate-200 rounded" />
               <div className="h-6 w-6 bg-slate-200 rounded-full" />
            </div>

            <div className="flex gap-2">
               <div className="h-10 flex-1 bg-slate-200 rounded-full" />
               <div className="h-10 flex-1 bg-slate-200 rounded-full" />
            </div>
         </div>
      </div>
   );
}
