import SiteLayout from "./SiteLayout";

export default function PageLayout({ children, dark = false }) {
  return (
    <SiteLayout showFooterReviews={false}>
      <main
        className={
          dark
            ? "min-h-screen bg-[#090f20] text-white"
            : "min-h-screen bg-white text-[#101a31]"
        }
      >
        {children}
      </main>
    </SiteLayout>
  );
}
