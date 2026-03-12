import db from '$lib/server/db-helper';
import { fail } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { user } = await parent();

  const posts = await db.prepare(`
    SELECT id, title, slug, created_at FROM post
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(user.id);

  return { posts };
};

export const actions = {
  delete: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get('id')?.toString();

    if (!id || !locals.user) return fail(400, { error: 'Missing post ID' });

    // Make sure user owns this post
    const post = await db.prepare('SELECT id FROM post WHERE id = ? AND user_id = ?')
      .get(id, locals.user.id);

    if (!post) return fail(403, { error: 'Not authorized' });

    await db.prepare('DELETE FROM post WHERE id = ?').run(id);
    return { success: true };
  }
};
