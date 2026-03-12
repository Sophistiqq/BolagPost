<script lang="ts">
  import { page } from "$app/stores";
  let { data, children } = $props();
  
  const username = $derived((data.user as any)?.username ?? 'User');

  const nav = [
    { href: "/admin", label: "Dashboard", icon: "▦" },
    { href: "/admin/posts", label: "Posts", icon: "✎" },
    { href: "/admin/posts/new", label: "New Post", icon: "+" },
    { href: "/admin/profile", label: "Profile", icon: "◎" },
  ];

  let isSidebarOpen = $state(false);

  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }

  // Close sidebar on navigation
  $effect(() => {
    const _path = $page.url.pathname;
    isSidebarOpen = false;
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;1,300&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="shell">
  <header class="mobile-header">
    <button class="hamburger" onclick={toggleSidebar} aria-label="Toggle menu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
    <a href="/" class="brand-mobile">
      <span class="star">✦</span>
      <span class="brand-name">My Blog</span>
    </a>
    <div class="mobile-spacer"></div>
  </header>

  {#if isSidebarOpen}
    <button class="overlay" onclick={toggleSidebar} aria-label="Close menu"></button>
  {/if}

  <aside class="sidebar" class:open={isSidebarOpen}>
    <a href="/" class="brand">
      <span class="star">✦</span>
      <span class="brand-name">My Blog</span>
    </a>

    <nav>
      {#each nav as item}
        <a
          href={item.href}
          class="nav-item"
          class:active={$page.url.pathname === item.href}
        >
          <span class="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <span class="avatar">{username[0]?.toUpperCase()}</span>
        <span class="username">{username}</span>
      </div>
      <form method="POST" action="/logout?/logout">
        <button class="logout-btn" type="submit">↪ Logout</button>
      </form>
    </div>
  </aside>

  <main class="content">
    {@render children()}
  </main>
</div>

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    overflow-x: hidden;
  }

  .shell {
    display: flex;
    min-height: 100vh;
    background: #f7f4ef;
    color: #1a1814;
    font-family: "DM Sans", sans-serif;
  }

  .mobile-header {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #1a1814;
    color: #f0e8d8;
    z-index: 100;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .hamburger {
    background: none;
    border: none;
    display: flex;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    padding: 10px;
  }

  .bar {
    width: 20px;
    height: 2px;
    background: #c9a84c;
    border-radius: 2px;
  }

  .brand-mobile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
  }

  .brand-mobile .star {
    color: #c9a84c;
    font-size: 1rem;
  }

  .brand-mobile .brand-name {
    font-family: "Fraunces", serif;
    font-size: 1rem;
    font-weight: 600;
    color: #f0e8d8;
  }

  .mobile-spacer {
    width: 40px; /* To balance the hamburger button */
  }

  .overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 140;
    backdrop-filter: blur(2px);
  }

  .sidebar {
    width: 220px;
    flex-shrink: 0;
    background: #1a1814;
    color: #e8e0d0;
    display: flex;
    flex-direction: column;
    padding: 2rem 0;
    position: sticky;
    top: 0;
    height: 100vh;
    z-index: 150;
    transition: transform 0.3s ease;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0 1.5rem 2rem;
    border-bottom: 1px solid #2e2a20;
    text-decoration: none;
    transition: opacity 0.15s;
  }

  .brand:hover {
    opacity: 0.8;
  }

  .star {
    color: #c9a84c;
    font-size: 1.1rem;
  }
  .brand-name {
    font-family: "Fraunces", serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: #f0e8d8;
    letter-spacing: 0.02em;
  }

  nav {
    padding: 1.5rem 0;
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 1.5rem;
    color: #8a7e6a;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 400;
    transition:
      color 0.15s,
      background 0.15s;
    border-left: 2px solid transparent;
  }

  .nav-item:hover {
    color: #e8e0d0;
    background: #221e18;
  }
  .nav-item.active {
    color: #c9a84c;
    border-left-color: #c9a84c;
    background: #221e18;
  }

  .nav-icon {
    font-size: 1rem;
    width: 1.2rem;
    text-align: center;
  }

  .sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid #2e2a20;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .avatar {
    width: 28px;
    height: 28px;
    background: #c9a84c;
    color: #1a1814;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  .username {
    font-size: 0.8rem;
    color: #8a7e6a;
  }

  .logout-btn {
    background: none;
    border: none;
    color: #5a5248;
    font-family: "DM Sans", sans-serif;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 0;
    transition: color 0.15s;
    text-align: left;
  }
  .logout-btn:hover {
    color: #e07070;
  }

  .content {
    flex: 1;
    padding: 3rem;
    overflow-y: auto;
    width: 100%;
  }

  @media (max-width: 768px) {
    .mobile-header {
      display: flex;
    }

    .overlay {
      display: block;
    }

    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      transform: translateX(-100%);
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .content {
      padding: 5rem 1.5rem 3rem;
    }

    .brand {
      display: none;
    }
  }
</style>
