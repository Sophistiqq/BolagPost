<script lang="ts">
  let { data } = $props();
  const username = $derived((data.user as any)?.username ?? 'User');

  type Post = {
    id: number;
    title: string;
    slug: string;
    created_at: string;
  };
</script>

<svelte:head><title>Dashboard — Admin</title></svelte:head>

<div class="dashboard">
  <header class="page-header">
    <h1>Dashboard</h1>
    <p>Welcome back, <strong>{username}</strong></p>
  </header>

  <div class="stats-grid">
    <div class="stat-card">
      <span class="stat-icon">✎</span>
      <div class="stat-body">
        <span class="stat-value">{data.stats.postCount}</span>
        <span class="stat-label">Total Posts</span>
      </div>
    </div>
    <div class="stat-card">
      <span class="stat-icon">◎</span>
      <div class="stat-body">
        <span class="stat-value">{data.stats.totalViews}</span>
        <span class="stat-label">Total Views</span>
      </div>
    </div>
    <div class="stat-card">
      <span class="stat-icon">✦</span>
      <div class="stat-body">
        <span class="stat-value">{data.stats.recentPosts}</span>
        <span class="stat-label">Posts This Month</span>
      </div>
    </div>
  </div>

  <section class="recent-section">
    <div class="section-header">
      <h2>Recent Posts</h2>
      <a href="/admin/posts/new" class="btn-primary">+ New Post</a>
    </div>

    {#if data.recentPosts.length === 0}
      <div class="empty">
        <p>
          No posts yet. <a href="/admin/posts/new">Write your first one →</a>
        </p>
      </div>
    {:else}
      <div class="post-list">
        {#each data.recentPosts as post}
          {@const p = post as unknown as Post}
          <div class="post-row">
            <div class="post-info">
              <span class="post-title">{p.title}</span>
              <span class="post-date"
                >{new Date(p.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}</span
              >
            </div>
            <div class="post-actions">
              <a href="/admin/posts/{p.id}/edit" class="action-link">Edit</a>
              <a href="/{p.slug}" target="_blank" class="action-link muted"
                >View ↗</a
              >
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .page-header h1 {
    font-family: "Fraunces", serif;
    font-size: 2rem;
    font-weight: 600;
    color: #1a1814;
    margin-bottom: 0.25rem;
  }
  .page-header p {
    color: #8a7e6a;
    font-size: 0.9rem;
  }
  .page-header strong {
    color: #1a1814;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat-card {
    background: #fff;
    border: 1px solid #e8e0d0;
    border-radius: 6px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    font-size: 1.5rem;
    color: #c9a84c;
    width: 2.5rem;
    height: 2.5rem;
    background: #fdf8ee;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-body {
    display: flex;
    flex-direction: column;
  }
  .stat-value {
    font-family: "Fraunces", serif;
    font-size: 1.8rem;
    font-weight: 600;
    line-height: 1;
    color: #1a1814;
  }
  .stat-label {
    font-size: 0.78rem;
    color: #8a7e6a;
    margin-top: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  .section-header h2 {
    font-family: "Fraunces", serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a1814;
  }

  .btn-primary {
    background: #1a1814;
    color: #f0e8d8;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    transition: background 0.15s;
  }
  .btn-primary:hover {
    background: #2e2a20;
  }

  .post-list {
    background: #fff;
    border: 1px solid #e8e0d0;
    border-radius: 6px;
    overflow: hidden;
  }

  .post-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f0ece4;
    transition: background 0.1s;
  }
  .post-row:last-child {
    border-bottom: none;
  }
  .post-row:hover {
    background: #fdfaf6;
  }

  .post-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .post-title {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1a1814;
  }
  .post-date {
    font-size: 0.78rem;
    color: #a09080;
  }

  .post-actions {
    display: flex;
    gap: 1rem;
  }
  .action-link {
    font-size: 0.8rem;
    color: #c9a84c;
    text-decoration: none;
    font-weight: 500;
  }
  .action-link:hover {
    text-decoration: underline;
  }
  .action-link.muted {
    color: #a09080;
  }

  .empty {
    background: #fff;
    border: 1px solid #e8e0d0;
    border-radius: 6px;
    padding: 2.5rem;
    text-align: center;
    color: #8a7e6a;
    font-size: 0.9rem;
  }
  .empty a {
    color: #c9a84c;
    text-decoration: none;
  }
  .empty a:hover {
    text-decoration: underline;
  }
  @media (max-width: 900px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .page-header h1 {
      font-size: 1.5rem;
    }

    .post-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .post-actions {
      width: 100%;
      border-top: 1px solid #f0ece4;
      padding-top: 0.75rem;
      justify-content: flex-start;
    }
  }
</style>
