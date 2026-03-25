import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-64 p-4 md:p-8 lg:p-12 min-h-screen pb-20 md:pb-12">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
