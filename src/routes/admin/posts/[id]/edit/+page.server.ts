import { fail, error } from '@sveltejs/kit';
import db from '$lib/server/db';
import { generateUniqueFilename, isValidImageType, getMaxFileSize } from '$lib/server/upload';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const load = async ({ params, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const post = db.prepare('SELECT * FROM post WHERE id = ? AND user_id = ?')
    .get(params.id, locals.user.id);

  if (!post) throw error(404, 'Post not found');

  return { post };
};

export const actions = {
  update: async ({ request, params, locals }) => {
    if (!locals.user) throw error(401, 'Unauthorized');

    const data = await request.formData();
    const title = data.get('title')?.toString().trim();
    const slug = data.get('slug')?.toString().trim();
    const content = data.get('content')?.toString();
    const featuredImageFile = data.get('featured_image') as File | null;

    if (!title || !slug || !content) {
      return fail(400, { error: 'All fields are required.' });
    }

    // Check slug conflict (exclude current post)
    const conflict = db.prepare('SELECT id FROM post WHERE slug = ? AND id != ?')
      .get(slug, params.id);
    if (conflict) {
      return fail(400, { error: 'Another post already uses this slug.' });
    }

    // Handle featured image upload
    let featuredImage: string | null = null;
    if (featuredImageFile && featuredImageFile.size > 0) {
      if (!isValidImageType(featuredImageFile.type)) {
        return fail(400, { error: 'Invalid image type. Use JPEG, PNG, GIF, or WebP.' });
      }
      if (featuredImageFile.size > getMaxFileSize()) {
        return fail(400, { error: 'Image too large. Max 5MB.' });
      }

      const filename = generateUniqueFilename(featuredImageFile.name);
      const filepath = join(process.cwd(), 'static', 'uploads', filename);
      const buffer = Buffer.from(await featuredImageFile.arrayBuffer());
      await writeFile(filepath, buffer);
      featuredImage = `/uploads/${filename}`;
    }

    // Update post
    if (featuredImage) {
      db.prepare(`
        UPDATE post SET title = ?, slug = ?, content = ?, featured_image = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `).run(title, slug, content, featuredImage, params.id, locals.user.id);
    } else {
      db.prepare(`
        UPDATE post SET title = ?, slug = ?, content = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `).run(title, slug, content, params.id, locals.user.id);
    }

    return { success: true };
  }
};
