# src/+layout.server.ts

```ts

import { lucia } from '$lib/server/auth';

// This runs on every request and makes `user` available in all pages
export const load = async ({ cookies }) => {
  const sessionId = cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    return { user: null };
  }

  const { session, user } = await lucia.validateSession(sessionId);

  // Refresh cookie if session was extended
  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
  }

  // Clear cookie if session is invalid
  if (!session) {
    const blankCookie = lucia.createBlankSessionCookie();
    cookies.set(blankCookie.name, blankCookie.value, {
      path: '.',
      ...blankCookie.attributes
    });
  }

  return { user };
};

```

# src/app.css

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

```

# src/app.d.ts

```ts
declare global {
  namespace App {
    interface Locals {
      user: import('lucia').User | null;
      session: import('lucia').Session | null;
    }
  }
}
export { };

```

# src/app.html

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>

```

# src/hooks.server.ts

```ts
import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
  }

  if (!session) {
    const blankCookie = lucia.createBlankSessionCookie();
    event.cookies.set(blankCookie.name, blankCookie.value, {
      path: '.',
      ...blankCookie.attributes
    });
  }

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
};

```

# src/lib/assets/favicon.svg

This is a file of the type: SVG Image

# src/lib/components/RichEditor.svelte

```svelte
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Placeholder from "@tiptap/extension-placeholder";

  let {
    content = "",
    onchange,
  }: { content?: string; onchange?: (html: string) => void } = $props();

  let element: HTMLDivElement;
  let editor: Editor;

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder: "Start writing your post…" }),
      ],
      content,
      onUpdate: ({ editor }) => {
        onchange?.(editor.getHTML());
      },
    });
  });

  onDestroy(() => editor?.destroy());

  function toggleBold() {
    editor.chain().focus().toggleBold().run();
  }
  function toggleItalic() {
    editor.chain().focus().toggleItalic().run();
  }
  function toggleH2() {
    editor.chain().focus().toggleHeading({ level: 2 }).run();
  }
  function toggleH3() {
    editor.chain().focus().toggleHeading({ level: 3 }).run();
  }
  function toggleBullet() {
    editor.chain().focus().toggleBulletList().run();
  }
  function toggleOrdered() {
    editor.chain().focus().toggleOrderedList().run();
  }
  function toggleBlockquote() {
    editor.chain().focus().toggleBlockquote().run();
  }
  function toggleCode() {
    editor.chain().focus().toggleCodeBlock().run();
  }
  function undo() {
    editor.chain().focus().undo().run();
  }
  function redo() {
    editor.chain().focus().redo().run();
  }
</script>

<div class="editor-wrap">
  <div class="toolbar">
    <div class="toolbar-group">
      <button type="button" onclick={toggleBold} title="Bold"><b>B</b></button>
      <button type="button" onclick={toggleItalic} title="Italic"
        ><i>I</i></button
      >
    </div>
    <div class="divider"></div>
    <div class="toolbar-group">
      <button type="button" onclick={toggleH2} title="Heading 2">H2</button>
      <button type="button" onclick={toggleH3} title="Heading 3">H3</button>
    </div>
    <div class="divider"></div>
    <div class="toolbar-group">
      <button type="button" onclick={toggleBullet} title="Bullet list"
        >• List</button
      >
      <button type="button" onclick={toggleOrdered} title="Numbered list"
        >1. List</button
      >
    </div>
    <div class="divider"></div>
    <div class="toolbar-group">
      <button type="button" onclick={toggleBlockquote} title="Blockquote"
        >" Quote</button
      >
      <button type="button" onclick={toggleCode} title="Code block"
        >&lt;/&gt;</button
      >
    </div>
    <div class="divider"></div>
    <div class="toolbar-group">
      <button type="button" onclick={undo} title="Undo">↩</button>
      <button type="button" onclick={redo} title="Redo">↪</button>
    </div>
  </div>

  <div class="editor-body" bind:this={element}></div>
</div>

<style>
  .editor-wrap {
    border: 1px solid #e8e0d0;
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    background: #f7f4ef;
    border-bottom: 1px solid #e8e0d0;
    flex-wrap: wrap;
  }

  .toolbar-group {
    display: flex;
    gap: 0.15rem;
  }

  .toolbar button {
    background: none;
    border: 1px solid transparent;
    border-radius: 3px;
    padding: 0.3rem 0.5rem;
    font-family: "DM Sans", sans-serif;
    font-size: 0.78rem;
    color: #5a5248;
    cursor: pointer;
    transition: all 0.1s;
    white-space: nowrap;
  }
  .toolbar button:hover {
    background: #fff;
    border-color: #e0d8cc;
    color: #1a1814;
  }

  .divider {
    width: 1px;
    height: 20px;
    background: #e0d8cc;
    margin: 0 0.25rem;
  }

  .editor-body {
    min-height: 420px;
    padding: 1.5rem;
    font-family: "DM Sans", sans-serif;
    font-size: 1rem;
    line-height: 1.7;
    color: #1a1814;
    outline: none;
  }

  /* TipTap content styles */
  :global(.editor-body .ProseMirror) {
    outline: none;
    min-height: 380px;
  }
  :global(.editor-body h2) {
    font-family: "Fraunces", serif;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.5rem 0 0.5rem;
    color: #1a1814;
  }
  :global(.editor-body h3) {
    font-family: "Fraunces", serif;
    font-size: 1.2rem;
    font-weight: 600;
    margin: 1.25rem 0 0.4rem;
    color: #1a1814;
  }
  :global(.editor-body p) {
    margin-bottom: 0.75rem;
  }
  :global(.editor-body ul, .editor-body ol) {
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
  }
  :global(.editor-body li) {
    margin-bottom: 0.25rem;
  }
  :global(.editor-body blockquote) {
    border-left: 3px solid #c9a84c;
    padding-left: 1rem;
    color: #6b5f50;
    font-style: italic;
    margin: 1rem 0;
  }
  :global(.editor-body pre) {
    background: #1a1814;
    color: #e8e0d0;
    padding: 1rem;
    border-radius: 4px;
    font-family: "DM Mono", monospace;
    font-size: 0.875rem;
    overflow-x: auto;
    margin: 1rem 0;
  }
  :global(.editor-body code) {
    font-family: "DM Mono", monospace;
    font-size: 0.875em;
    background: #f0ece4;
    padding: 0.1em 0.3em;
    border-radius: 3px;
  }
  :global(.editor-body pre code) {
    background: none;
    padding: 0;
  }
  :global(.editor-body .is-editor-empty:first-child::before) {
    color: #c0b8a8;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
</style>

```

# src/lib/index.ts

```ts
// place files you want to import through the `$lib` alias in this folder.

```

# src/lib/server/auth.ts

```ts
import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import db from "./db"


const adapter = new BetterSqlite3Adapter(db, {
  user: 'user',
  session: 'session'
})

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: { secure: process.env.NODE_ENV === 'production' }
  },
  getUserAttributes: (data: any) => ({ username: data.username })
})

```

# src/lib/server/db.ts

```ts
import Database from "bun:sqlite"

const db = new Database("blog.sqlite");

db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    bio TEXT,
    image TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES user(id),
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL REFERENCES user(id)
  );
`);

export default db;

```

# src/routes/(auth)/login/+page.server.ts

```ts
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import db from '$lib/server/db';

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString().trim();
    const password = data.get('password')?.toString();

    // --- Basic validation ---
    if (!username || !password) {
      return fail(400, { error: 'Username and password are required.', username });
    }

    // --- Look up user ---
    const user: any = db.prepare('SELECT * FROM user WHERE username = ?').get(username);
    if (!user) {
      // Generic message — don't reveal whether user exists
      return fail(400, { error: 'Incorrect username or password.', username });
    }

    // --- Check password ---
    const validPassword = await Bun.password.verify(password, user.password_hash);
    if (!validPassword) {
      return fail(400, { error: 'Incorrect username or password.', username });
    }

    // --- Create session ---
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });

    // --- Redirect to admin/dashboard after login ---
    throw redirect(302, '/admin');
  }
};

```

# src/routes/(auth)/login/+page.svelte

```svelte
<script>
  import { enhance } from "$app/forms";
  let { form } = $props();
</script>

<svelte:head>
  <title>Login — My Blog</title>
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
      <p>Welcome back, writer.</p>
    </div>

    {#if form?.error}
      <div class="error-banner">{form.error}</div>
    {/if}

    <form method="POST" action="?/login" use:enhance>
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
          autocomplete="current-password"
          required
        />
      </div>

      <button type="submit" class="btn-primary">Sign In →</button>
    </form>

    <p class="footer-link">
      No account? <a href="/register">Create one</a>
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
    letter-spacing: 0.02em;
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
    letter-spacing: 0.05em;
    cursor: pointer;
    transition:
      background 0.2s,
      transform 0.1s;
  }

  .btn-primary:hover {
    background: #dbb85a;
  }

  .btn-primary:active {
    transform: scale(0.99);
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

```

# src/routes/(auth)/register/+page.server.ts

```ts
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import db from '$lib/server/db';
import { generateId } from 'lucia';

export const actions = {
  register: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString().trim();
    const password = data.get('password')?.toString();
    const email = data.get('email')?.toString().trim();
    const firstname = data.get('firstname')?.toString().trim();
    const lastname = data.get('lastname')?.toString().trim();

    // --- Validation ---
    if (!username || !password) {
      return fail(400, { error: 'All fields are required.', username });
    }
    if (username.length < 3) {
      return fail(400, { error: 'Username must be at least 3 characters.', username });
    }
    if (password.length < 6) {
      return fail(400, { error: 'Password must be at least 6 characters.', username });
    }

    // --- Check if username taken ---
    const existing = db.prepare('SELECT id FROM user WHERE username = ?').get(username);
    if (existing) {
      return fail(400, { error: 'Username already taken.', username });
    }

    // --- Hash password and create user ---
    const passwordHash = await Bun.password.hash(password);
    const userId = generateId(15);

    db.prepare(
      'INSERT INTO user (id, username, password_hash, email, firstname, lastname) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(userId, username, passwordHash, email, firstname, lastname);

    // --- Create session and log in immediately ---
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });

    throw redirect(302, '/admin');
  }
};

```

# src/routes/(auth)/register/+page.svelte

```svelte
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

```

# src/routes/(blog)/[slug]/+page.svelte

```svelte

```

# src/routes/(blog)/+page.svelte

```svelte

```

# src/routes/admin/[id]/edit/+page.server.ts

```ts
import { fail, error } from '@sveltejs/kit';
import db from '$lib/server/db';

export const load = async ({ params, locals }) => {
  const post = db.prepare('SELECT * FROM post WHERE id = ? AND user_id = ?')
    .get(params.id, locals.user?.id);

  if (!post) throw error(404, 'Post not found');

  return { post };
};

export const actions = {
  update: async ({ request, params, locals }) => {
    const data = await request.formData();
    const title = data.get('title')?.toString().trim();
    const slug = data.get('slug')?.toString().trim();
    const content = data.get('content')?.toString();

    if (!title || !slug || !content) {
      return fail(400, { error: 'All fields are required.' });
    }

    // Check slug conflict (exclude current post)
    const conflict = db.prepare('SELECT id FROM post WHERE slug = ? AND id != ?')
      .get(slug, params.id);
    if (conflict) {
      return fail(400, { error: 'Another post already uses this slug.' });
    }

    db.prepare(`
      UPDATE post SET title = ?, slug = ?, content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(title, slug, content, params.id, locals.user?.id);

    return { success: true };
  }
};

```

# src/routes/admin/[id]/edit/+page.svelte

```svelte
<script lang="ts">
  import { enhance } from "$app/forms";
  import RichEditor from "$lib/components/RichEditor.svelte";

  let { data, form } = $props();

  let title = $state(data.post.title);
  let slug = $state(data.post.slug);
  let content = $state(data.post.content);
</script>

<svelte:head><title>Edit: {data.post.title} — Admin</title></svelte:head>

<div class="editor-page">
  <header class="page-header">
    <div>
      <h1>Edit Post</h1>
      <p class="slug-preview">/{data.post.slug}</p>
    </div>
    <div class="header-actions">
      <a href="/{data.post.slug}" target="_blank" class="btn-ghost"
        >View Live ↗</a
      >
      <a href="/admin/posts" class="btn-ghost">← Back</a>
    </div>
  </header>

  {#if form?.error}
    <div class="error-banner">{form.error}</div>
  {/if}
  {#if form?.success}
    <div class="success-banner">Post updated successfully.</div>
  {/if}

  <form
    method="POST"
    action="?/update"
    use:enhance={({ formData }) => {
      formData.set("content", content);
    }}
  >
    <div class="field">
      <label for="title">Title</label>
      <input id="title" name="title" type="text" bind:value={title} required />
    </div>

    <div class="field">
      <label for="slug">Slug</label>
      <input id="slug" name="slug" type="text" bind:value={slug} required />
    </div>

    <div class="field">
      <label>Content</label>
      <RichEditor
        content={data.post.content}
        onchange={(html) => (content = html)}
      />
      <input type="hidden" name="content" value={content} />
    </div>

    <div class="form-footer">
      <a href="/admin/posts" class="btn-ghost">Cancel</a>
      <button type="submit" class="btn-primary">Save Changes →</button>
    </div>
  </form>
</div>

<style>
  .editor-page {
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
  .slug-preview {
    font-family: "DM Mono", monospace;
    font-size: 0.8rem;
    color: #c9a84c;
  }
  .header-actions {
    display: flex;
    gap: 0.5rem;
  }
  .error-banner {
    background: #fff4f4;
    border: 1px solid #e8c0c0;
    color: #c05050;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  .success-banner {
    background: #f4fff4;
    border: 1px solid #b0d8b0;
    color: #3a7a3a;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  label {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8a7e6a;
  }
  input[type="text"] {
    background: #fff;
    border: 1px solid #e8e0d0;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    font-family: "DM Sans", sans-serif;
    font-size: 0.95rem;
    color: #1a1814;
    outline: none;
    transition: border-color 0.15s;
  }
  input[type="text"]:focus {
    border-color: #c9a84c;
  }
  .form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-top: 0.5rem;
  }
  .btn-primary {
    background: #1a1814;
    color: #f0e8d8;
    padding: 0.65rem 1.4rem;
    border: none;
    border-radius: 4px;
    font-family: "DM Sans", sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-primary:hover {
    background: #2e2a20;
  }
  .btn-ghost {
    background: none;
    border: 1px solid #e8e0d0;
    color: #8a7e6a;
    padding: 0.6rem 1.1rem;
    border-radius: 4px;
    font-family: "DM Sans", sans-serif;
    font-size: 0.875rem;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s;
  }
  .btn-ghost:hover {
    border-color: #c0b8a8;
    color: #1a1814;
  }
</style>

```

# src/routes/admin/+layout.server.ts

```ts
import { redirect } from '@sveltejs/kit';

// This protects every page inside /admin
export const load = async ({ parent }) => {
  const { user } = await parent();

  if (!user) {
    throw redirect(302, '/login');
  }

  return { user };
};

```

# src/routes/admin/+layout.svelte

```svelte
<script>
  import { page } from "$app/stores";
  let { data, children } = $props();

  const nav = [
    { href: "/admin", label: "Dashboard", icon: "▦" },
    { href: "/admin/posts", label: "Posts", icon: "✎" },
    { href: "/admin/posts/new", label: "New Post", icon: "+" },
    { href: "/admin/profile", label: "Profile", icon: "◎" },
  ];
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;1,300&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="shell">
  <aside class="sidebar">
    <div class="brand">
      <span class="star">✦</span>
      <span class="brand-name">My Blog</span>
    </div>

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
        <span class="avatar">{data.user?.username?.[0]?.toUpperCase()}</span>
        <span class="username">{data.user?.username}</span>
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
    font-family: "DM Sans", sans-serif;
    background: #f7f4ef;
    color: #1a1814;
  }

  .shell {
    display: flex;
    min-height: 100vh;
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
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0 1.5rem 2rem;
    border-bottom: 1px solid #2e2a20;
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
    max-width: 960px;
  }
</style>

```

# src/routes/admin/+page.server.ts

```ts
import db from '$lib/server/db';

export const load = async ({ parent }) => {
  const { user } = await parent();

  // Post count
  const { count: postCount } = db
    .prepare('SELECT COUNT(*) as count FROM post WHERE user_id = ?')
    .get(user.id) as { count: number };

  // Total views (requires a views column - defaults to 0 if not present)
  let totalViews = 0;
  try {
    const result = db
      .prepare('SELECT SUM(views) as total FROM post WHERE user_id = ?')
      .get(user.id) as { total: number | null };
    totalViews = result.total ?? 0;
  } catch {
    // views column may not exist yet
  }

  // Posts this month
  const { count: recentPosts } = db.prepare(`
    SELECT COUNT(*) as count FROM post
    WHERE user_id = ?
    AND created_at >= date('now', 'start of month')
  `).get(user.id) as { count: number };

  // Recent 5 posts
  const recentPostsList = db.prepare(`
    SELECT id, title, slug, created_at FROM post
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 5
  `).all(user.id);

  return {
    user,
    stats: { postCount, totalViews, recentPosts },
    recentPosts: recentPostsList
  };
};

```

# src/routes/admin/+page.svelte

```svelte
<script>
  let { data } = $props();
</script>

<svelte:head><title>Dashboard — Admin</title></svelte:head>

<div class="dashboard">
  <header class="page-header">
    <h1>Dashboard</h1>
    <p>Welcome back, <strong>{data.user.username}</strong></p>
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
          <div class="post-row">
            <div class="post-info">
              <span class="post-title">{post.title}</span>
              <span class="post-date"
                >{new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}</span
              >
            </div>
            <div class="post-actions">
              <a href="/admin/posts/{post.id}/edit" class="action-link">Edit</a>
              <a href="/{post.slug}" target="_blank" class="action-link muted"
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
</style>

```

# src/routes/admin/new/+page.server.ts

```ts
import { fail, redirect } from '@sveltejs/kit';
import db from '$lib/server/db';

export const actions = {
  create: async ({ request, locals }) => {
    const data = await request.formData();
    const title = data.get('title')?.toString().trim();
    const slug = data.get('slug')?.toString().trim();
    const content = data.get('content')?.toString();

    if (!title || !slug || !content) {
      return fail(400, { error: 'Title, slug, and content are required.' });
    }

    // Check slug is unique
    const existing = db.prepare('SELECT id FROM post WHERE slug = ?').get(slug);
    if (existing) {
      return fail(400, { error: 'A post with this slug already exists.' });
    }

    db.prepare(`
      INSERT INTO post (title, slug, content, user_id)
      VALUES (?, ?, ?, ?)
    `).run(title, slug, content, locals.user?.id);

    throw redirect(302, '/admin/posts');
  }
};

```

# src/routes/admin/new/+page.svelte

```svelte
<script lang="ts">
  import { enhance } from "$app/forms";
  import RichEditor from "$lib/components/RichEditor.svelte";

  let { form } = $props();

  let title = $state("");
  let content = $state("");
  let slug = $state("");
  let autoSlug = $state(true);

  function generateSlug(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function onTitleInput(e: Event) {
    title = (e.target as HTMLInputElement).value;
    if (autoSlug) slug = generateSlug(title);
  }

  function onSlugInput(e: Event) {
    slug = (e.target as HTMLInputElement).value;
    autoSlug = false; // user manually edited slug
  }
</script>

<svelte:head><title>New Post — Admin</title></svelte:head>

<div class="editor-page">
  <header class="page-header">
    <div>
      <h1>New Post</h1>
      <p>Write something worth reading.</p>
    </div>
    <a href="/admin/posts" class="btn-ghost">← Back to Posts</a>
  </header>

  {#if form?.error}
    <div class="error-banner">{form.error}</div>
  {/if}

  <form
    method="POST"
    action="?/create"
    use:enhance={({ formData }) => {
      formData.set("content", content);
      formData.set("slug", slug);
    }}
  >
    <div class="field">
      <label for="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        placeholder="Your post title…"
        value={title}
        oninput={onTitleInput}
        required
      />
    </div>

    <div class="field">
      <label for="slug">
        Slug
        <span class="label-hint">URL: /{slug || "your-post-title"}</span>
      </label>
      <input
        id="slug"
        name="slug"
        type="text"
        placeholder="your-post-title"
        value={slug}
        oninput={onSlugInput}
        required
      />
    </div>

    <div class="field">
      <label>Content</label>
      <RichEditor onchange={(html) => (content = html)} />
      <!-- Hidden field so content is submitted -->
      <input type="hidden" name="content" value={content} />
    </div>

    <div class="form-footer">
      <a href="/admin/posts" class="btn-ghost">Cancel</a>
      <button type="submit" class="btn-primary">Publish Post →</button>
    </div>
  </form>
</div>

<style>
  .editor-page {
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

  .error-banner {
    background: #fff4f4;
    border: 1px solid #e8c0c0;
    color: #c05050;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  label {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8a7e6a;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .label-hint {
    font-family: "DM Mono", monospace;
    font-size: 0.72rem;
    color: #c9a84c;
    text-transform: none;
    letter-spacing: 0;
    font-weight: 400;
  }

  input[type="text"] {
    background: #fff;
    border: 1px solid #e8e0d0;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    font-family: "DM Sans", sans-serif;
    font-size: 0.95rem;
    color: #1a1814;
    outline: none;
    transition: border-color 0.15s;
  }
  input[type="text"]:focus {
    border-color: #c9a84c;
  }
  input[type="text"]::placeholder {
    color: #c0b8a8;
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.75rem;
    padding-top: 0.5rem;
  }

  .btn-primary {
    background: #1a1814;
    color: #f0e8d8;
    padding: 0.65rem 1.4rem;
    border: none;
    border-radius: 4px;
    font-family: "DM Sans", sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    text-decoration: none;
  }
  .btn-primary:hover {
    background: #2e2a20;
  }

  .btn-ghost {
    background: none;
    border: 1px solid #e8e0d0;
    color: #8a7e6a;
    padding: 0.6rem 1.1rem;
    border-radius: 4px;
    font-family: "DM Sans", sans-serif;
    font-size: 0.875rem;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s;
  }
  .btn-ghost:hover {
    border-color: #c0b8a8;
    color: #1a1814;
  }
</style>

```

# src/routes/admin/posts/+page.server.ts

```ts
import db from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { user } = await parent();

  const posts = db.prepare(`
    SELECT id, title, slug, created_at FROM post
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(user.id);

  return { posts };
};

export const actions = {
  delete: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get('id')?.toString();

    if (!id) return fail(400, { error: 'Missing post ID' });

    // Make sure user owns this post
    const post = db.prepare('SELECT id FROM post WHERE id = ? AND user_id = ?')
      .get(id, locals.user?.id);

    if (!post) return fail(403, { error: 'Not authorized' });

    db.prepare('DELETE FROM post WHERE id = ?').run(id);
    return { success: true };
  }
};

```

# src/routes/admin/posts/+page.svelte

```svelte
<script>
  import { enhance } from "$app/forms";
  let { data } = $props();
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
        <div class="post-row">
          <div class="post-info">
            <a href="/admin/posts/{post.id}/edit" class="post-title"
              >{post.title}</a
            >
            <div class="post-meta">
              <span class="slug">/{post.slug}</span>
              <span class="dot">·</span>
              <span class="date"
                >{new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}</span
              >
            </div>
          </div>
          <div class="post-actions">
            <a href="/admin/posts/{post.id}/edit" class="action-btn edit"
              >Edit</a
            >
            <a href="/{post.slug}" target="_blank" class="action-btn view"
              >View ↗</a
            >
            <form method="POST" action="?/delete" use:enhance>
              <input type="hidden" name="id" value={post.id} />
              <button
                type="submit"
                class="action-btn delete"
                onclick="return confirm('Delete this post?')">Delete</button
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
</style>

```

# src/routes/admin/profile/+page.server.ts

```ts
import { fail } from '@sveltejs/kit';
import db from '$lib/server/db';

export const load = async ({ locals }) => {
  const profile = db.prepare('SELECT * FROM user WHERE id = ?').get(locals.user?.id);
  return { profile };
};

export const actions = {
  update: async ({ request, locals }) => {
    const data = await request.formData();
    const firstname = data.get('firstname')?.toString().trim() ?? '';
    const lastname = data.get('lastname')?.toString().trim() ?? '';
    const email = data.get('email')?.toString().trim() ?? '';
    const bio = data.get('bio')?.toString().trim() ?? '';
    const currentPassword = data.get('current_password')?.toString();
    const newPassword = data.get('new_password')?.toString();
    const confirmPassword = data.get('confirm_password')?.toString();

    // Update profile fields
    db.prepare(`
      UPDATE user SET firstname = ?, lastname = ?, email = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(firstname, lastname, email, bio, locals.user?.id);

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return fail(400, { error: 'Current password is required to set a new one.' });
      }
      if (newPassword !== confirmPassword) {
        return fail(400, { error: 'New passwords do not match.' });
      }
      if (newPassword.length < 6) {
        return fail(400, { error: 'New password must be at least 6 characters.' });
      }

      const user: any = db.prepare('SELECT password_hash FROM user WHERE id = ?').get(locals.user?.id);
      const valid = await Bun.password.verify(currentPassword, user.password_hash);
      if (!valid) {
        return fail(400, { error: 'Current password is incorrect.' });
      }

      const newHash = await Bun.password.hash(newPassword);
      db.prepare('UPDATE user SET password_hash = ? WHERE id = ?').run(newHash, locals.user?.id);
    }

    return { success: true };
  }
};

```

# src/routes/admin/profile/+page.svelte

```svelte
<script lang="ts">
  import { enhance } from "$app/forms";
  let { data, form } = $props();
</script>

<svelte:head><title>Profile — Admin</title></svelte:head>

<div class="profile-page">
  <header class="page-header">
    <h1>Profile</h1>
    <p>How readers will know you.</p>
  </header>

  {#if form?.error}
    <div class="error-banner">{form.error}</div>
  {/if}
  {#if form?.success}
    <div class="success-banner">Profile updated successfully.</div>
  {/if}

  <form method="POST" action="?/update" use:enhance class="profile-form">
    <div class="avatar-section">
      <div class="avatar-circle">
        {data.user.username?.[0]?.toUpperCase()}
      </div>
      <div>
        <p class="avatar-label">@{data.user.username}</p>
        <p class="avatar-hint">
          Member since {new Date(data.profile.created_at).toLocaleDateString(
            "en-US",
            { month: "long", year: "numeric" },
          )}
        </p>
      </div>
    </div>

    <div class="fields-grid">
      <div class="field">
        <label for="firstname">First Name</label>
        <input
          id="firstname"
          name="firstname"
          type="text"
          value={data.profile.firstname}
          placeholder="Jane"
        />
      </div>
      <div class="field">
        <label for="lastname">Last Name</label>
        <input
          id="lastname"
          name="lastname"
          type="text"
          value={data.profile.lastname}
          placeholder="Doe"
        />
      </div>
    </div>

    <div class="field">
      <label for="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={data.profile.email}
        placeholder="jane@example.com"
      />
    </div>

    <div class="field">
      <label for="bio"
        >Bio <span class="label-hint">Shown on your blog</span></label
      >
      <textarea id="bio" name="bio" rows="4" placeholder="A little about you…"
        >{data.profile.bio ?? ""}</textarea
      >
    </div>

    <div class="section-divider">
      <span>Change Password</span>
    </div>

    <div class="field">
      <label for="current_password">Current Password</label>
      <input
        id="current_password"
        name="current_password"
        type="password"
        placeholder="Leave blank to keep unchanged"
      />
    </div>

    <div class="fields-grid">
      <div class="field">
        <label for="new_password">New Password</label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          placeholder="Min 6 characters"
        />
      </div>
      <div class="field">
        <label for="confirm_password">Confirm New Password</label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          placeholder="Repeat new password"
        />
      </div>
    </div>

    <div class="form-footer">
      <button type="submit" class="btn-primary">Save Profile →</button>
    </div>
  </form>
</div>

<style>
  .profile-page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 640px;
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

  .error-banner {
    background: #fff4f4;
    border: 1px solid #e8c0c0;
    color: #c05050;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  .success-banner {
    background: #f4fff4;
    border: 1px solid #b0d8b0;
    color: #3a7a3a;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .profile-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .avatar-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: #fff;
    border: 1px solid #e8e0d0;
    border-radius: 6px;
  }

  .avatar-circle {
    width: 52px;
    height: 52px;
    background: #c9a84c;
    color: #1a1814;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Fraunces", serif;
    font-size: 1.4rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  .avatar-label {
    font-weight: 500;
    color: #1a1814;
    font-size: 0.9rem;
    margin-bottom: 0.15rem;
  }
  .avatar-hint {
    font-size: 0.78rem;
    color: #a09080;
  }

  .fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  label {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8a7e6a;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .label-hint {
    text-transform: none;
    letter-spacing: 0;
    font-size: 0.72rem;
    color: #c0b0a0;
    font-weight: 400;
  }

  input,
  textarea {
    background: #fff;
    border: 1px solid #e8e0d0;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    font-family: "DM Sans", sans-serif;
    font-size: 0.9rem;
    color: #1a1814;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
  }
  input:focus,
  textarea:focus {
    border-color: #c9a84c;
  }
  input::placeholder,
  textarea::placeholder {
    color: #c0b8a8;
  }
  textarea {
    resize: vertical;
    line-height: 1.6;
  }

  .section-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0.5rem 0;
  }
  .section-divider::before,
  .section-divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e8e0d0;
  }
  .section-divider span {
    font-size: 0.75rem;
    color: #a09080;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 0.5rem;
  }
  .btn-primary {
    background: #1a1814;
    color: #f0e8d8;
    padding: 0.65rem 1.4rem;
    border: none;
    border-radius: 4px;
    font-family: "DM Sans", sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-primary:hover {
    background: #2e2a20;
  }
</style>

```

# src/routes/logout/+page.server.ts

```ts

```

# static/robots.txt

```txt
# allow crawling everything by default
User-agent: *
Disallow:

```

