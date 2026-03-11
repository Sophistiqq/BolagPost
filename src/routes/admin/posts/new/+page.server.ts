import { fail, redirect } from '@sveltejs/kit';
import db from '$lib/server/db';
import { generateUniqueFilename, isValidImageType, getMaxFileSize } from '$lib/server/upload';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

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
    const existing = db.prepare('SELECT id FROM post WHERE slug = ?').get(slug);
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

      const filename = generateUniqueFilename(featuredImageFile.name);
      const filepath = join(process.cwd(), 'static', 'uploads', filename);
      const buffer = Buffer.from(await featuredImageFile.arrayBuffer());
      await writeFile(filepath, buffer);
      featuredImage = `/uploads/${filename}`;
    }

    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    const result = db.prepare(`
      INSERT INTO post (title, slug, content, excerpt, featured_image, status, user_id, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, slug, content, excerpt || null, featuredImage, status, locals.user.id, publishedAt);

    // Handle tags
    if (tags) {
      const tagNames = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      for (const tagName of tagNames) {
        const tagSlug = tagName.toLowerCase().replace(/[^\w-]/g, '').replace(/\s+/g, '-');
        
        // Insert tag if not exists
        db.prepare(`
          INSERT OR IGNORE INTO tag (name, slug) VALUES (?, ?)
        `).run(tagName, tagSlug);

        // Get tag id
        const tag: any = db.prepare('SELECT id FROM tag WHERE slug = ?').get(tagSlug);
        if (tag) {
          db.prepare('INSERT OR IGNORE INTO post_tag (post_id, tag_id) VALUES (?, ?)')
            .run(result.lastInsertRowid, tag.id);
        }
      }
    }

    throw redirect(302, '/admin/posts');
  }
};
