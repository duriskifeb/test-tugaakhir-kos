import { Sidebar } from "@/components/modules/Sidebar";
import { Topbar } from "@/components/modules/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#fafafa]">
          {children}
        </main>
      </div>
    </div>
  );
}
