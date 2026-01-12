"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Users", href: "/admin/users" },
  { name: "Todos", href: "/admin/todos" },
  { name: "Settings", href: "/admin/settings" },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 shadow border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/admin/dashboard"
              className="text-xl font-bold text-blue-400"
            >
              Admin Panel
            </Link>

            <div className="ml-10 flex items-center space-x-4">
              {adminNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-900 text-blue-300"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              ← Back to User Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
