import { fail, error } from '@sveltejs/kit';
import db from '$lib/server/db-helper';
import { uploadToBlob, isValidImageType, getMaxFileSize } from '$lib/server/upload';

export const load = async ({ params, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const post: any = await db.prepare('SELECT * FROM post WHERE id = ? AND user_id = ?')
    .get(params.id, locals.user.id);

  if (!post) throw error(404, 'Post not found');

  // Load tags
  const tags = await db.prepare(`
    SELECT t.name, t.slug FROM tag t
    JOIN post_tag pt ON t.id = pt.tag_id
    WHERE pt.post_id = ?
  `).all(params.id);

  return { 
    post: {
      ...post,
      tags
    }
  };
};

export const actions = {
  update: async ({ request, params, locals }) => {
    if (!locals.user) throw error(401, 'Unauthorized');

    const data = await request.formData();
    const title = data.get('title')?.toString().trim();
    const slug = data.get('slug')?.toString().trim();
    const content = data.get('content')?.toString();
    const excerpt = data.get('excerpt')?.toString().trim();
    const status = data.get('status')?.toString() || 'draft';
    const tags = data.get('tags')?.toString().trim() || '';
    const featuredImageFile = data.get('featured_image') as File | null;

    if (!title || !slug || !content) {
      return fail(400, { error: 'All fields are required.' });
    }

    // Check slug conflict (exclude current post)
    const conflict = await db.prepare('SELECT id FROM post WHERE slug = ? AND id != ?')
      .get(slug, params.id);
    if (conflict) {
      return fail(400, { error: 'Another post already uses this slug.' });
    }

    // Get current post to check status transition
    const currentPost: any = await db.prepare('SELECT status, published_at FROM post WHERE id = ?')
      .get(params.id);

    let publishedAt = currentPost.published_at;
    if (status === 'published' && currentPost.status !== 'published') {
      publishedAt = new Date().toISOString();
    } else if (status === 'draft') {
      publishedAt = null;
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

      try {
        featuredImage = await uploadToBlob(featuredImageFile);
      } catch (e) {
        console.error('Upload failed:', e);
        return fail(500, { error: 'Failed to upload image.' });
      }
    }

    // Update post
    if (featuredImage) {
      await db.prepare(`
        UPDATE post SET title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?, status = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `).run(title, slug, content, excerpt || null, featuredImage, status, publishedAt, params.id, locals.user.id);
    } else {
      await db.prepare(`
        UPDATE post SET title = ?, slug = ?, content = ?, excerpt = ?, status = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `).run(title, slug, content, excerpt || null, status, publishedAt, params.id, locals.user.id);
    }

    // Handle tags
    // 1. Delete old associations
    await db.prepare('DELETE FROM post_tag WHERE post_id = ?').run(params.id);
    
    // 2. Insert new tags
    if (tags) {
      const tagNames = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      for (const tagName of tagNames) {
        const tagSlug = tagName.toLowerCase().replace(/[^\w-]/g, '').replace(/\s+/g, '-');
        
        // Insert tag if not exists
        await db.prepare(`
          INSERT INTO tag (name, slug) VALUES (?, ?) ON CONFLICT (slug) DO NOTHING
        `).run(tagName, tagSlug);

        // Get tag id
        const tag: any = await db.prepare('SELECT id FROM tag WHERE slug = ?').get(tagSlug);
        if (tag) {
          await db.prepare('INSERT INTO post_tag (post_id, tag_id) VALUES (?, ?) ON CONFLICT (post_id, tag_id) DO NOTHING')
            .run(params.id, tag.id);
        }
      }
    }

    return { success: true };
  }
};
