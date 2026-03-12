import { getDb } from '$lib/server/db';

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export const load = async () => {
  // Single optimized query with JOINs and JSON aggregation
  const posts: any[] = await getDb().unsafe(`
    SELECT 
      p.id, p.title, p.slug, p.excerpt, p.featured_image, p.content, p.created_at, p.published_at, 
      u.username as author,
      COALESCE(
        (SELECT json_agg(json_build_object('name', t.name, 'slug', t.slug))
         FROM tag t
         JOIN post_tag pt ON t.id = pt.tag_id
         WHERE pt.post_id = p.id
        ), '[]'
      ) as tags
    FROM post p
    JOIN "user" u ON p.user_id = u.id
    WHERE p.status = 'published'
    ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
  `, []);

  return {
    posts: posts.map(post => ({
      ...post,
      readingTime: calculateReadingTime(post.content)
    }))
  };
};
