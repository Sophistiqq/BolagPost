import { error } from '@sveltejs/kit';
import db from '$lib/server/db';

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export const load = async ({ params }) => {
  const post: any = db.prepare(`
    SELECT p.id, p.title, p.slug, p.content, p.excerpt, p.featured_image, p.created_at, p.published_at, u.username as author
    FROM post p
    JOIN user u ON p.user_id = u.id
    WHERE p.slug = ?
  `).get(params.slug);

  if (!post) {
    throw error(404, 'Post not found');
  }

  // Get tags for this post
  const tags: any[] = db.prepare(`
    SELECT t.name, t.slug FROM tag t
    JOIN post_tag pt ON t.id = pt.tag_id
    WHERE pt.post_id = ?
  `).all(post.id);

  // Increment view count
  db.prepare('UPDATE post SET views = COALESCE(views, 0) + 1 WHERE id = ?').run(post.id);

  // Get updated view count
  const updatedPost: any = db.prepare('SELECT views FROM post WHERE id = ?').get(post.id);

  return {
    post: {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      created_at: post.created_at,
      published_at: post.published_at,
      author: post.author,
      readingTime: calculateReadingTime(post.content),
      tags,
      views: updatedPost.views
    }
  };
};
