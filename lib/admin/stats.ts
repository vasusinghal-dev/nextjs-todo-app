import { query } from "@/lib/db";

export async function getAdminStatsData() {
  const [
    usersResult,
    todosResult,
    completedResult,
    activeResult,
    yesterdayUsers,
    yesterdayTodos,
  ] = await Promise.all([
    query("SELECT COUNT(*) FROM users"),
    query("SELECT COUNT(*) FROM todos WHERE deleted_at IS NULL"),
    query(
      "SELECT COUNT(*) FROM todos WHERE is_completed = true AND deleted_at IS NULL"
    ),
    query(`
      SELECT COUNT(DISTINCT user_id)
      FROM todos
      WHERE created_at >= CURRENT_DATE
      AND deleted_at IS NULL
    `),
    query(`
      SELECT COUNT(*)
      FROM users
      WHERE created_at >= NOW() - INTERVAL '1 day'
    `),
    query(`
      SELECT COUNT(*)
      FROM todos
      WHERE created_at >= NOW() - INTERVAL '1 day'
      AND deleted_at IS NULL
    `),
  ]);

  const totalUsers = Number(usersResult.rows[0].count);
  const totalTodos = Number(todosResult.rows[0].count);
  const completedTodos = Number(completedResult.rows[0].count);
  const activeUsersToday = Number(activeResult.rows[0].count);
  const newUsersYesterday = Number(yesterdayUsers.rows[0].count);
  const newTodosYesterday = Number(yesterdayTodos.rows[0].count);

  return {
    totalUsers,
    totalTodos,
    completedTodos,
    activeUsersToday,
    userGrowth: newUsersYesterday,
    todoGrowth: newTodosYesterday,
    completionRate:
      totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0,
  };
}
