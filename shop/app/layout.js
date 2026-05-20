import "./globals.css";
import StoreProvider from "./(main)/storeProvider";
export const metadata = {
   title: "Flow",
   description: "Luxury gifts and flowers",
};

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <head></head>
         <body>
            <StoreProvider>{children}</StoreProvider>
         </body>
      </html>
   );
}
