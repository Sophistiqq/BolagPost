import { fail, redirect } from '@sveltejs/kit';
import db from '$lib/server/db-helper';
import { uploadToBlob, isValidImageType, getMaxFileSize } from '$lib/server/upload';

export const actions = {
  create: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Unauthorized' });
    
    const data = await request.formData();
    const title = data.get('title')?.toString().trim();
    const slug = data.get('slug')?.toString().trim();
    const content = data.get('content')?.toString();
    const excerpt = data.get('excerpt')?.toString().trim();
    const status = data.get('status')?.toString() || 'draft';
    const tags = data.get('tags')?.toString().trim() || '';
    const featuredImageFile = data.get('featured_image') as File | null;

    if (!title || !slug || !content) {
      return fail(400, { error: 'Title, slug, and content are required.', title, slug, excerpt, tags, status });
    }

    // Check slug is unique
    const existing = await db.prepare('SELECT id FROM post WHERE slug = ?').get(slug);
    if (existing) {
      return fail(400, { error: 'A post with this slug already exists.', title, slug, excerpt, tags, status });
    }

    // Handle featured image upload
    let featuredImage: string | null = null;
    if (featuredImageFile && featuredImageFile.size > 0) {
      if (!isValidImageType(featuredImageFile.type)) {
        return fail(400, { error: 'Invalid image type. Use JPEG, PNG, GIF, or WebP.', title, slug, excerpt, tags, status });
      }
      if (featuredImageFile.size > getMaxFileSize()) {
        return fail(400, { error: 'Image too large. Max 5MB.', title, slug, excerpt, tags, status });
      }

      try {
        featuredImage = await uploadToBlob(featuredImageFile);
      } catch (e) {
        console.error('Upload failed:', e);
        return fail(500, { error: 'Failed to upload image.', title, slug, excerpt, tags, status });
      }
    }

    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    const result = await db.prepare(`
      INSERT INTO post (title, slug, content, excerpt, featured_image, status, user_id, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, 
      slug, 
      content, 
      excerpt || null, 
      featuredImage || null, 
      status, 
      locals.user.id, 
      publishedAt
    );

    // Handle tags
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
            .run(Number(result.lastInsertRowid), tag.id);
        }
      }
    }

    throw redirect(302, '/admin/posts');
  }
};
