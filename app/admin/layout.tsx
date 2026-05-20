import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";
import AdminMobileHeader from "@/components/admin/sidebar/mobile-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex">
      {/* Desktop Sidebar — hidden on mobile */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header — hidden on desktop */}
        <AdminMobileHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
