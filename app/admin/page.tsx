import { requiredRole } from "@/lib/auth/authz";
import { redirect } from "next/navigation";
import { getAdminStatsData } from "@/lib/admin/stats";
import StatsCard from "../components/admin/StatsCard";

export default async function AdminDashboardPage() {
  const user = await requiredRole("admin");
  if (!user) redirect("/dashboard");

  const stats = await getAdminStatsData();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          change={stats.userGrowth}
        />
        <StatsCard
          title="Total Todos"
          value={stats.totalTodos}
          change={stats.todoGrowth}
        />
        <StatsCard
          title="Completed Todos"
          value={stats.completedTodos}
          percentage={stats.completionRate}
        />
        <StatsCard
          title="Active Today"
          value={stats.activeUsersToday}
          description="Users with activity"
        />
      </div>
    </div>
  );
}
