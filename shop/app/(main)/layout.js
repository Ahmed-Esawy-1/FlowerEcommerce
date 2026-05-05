
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ReduxProvider } from "./providers";


export default function MainLayout({ children }) {
  return (
    <ReduxProvider>
        <div className="text-charcoal dark:text-slate-200 font-sans antialiased">
          <Header />
          {children}
          <Footer />
        </div>
    </ReduxProvider>
  );
}