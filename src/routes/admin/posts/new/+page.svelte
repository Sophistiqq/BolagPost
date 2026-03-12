<script lang="ts">
  import { enhance } from "$app/forms";
  import RichEditor from "$lib/components/RichEditor.svelte";

  let { form } = $props();

  let title = $state("");
  let content = $state("");
  let slug = $state("");
  let excerpt = $state("");
  let tags = $state("");
  let status = $state("draft");
  let autoSlug = $state(true);
  let imagePreview = $state<string | null>(null);
  let isImageModalOpen = $state(false);

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
    autoSlug = false;
  }

  function onImageSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  function openImageModal() {
    if (imagePreview) isImageModalOpen = true;
  }

  function closeImageModal() {
    isImageModalOpen = false;
  }
</script>

<svelte:head><title>New Post — Admin</title></svelte:head>

{#if isImageModalOpen}
  <div
    class="modal-overlay"
    onclick={closeImageModal}
    onkeydown={(e) => e.key === "Escape" && closeImageModal()}
    role="button"
    tabindex="0"
  >
    <div
      class="modal-content"
      onclick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <img src={imagePreview} alt="Full preview" />
      <button class="modal-close" onclick={closeImageModal}>&times;</button>
    </div>
  </div>
{/if}

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
      formData.set("excerpt", excerpt);
      formData.set("tags", tags);
      formData.set("status", status);
    }}
    enctype="multipart/form-data"
  >
    <div class="main-content card">
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
        <label for="excerpt">Excerpt</label>
        <input
          id="excerpt"
          name="excerpt"
          type="text"
          placeholder="Brief summary for homepage..."
          value={excerpt}
        />
        <span class="field-hint"
          >Optional. Auto-generated from content if empty.</span
        >
      </div>

      <div class="field">
        <label>Content</label>
        <RichEditor onchange={(html) => (content = html)} />
        <input type="hidden" name="content" value={content} />
      </div>
    </div>

    <aside class="sidebar">
      <div class="sidebar-card card">
        <h3>Publish</h3>
        <div class="field">
          <label for="status">Status</label>
          <select id="status" name="status" bind:value={status}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button type="submit" class="btn-primary">
          {status === "published" ? "Publish" : "Save Draft"} →
        </button>
      </div>

      <div class="sidebar-card card">
        <h3>Featured Image</h3>
        <div class="field">
          <label for="featured_image" class="file-label">
            <input
              id="featured_image"
              name="featured_image"
              type="file"
              accept="image/*"
              hidden
              onchange={onImageSelect}
            />
            <span class="file-btn">Choose Image</span>
          </label>
          <span class="field-hint">JPEG, PNG, GIF, or WebP. Max 5MB.</span>
          {#if imagePreview}
            <div class="image-preview-wrap">
              <button
                type="button"
                class="image-preview"
                onclick={openImageModal}
                title="Click to enlarge"
              >
                <img src={imagePreview} alt="Preview" />
              </button>
              <button
                type="button"
                class="remove-image"
                onclick={() => {
                  imagePreview = null;
                  const input = document.getElementById(
                    "featured_image",
                  ) as HTMLInputElement;
                  if (input) input.value = "";
                }}>Remove</button
              >
            </div>
          {/if}
        </div>
      </div>

      <div class="sidebar-card card">
        <h3>Tags</h3>
        <div class="field">
          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="svelte, tutorial, web"
            value={tags}
          />
          <span class="field-hint">Comma-separated</span>
        </div>
      </div>
    </aside>
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

  form {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  .card {
    background: #fff;
    border: 1px solid #e8e0d0;
    border-radius: 6px;
    padding: 1.5rem;
  }

  .main-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .sidebar {
    width: 280px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sidebar-card h3 {
    font-family: "Fraunces", serif;
    font-size: 1rem;
    font-weight: 600;
    color: #1a1814;
    margin: 0 0 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f0ece4;
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

  .field-hint {
    font-size: 0.72rem;
    color: #a09080;
  }

  input[type="text"],
  input[type="email"],
  select {
    display: block;
    width: 100%;
    background: #fff;
    border: 1px solid #e8e0d0;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    font-family: "DM Sans", sans-serif;
    font-size: 0.9rem;
    color: #1a1814;
    outline: none;
    transition: border-color 0.15s;
  }
  input[type="text"]:focus,
  input[type="email"]:focus,
  select:focus {
    border-color: #c9a84c;
  }
  input[type="text"]::placeholder {
    color: #c0b8a8;
  }

  select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238a7e6a' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 2.5rem;
  }

  .file-label {
    cursor: pointer;
    text-transform: none;
  }

  .file-btn {
    display: block;
    text-align: center;
    background: #f7f4ef;
    border: 1px dashed #c9a84c;
    color: #c9a84c;
    padding: 0.75rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.15s;
  }
  .file-btn:hover {
    background: #fdf8ee;
    border-style: solid;
  }

  .image-preview-wrap {
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .image-preview {
    background: none;
    border: 1px solid #e8e0d0;
    padding: 0;
    cursor: zoom-in;
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    max-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-preview img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
  }

  .remove-image {
    width: 100%;
    background: #fff4f4;
    color: #c05050;
    border: 1px solid #e8c0c0;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .remove-image:hover {
    background: #ffe0e0;
  }

  .btn-primary {
    width: 100%;
    margin-top: 0.75rem;
    background: #1a1814;
    color: #f0e8d8;
    padding: 0.75rem 1.4rem;
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

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
    cursor: zoom-out;
  }

  .modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    cursor: default;
  }

  .modal-content img {
    max-width: 100%;
    max-height: 90vh;
    display: block;
    object-fit: contain;
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .modal-close:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  @media (max-width: 900px) {
    form {
      flex-direction: column;
    }
    .sidebar {
      width: 100%;
      order: -1;
    }
  }

  @media (max-width: 600px) {
    .page-header h1 {
      font-size: 1.5rem;
    }

    .card {
      padding: 1rem;
    }

    .main-content {
      gap: 1rem;
    }
  }
</style>
