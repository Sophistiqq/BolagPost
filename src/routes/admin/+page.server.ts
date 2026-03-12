import db from '$lib/server/db-helper';

export const load = async ({ parent }) => {
  const { user } = await parent();

  // Post count
  const { count: postCount }: any = await db.prepare(
    'SELECT COUNT(*) as count FROM post WHERE user_id = ?'
  ).get(user.id);

  // Total views (requires a views column - defaults to 0 if not present)
  let totalViews = 0;
  try {
    const result: any = await db.prepare(
      'SELECT SUM(views) as total FROM post WHERE user_id = ?'
    ).get(user.id);
    totalViews = result.total ?? 0;
  } catch {
    // views column may not exist yet
  }

  // Posts this month
  const { count: recentPosts }: any = await db.prepare(`
    SELECT COUNT(*) as count FROM post
    WHERE user_id = ?
    AND created_at >= date('now', 'start of month')
  `).get(user.id);

  // Recent 5 posts
  const recentPostsList = await db.prepare(`
    SELECT id, title, slug, created_at FROM post
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 5
  `).all(user.id);

  return {
    user,
    stats: { postCount, totalViews, recentPosts },
    recentPosts: recentPostsList
  };
};
