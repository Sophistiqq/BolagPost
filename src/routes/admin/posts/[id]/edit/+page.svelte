<script lang="ts">
  import { enhance } from "$app/forms";
  import RichEditor from "$lib/components/RichEditor.svelte";

  let { data, form } = $props<{ data: { post: any }; form?: any }>();

  let title = $state(data.post.title);
  let slug = $state(data.post.slug);
  let content = $state(data.post.content);
  let imagePreview = $state<string | null>(data.post.featured_image || null);

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
        content={content}
        onchange={(html) => (content = html)}
      />
      <input type="hidden" name="content" value={content} />
    </div>

    <div class="field">
      <label for="featured_image">Featured Image</label>
      <label for="featured_image" class="file-input-label">
        <span class="file-input-btn">Choose Image</span>
        <input
          id="featured_image"
          name="featured_image"
          type="file"
          accept="image/*"
          hidden
          onchange={onImageSelect}
        />
      </label>
      <span class="field-hint">JPEG, PNG, GIF, or WebP. Max 5MB.</span>
      {#if imagePreview}
        <div class="image-preview">
          <img src={imagePreview} alt="Preview" />
          <button type="button" class="remove-image" onclick={() => {
            imagePreview = null;
            const input = document.getElementById('featured_image') as HTMLInputElement;
            if (input) input.value = '';
          }}>Remove</button>
        </div>
      {/if}
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
  .field-hint {
    font-size: 0.75rem;
    color: #8a7e6a;
    margin-top: 0.25rem;
    display: block;
  }
  .file-input-label {
    display: block;
    cursor: pointer;
  }
  .file-input-btn {
    display: inline-block;
    background: #f7f4ef;
    border: 1px dashed #c9a84c;
    color: #c9a84c;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.15s;
  }
  .file-input-btn:hover {
    background: #fdf8ee;
    border-style: solid;
  }
  .image-preview {
    margin-top: 0.75rem;
  }
  .image-preview img {
    width: 100%;
    max-width: 300px;
    height: auto;
    border-radius: 4px;
    border: 1px solid #e8e0d0;
    display: block;
    margin-bottom: 0.5rem;
  }
  .remove-image {
    background: #fff4f4;
    color: #c05050;
    border: 1px solid #e8c0c0;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .remove-image:hover {
    background: #ffe0e0;
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
