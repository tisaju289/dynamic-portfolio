import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminGuard from "@/components/admin/AdminGuard";

const Admin = () => (
  <AdminGuard>
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-4 pt-20 lg:pt-8 lg:p-8 overflow-auto w-full min-w-0">
        <Outlet />
      </main>
    </div>
  </AdminGuard>
);

export default Admin;
