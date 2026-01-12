import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/auth";
import { requiredRole } from "@/lib/auth/authz";
import AdminNavbar from "../components/admin/AdminNavbar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await verifySession();

  if (!userId) {
    redirect("/login");
  }

  // Check if user is admin
  await requiredRole("admin");

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
