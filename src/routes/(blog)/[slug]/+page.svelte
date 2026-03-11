<script lang="ts">
  import { page } from '$app/state';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.post.title} — My Blog</title>
  <meta name="description" content={data.post.excerpt || `Read ${data.post.title} by ${data.post.author}`} />
  <meta property="og:title" content={data.post.title} />
  <meta property="og:description" content={data.post.excerpt || `Read ${data.post.title} by ${data.post.author}`} />
  {#if data.post.featured_image}
    <meta property="og:image" content={data.post.featured_image} />
  {/if}
  <meta property="og:type" content="article" />
  <meta property="article:published_time" content={data.post.published_at || data.post.created_at} />
  <meta property="article:author" content={data.post.author} />
  <meta property="article:tag" content={data.post.tags.map(t => t.name).join(', ')} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="page-container">
  <article class="post-detail">
    {#if data.post.featured_image}
      <div class="featured-image">
        <img src={data.post.featured_image} alt={data.post.title} />
      </div>
    {/if}
    <header class="post-header">
      <a href="/" class="back-link">← Back to Home</a>
      <div class="meta-top">
        {#if data.post.tags.length > 0}
          <div class="tags">
            {#each data.post.tags as tag}
              <a href="/tags/{tag.slug}" class="tag">{tag.name}</a>
            {/each}
          </div>
        {/if}
        <span class="date">
          {new Date(data.post.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <h1>{data.post.title}</h1>
      <div class="byline">
        <span class="author">by {data.post.author}</span>
        <span class="separator">•</span>
        <span class="reading-time">⏱ {data.post.readingTime} min read</span>
        <span class="separator">•</span>
        <span class="views">👁 {data.post.views} views</span>
      </div>
    </header>

    <div class="post-content">
      {@html data.post.content}
    </div>
  </article>
</div>

<style>
  :global(body) {
    background: #fdfaf6;
    color: #1a1814;
    font-family: "DM Sans", sans-serif;
  }

  .page-container {
    max-width: 720px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  .post-detail {
    background: #fff;
    border: 1px solid #eee5d8;
    border-radius: 8px;
    padding: 3rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  }

  .featured-image {
    margin: -3rem -3rem 2rem;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
  }

  .featured-image img {
    width: 100%;
    height: auto;
    display: block;
  }

  .back-link {
    font-size: 0.85rem;
    color: #a09080;
    text-decoration: none;
    display: inline-block;
    margin-bottom: 1.5rem;
    transition: color 0.2s;
  }

  .back-link:hover {
    color: #c9a84c;
  }

  .post-header {
    text-align: center;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #eee5d8;
  }

  .meta-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .tag {
    font-size: 0.75rem;
    background: #f7f4ef;
    color: #8a7e6a;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    text-decoration: none;
    transition: all 0.15s;
    border: 1px solid #e8e0d0;
  }

  .tag:hover {
    background: #c9a84c;
    color: #fff;
    border-color: #c9a84c;
  }

  .date {
    font-size: 0.8rem;
    color: #a09080;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .post-header h1 {
    font-family: "Playfair Display", serif;
    font-size: 2.8rem;
    font-weight: 700;
    margin: 0.5rem 0;
    line-height: 1.2;
  }

  .byline {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    color: #8a7e6a;
  }

  .author {
    font-style: italic;
  }

  .separator {
    color: #c8beb0;
  }

  .reading-time,
  .views {
    font-size: 0.85rem;
  }

  .post-content {
    font-size: 1.05rem;
    line-height: 1.8;
    color: #1a1814;
  }

  .post-content :global(h2) {
    font-family: "Playfair Display", serif;
    font-size: 1.8rem;
    font-weight: 600;
    margin: 2rem 0 1rem;
    color: #1a1814;
  }

  .post-content :global(h3) {
    font-family: "Playfair Display", serif;
    font-size: 1.4rem;
    font-weight: 600;
    margin: 1.5rem 0 0.75rem;
    color: #1a1814;
  }

  .post-content :global(p) {
    margin-bottom: 1.25rem;
  }

  .post-content :global(ul),
  .post-content :global(ol) {
    padding-left: 1.5rem;
    margin-bottom: 1.25rem;
  }

  .post-content :global(li) {
    margin-bottom: 0.5rem;
  }

  .post-content :global(blockquote) {
    border-left: 3px solid #c9a84c;
    padding-left: 1.25rem;
    color: #6b5f50;
    font-style: italic;
    margin: 1.5rem 0;
  }

  .post-content :global(pre) {
    background: #1a1814;
    color: #e8e0d0;
    padding: 1.25rem;
    border-radius: 4px;
    font-family: "DM Mono", monospace;
    font-size: 0.9rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  .post-content :global(code) {
    font-family: "DM Mono", monospace;
    font-size: 0.9em;
    background: #f0ece4;
    padding: 0.15em 0.4em;
    border-radius: 3px;
  }

  .post-content :global(pre code) {
    background: none;
    padding: 0;
  }

  .post-content :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1.5rem 0;
  }
</style>
