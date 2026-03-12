<script lang="ts">
  import { enhance } from "$app/forms";
  let { data } = $props();

  type Post = {
    id: number;
    title: string;
    slug: string;
    created_at: string;
  };
</script>

<svelte:head><title>Posts — Admin</title></svelte:head>

<div class="posts-page">
  <header class="page-header">
    <div>
      <h1>Posts</h1>
      <p>{data.posts.length} post{data.posts.length !== 1 ? "s" : ""} total</p>
    </div>
    <a href="/admin/posts/new" class="btn-primary">+ New Post</a>
  </header>

  {#if data.posts.length === 0}
    <div class="empty">
      <span class="empty-icon">✎</span>
      <p>No posts yet.</p>
      <a href="/admin/posts/new" class="btn-primary">Write your first post →</a>
    </div>
  {:else}
    <div class="post-list">
      {#each data.posts as post}
        {@const p = post as unknown as Post}
        <div class="post-row">
          <div class="post-info">
            <a href="/admin/posts/{p.id}/edit" class="post-title"
              >{p.title}</a
            >
            <div class="post-meta">
              <span class="slug">/{p.slug}</span>
              <span class="dot">·</span>
              <span class="date"
                >{new Date(p.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}</span
              >
            </div>
          </div>
          <div class="post-actions">
            <a href="/admin/posts/{p.id}/edit" class="action-btn edit"
              >Edit</a
            >
            <a href="/{p.slug}" target="_blank" class="action-btn view"
              >View ↗</a
            >
            <form method="POST" action="?/delete" use:enhance>
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                class="action-btn delete"
                onclick={() => confirm("Delete this post?")}>Delete</button
              >
            </form>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .posts-page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .page-header h1 {
    font-family: "Fraunces", serif;
    font-size: 2rem;
    font-weight: 600;
    color: #1a1814;
    margin-bottom: 0.2rem;
  }
  .page-header p {
    font-size: 0.875rem;
    color: #8a7e6a;
  }

  .btn-primary {
    background: #1a1814;
    color: #f0e8d8;
    padding: 0.6rem 1.2rem;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
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
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid #f0ece4;
    gap: 1rem;
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
    gap: 0.3rem;
    min-width: 0;
  }
  .post-title {
    font-size: 0.95rem;
    font-weight: 500;
    color: #1a1814;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .post-title:hover {
    color: #c9a84c;
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
  }
  .slug {
    color: #a09080;
    font-family: "DM Mono", monospace;
    font-size: 0.72rem;
  }
  .dot {
    color: #c8beb0;
  }
  .date {
    color: #a09080;
  }

  .post-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .action-btn {
    padding: 0.35rem 0.75rem;
    border-radius: 3px;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    border: 1px solid transparent;
    font-family: "DM Sans", sans-serif;
    transition: all 0.15s;
  }
  .action-btn.edit {
    background: #fdf8ee;
    color: #c9a84c;
    border-color: #e8d8a0;
  }
  .action-btn.edit:hover {
    background: #f5eccc;
  }
  .action-btn.view {
    background: #f4f0ea;
    color: #6b5f50;
    border-color: #e0d8cc;
  }
  .action-btn.view:hover {
    background: #ece4d8;
  }
  .action-btn.delete {
    background: #fff4f4;
    color: #c05050;
    border-color: #e8c0c0;
  }
  .action-btn.delete:hover {
    background: #ffe0e0;
  }

  .empty {
    text-align: center;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background: #fff;
    border: 1px solid #e8e0d0;
    border-radius: 6px;
  }
  .empty-icon {
    font-size: 2.5rem;
    color: #c9a84c;
  }
  .empty p {
    color: #8a7e6a;
    font-size: 0.95rem;
  }
  @media (max-width: 768px) {
    .page-header h1 {
      font-size: 1.5rem;
    }

    .post-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .post-actions {
      width: 100%;
      justify-content: flex-start;
      border-top: 1px solid #f0ece4;
      padding-top: 0.75rem;
    }

    .post-title {
      white-space: normal;
      font-size: 1rem;
    }
  }
</style>
