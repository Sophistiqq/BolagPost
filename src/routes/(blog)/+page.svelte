<script lang="ts">
  import { page } from '$app/state';

  let { data } = $props();
</script>

<svelte:head>
  <title>My Blog — Home</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap"
    rel="stylesheet"
  />
  <link rel="alternate" type="application/rss+xml" title="My Blog RSS Feed" href="/rss.xml" />
</svelte:head>

<div class="page-container">
  <header class="blog-header">
    <div class="header-top">
      <h1>My Blog</h1>
      <nav class="header-nav">
        <a href="/search" class="nav-link">Search</a>
        <span class="nav-divider">/</span>
        <a href="/rss.xml" class="nav-link">RSS</a>
      </nav>
    </div>
    <p>Thoughts, musings, and stories.</p>
  </header>

  <main class="post-feed">
    {#if data.posts.length === 0}
      <div class="empty-state">
        <p>No posts yet. Check back soon!</p>
      </div>
    {:else}
      {#each data.posts as post}
        <article class="post-card">
          {#if post.featured_image}
            <div class="featured-image">
              <img src={post.featured_image} alt={post.title} />
            </div>
          {/if}
          <header>
            <span class="date">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <h2><a href="/{post.slug}">{post.title}</a></h2>
            <span class="author">by {post.author}</span>
          </header>
          {#if post.excerpt}
            <p class="excerpt">{post.excerpt}</p>
          {/if}
          {#if post.tags.length > 0}
            <div class="tags">
              {#each post.tags as tag}
                <a href="/tags/{tag.slug}" class="tag">{tag.name}</a>
              {/each}
            </div>
          {/if}
          <div class="meta-row">
            <span class="reading-time">⏱ {post.readingTime} min read</span>
            <a href="/{post.slug}" class="read-more">Read Story →</a>
          </div>
        </article>
      {/each}
    {/if}
  </main>
  
  {#if data.user}
    <a href="/admin/posts/new" class="admin-cta" title="New Post">✎</a>
  {:else}
    <a href="/login" class="admin-cta" title="Admin Login">⚙</a>
  {/if}
</div>

<style>
  :global(body) {
    background: #fdfaf6 !important;
    color: #1a1814 !important;
    font-family: "DM Sans", sans-serif;
  }

  .page-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 4rem 2rem 6rem;
    position: relative;
  }

  .blog-header {
    text-align: center;
    margin-bottom: 5rem;
  }

  .header-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .header-nav {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.85rem;
  }

  .nav-link {
    color: #8a7e6a;
    text-decoration: none;
    transition: color 0.15s;
  }

  .nav-link:hover {
    color: #c9a84c;
  }

  .nav-divider {
    color: #eee5d8;
  }

  .blog-header h1 {
    font-family: "Playfair Display", serif;
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .blog-header p {
    color: #8a7e6a;
    font-size: 1.1rem;
    font-weight: 300;
  }

  .admin-cta {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #1a1814;
    color: #fdfaf6;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    text-decoration: none;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transition: all 0.2s;
    z-index: 100;
  }

  .admin-cta:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  }

  .post-feed {
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }

  .post-card {
    border-bottom: 1px solid #eee5d8;
    padding-bottom: 4rem;
  }

  .post-card:last-child {
    border-bottom: none;
  }

  .featured-image {
    margin: -2rem 0 2rem;
    border-radius: 8px;
    overflow: hidden;
  }

  .featured-image img {
    width: 100%;
    height: auto;
    display: block;
  }

  .date {
    font-size: 0.8rem;
    color: #8a7e6a;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .post-card h2 {
    font-family: "Playfair Display", serif;
    font-size: 2.2rem;
    margin: 0.5rem 0;
  }

  .post-card h2 a {
    color: #1a1814;
    text-decoration: none;
    transition: color 0.2s;
  }

  .post-card h2 a:hover {
    color: #c9a84c;
  }

  .author {
    font-size: 0.9rem;
    color: #8a7e6a;
    font-style: italic;
  }

  .excerpt {
    font-size: 1rem;
    line-height: 1.7;
    color: #5a5248;
    margin: 1.25rem 0;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
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

  .meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
  }

  .reading-time {
    font-size: 0.8rem;
    color: #8a7e6a;
  }

  .read-more {
    font-size: 0.9rem;
    font-weight: 500;
    color: #c9a84c;
    text-decoration: none;
    transition: transform 0.2s;
    display: inline-block;
  }

  .read-more:hover {
    transform: translateX(5px);
  }

  .empty-state {
    text-align: center;
    padding: 5rem;
    background: #fff;
    border: 1px dashed #e8e0d0;
    border-radius: 8px;
    color: #8a7e6a;
  }
  @media (max-width: 768px) {
    .page-container {
      padding: 3rem 1.25rem 5rem;
    }

    .blog-header {
      margin-bottom: 3rem;
    }

    .blog-header h1 {
      font-size: 2.5rem;
    }

    .post-feed {
      gap: 3rem;
    }

    .post-card h2 {
      font-size: 1.75rem;
    }

    .meta-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .admin-cta {
      bottom: 1.5rem;
      right: 1.5rem;
      width: 44px;
      height: 44px;
    }
  }
</style>
