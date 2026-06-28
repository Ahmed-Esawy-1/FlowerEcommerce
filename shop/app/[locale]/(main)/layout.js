import Header from "./components/header/Header";
import Footer from "./components/Footer";
import CartInitializer from "./cart/CartInitializer";
import AuthInitializer from "./components/AuthInitializer";
import { fetchCategories, fetchOccasions } from "@/lib/api/serverFetch";

export default async function MainLayout({ children }) {
   const [categories, occasions] = await Promise.all([
      fetchCategories(),
      fetchOccasions(),
   ]);

   return (
      <AuthInitializer>
         <CartInitializer>
            <div className="antialiased">
               <Header categories={categories} occasions={occasions} />
               {children}
               <Footer />
            </div>
         </CartInitializer>
      </AuthInitializer>
   );
}
