import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import MobileNav from "@/components/layout/MobileNav";

export default function MainLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-hero-radial bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">
        <Sidebar />
        <MobileNav />
        <main className="flex-1 px-4 py-4 md:px-6 lg:px-8">
          <TopNav title={title} subtitle={subtitle} />
          <div className="mt-6 space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
