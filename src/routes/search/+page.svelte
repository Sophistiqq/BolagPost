<script lang="ts">
  import { page } from '$app/state';

  let { data } = $props();
  let searchQuery = $derived(data.query);

  function search(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const query = (form.elements.namedItem('q') as HTMLInputElement).value.trim();
    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  }
</script>

<svelte:head>
  <title>{data.query ? `Search: ${data.query}` : 'Search'} — My Blog</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="page-container">
  <header class="search-header">
    <a href="/" class="back-link">← Back to Home</a>
    <h1>Search</h1>
    <form class="search-form" onsubmit={search}>
      <input
        type="text"
        name="q"
        placeholder="Search posts..."
        value={searchQuery}
      />
      <button type="submit">Search</button>
    </form>
  </header>

  <main class="results">
    {#if data.query}
      {#if data.posts.length === 0}
        <div class="no-results">
          <p>No posts found for "<strong>{data.query}</strong>"</p>
          <p class="hint">Try different keywords or browse all posts.</p>
        </div>
      {:else}
        <p class="results-count">
          Found {data.posts.length} {data.posts.length === 1 ? 'result' : 'results'} for "<strong>{data.query}</strong>"
        </p>
        {#each data.posts as post}
          <article class="post-card">
            {#if post.featured_image}
              <div class="featured-image">
                <img src={post.featured_image} alt={post.title} />
              </div>
            {/if}
            <header>
              <h2><a href="/{post.slug}">{post.title}</a></h2>
              <span class="author">by {post.author}</span>
            </header>
            {#if post.excerpt}
              <p class="excerpt">{post.excerpt}</p>
            {/if}
            <div class="meta-row">
              <span class="reading-time">⏱ {post.readingTime} min read</span>
              <a href="/{post.slug}" class="read-more">Read Story →</a>
            </div>
          </article>
        {/each}
      {/if}
    {:else}
      <div class="empty-search">
        <p>Enter a search term to find posts.</p>
      </div>
    {/if}
  </main>
</div>

<style>
  :global(body) {
    background: #fdfaf6;
    color: #1a1814;
    font-family: "DM Sans", sans-serif;
  }

  .page-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  .search-header {
    text-align: center;
    margin-bottom: 3rem;
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

  .search-header h1 {
    font-family: "Playfair Display", serif;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .search-form {
    display: flex;
    gap: 0.75rem;
    max-width: 500px;
    margin: 0 auto;
  }

  .search-form input {
    flex: 1;
    background: #fff;
    border: 1px solid #e8e0d0;
    border-radius: 4px;
    padding: 0.85rem 1rem;
    font-family: "DM Sans", sans-serif;
    font-size: 1rem;
    color: #1a1814;
    outline: none;
    transition: border-color 0.15s;
  }

  .search-form input:focus {
    border-color: #c9a84c;
  }

  .search-form input::placeholder {
    color: #c0b8a8;
  }

  .search-form button {
    background: #1a1814;
    color: #f0e8d8;
    border: none;
    border-radius: 4px;
    padding: 0.85rem 1.5rem;
    font-family: "DM Sans", sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  .search-form button:hover {
    background: #2e2a20;
  }

  .results {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .results-count {
    font-size: 0.9rem;
    color: #8a7e6a;
    text-align: center;
  }

  .no-results,
  .empty-search {
    text-align: center;
    padding: 4rem 2rem;
    background: #fff;
    border: 1px solid #eee5d8;
    border-radius: 8px;
    color: #8a7e6a;
  }

  .no-results strong {
    color: #1a1814;
  }

  .no-results .hint {
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  .post-card {
    border-bottom: 1px solid #eee5d8;
    padding-bottom: 3rem;
  }

  .post-card:last-child {
    border-bottom: none;
  }

  .featured-image {
    margin: -1.5rem 0 1.5rem;
    border-radius: 8px;
    overflow: hidden;
  }

  .featured-image img {
    width: 100%;
    height: auto;
    display: block;
  }

  .post-card h2 {
    font-family: "Playfair Display", serif;
    font-size: 1.8rem;
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
    margin: 1rem 0;
  }

  .meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .reading-time {
    font-size: 0.8rem;
    color: #a09080;
  }

  .read-more {
    font-size: 0.9rem;
    font-weight: 500;
    color: #c9a84c;
    text-decoration: none;
    transition: transform 0.2s;
  }

  .read-more:hover {
    transform: translateX(5px);
  }
</style>
