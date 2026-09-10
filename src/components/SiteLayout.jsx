import Footer from "./Footer";
import FooterReviews from "./FooterReviews";
import Navbar from "./navbar";
import TopBar from "./TopBar";

// One shared frame keeps every customer-facing page consistent.
export default function SiteLayout({ children, showFooterReviews = true }) {
  return (
    <div className="min-h-screen bg-[#f6f9ff] text-[#10213f]">
      <TopBar />
      <Navbar />
      {children}
      {showFooterReviews && <FooterReviews />}
      <Footer />
    </div>
  );
}
