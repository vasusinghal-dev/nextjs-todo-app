// import { query } from "@/lib/db";
import { prisma } from "../prisma";

export async function getAdminStatsData() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalTodos,
    completedTodos,
    activeUsersToday,
    newUsersYesterday,
    newTodosYesterday,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.todo.count({
      where: {
        deleted_at: null,
      },
    }),
    prisma.todo.count({
      where: {
        is_completed: true,
        deleted_at: null,
      },
    }),
    prisma.todo
      .findMany({
        where: {
          created_at: {
            gte: todayStart,
          },
          deleted_at: null,
        },
        distinct: ["user_id"],
        select: {
          user_id: true,
        },
      })
      .then((result) => result.length),
    prisma.user.count({
      where: {
        created_at: {
          gte: yesterday,
        },
      },
    }),
    prisma.todo.count({
      where: {
        created_at: {
          gte: yesterday,
        },
        deleted_at: null,
      },
    }),
  ]);

  // const [
  //   usersResult,
  //   todosResult,
  //   completedResult,
  //   activeResult,
  //   yesterdayUsers,
  //   yesterdayTodos,
  // ] = await Promise.all([
  //   query("SELECT COUNT(*) FROM users"),
  //   query("SELECT COUNT(*) FROM todos WHERE deleted_at IS NULL"),
  //   query(
  //     "SELECT COUNT(*) FROM todos WHERE is_completed = true AND deleted_at IS NULL"
  //   ),
  //   query(`
  //     SELECT COUNT(DISTINCT user_id)
  //     FROM todos
  //     WHERE created_at >= CURRENT_DATE
  //     AND deleted_at IS NULL
  //   `),
  //   query(`
  //     SELECT COUNT(*)
  //     FROM users
  //     WHERE created_at >= NOW() - INTERVAL '1 day'
  //   `),
  //   query(`
  //     SELECT COUNT(*)
  //     FROM todos
  //     WHERE created_at >= NOW() - INTERVAL '1 day'
  //     AND deleted_at IS NULL
  //   `),
  // ]);

  // const totalUsers = Number(usersResult.rows[0].count);
  // const totalTodos = Number(todosResult.rows[0].count);
  // const completedTodos = Number(completedResult.rows[0].count);
  // const activeUsersToday = Number(activeResult.rows[0].count);
  // const newUsersYesterday = Number(yesterdayUsers.rows[0].count);
  // const newTodosYesterday = Number(yesterdayTodos.rows[0].count);

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
