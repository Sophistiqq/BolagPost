import db from '$lib/server/db-helper';

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export const load = async () => {
  const posts: any[] = await db.prepare(`
    SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.content, p.created_at, p.published_at, u.username as author
    FROM post p
    JOIN user u ON p.user_id = u.id
    WHERE p.status = 'published'
    ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
  `).all();

  // Get tags for each post
  const postsWithTags = await Promise.all(posts.map(async (post) => {
    const tags: any[] = await db.prepare(`
      SELECT t.name, t.slug FROM tag t
      JOIN post_tag pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `).all(post.id);

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      created_at: post.created_at,
      published_at: post.published_at,
      author: post.author,
      readingTime: calculateReadingTime(post.content),
      tags
    };
  }));

  return {
    posts: postsWithTags
  };
};
