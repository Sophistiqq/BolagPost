<script>
  import { enhance } from "$app/forms";
  export let form;
</script>

<svelte:head>
  <title>Register — My Blog</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="page">
  <div class="card">
    <div class="brand">
      <span class="logo">✦</span>
      <h1>My Blog</h1>
      <p>Create your account.</p>
    </div>

    {#if form?.error}
      <div class="error-banner">{form.error}</div>
    {/if}

    <form method="POST" action="?/register" use:enhance>
      <div class="field">
        <label for="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="your_username"
          value={form?.username ?? ""}
          autocomplete="username"
          required
        />
      </div>

      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autocomplete="new-password"
          required
        />
      </div>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div class="field">
        <label for="firstname">First Name</label>
        <input id="firstname" name="firstname" type="text" required />
      </div>

      <div class="field">
        <label for="lastname">Last Name</label>
        <input id="lastname" name="lastname" type="text" required />
      </div>

      <button type="submit" class="btn-primary">Create Account →</button>
    </form>

    <p class="footer-link">
      Already have one? <a href="/login">Sign in</a>
    </p>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: "DM Sans", sans-serif;
    background: #0f0f0f;
    color: #e8e0d0;
  }

  .page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 60% 40%, #1a1408 0%, #0f0f0f 70%);
  }

  .card {
    background: #161410;
    border: 1px solid #2e2a20;
    border-radius: 4px;
    padding: 3rem 2.5rem;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
  }

  .brand {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  .logo {
    font-size: 2rem;
    color: #c9a84c;
    display: block;
    margin-bottom: 0.5rem;
  }
  .brand h1 {
    font-family: "Playfair Display", serif;
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
    color: #f0e8d8;
  }
  .brand p {
    margin: 0;
    font-size: 0.85rem;
    color: #6b6355;
    font-weight: 300;
    letter-spacing: 0.05em;
  }

  .error-banner {
    background: #2a1515;
    border: 1px solid #5c2020;
    color: #e07070;
    padding: 0.75rem 1rem;
    border-radius: 3px;
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }

  .field {
    margin-bottom: 1.25rem;
  }
  label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #8a7e6a;
    margin-bottom: 0.5rem;
  }
  input {
    width: 100%;
    background: #0f0e0c;
    border: 1px solid #2e2a20;
    border-radius: 3px;
    padding: 0.75rem 1rem;
    font-family: "DM Sans", sans-serif;
    font-size: 0.95rem;
    color: #e8e0d0;
    box-sizing: border-box;
    transition: border-color 0.2s;
    outline: none;
  }
  input:focus {
    border-color: #c9a84c;
  }
  input::placeholder {
    color: #3a352a;
  }

  .btn-primary {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.85rem;
    background: #c9a84c;
    color: #0f0f0f;
    border: none;
    border-radius: 3px;
    font-family: "DM Sans", sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-primary:hover {
    background: #dbb85a;
  }

  .footer-link {
    text-align: center;
    margin: 1.5rem 0 0;
    font-size: 0.85rem;
    color: #6b6355;
  }
  .footer-link a {
    color: #c9a84c;
    text-decoration: none;
  }
  .footer-link a:hover {
    text-decoration: underline;
  }
</style>
