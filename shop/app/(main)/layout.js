import Header from "./components/Header";
import Footer from "./components/Footer";

import CartInitializer from "./cart/CartInitializer";

export default function MainLayout({ children }) {
   return (
      <CartInitializer>
         <div
            className="text-charcoal antialiased"
            style={{
               backgroundImage:
                  'url("images/b30d3b06-ccdf-4850-a4f7-e11327a7a9a8.png")',
               backgroundRepeat: "no-repeat",
               backgroundSize: "cover",
               backgroundPosition: "center",
            }}
         >
            <Header />
            {children}
            <Footer />
         </div>
      </CartInitializer>
   );
}
