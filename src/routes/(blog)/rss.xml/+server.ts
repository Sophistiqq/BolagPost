import db from '$lib/server/db-helper';

export async function GET() {
  const posts: any[] = await db.prepare(`
    SELECT p.id, p.title, p.slug, p.excerpt, p.content, p.created_at, p.published_at, u.username as author
    FROM post p
    JOIN user u ON p.user_id = u.id
    WHERE p.status = 'published'
    ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
    LIMIT 20
  `).all();

  const baseUrl = 'https://yourblog.com';
  const buildDate = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>My Blog</title>
    <link>${baseUrl}</link>
    <description>Thoughts, musings, and stories.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200)}...]]></description>
      <pubDate>${new Date(post.published_at || post.created_at).toUTCString()}</pubDate>
      <author>${post.author}</author>
    </item>
    `).join('')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
