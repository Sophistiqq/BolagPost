<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Placeholder from "@tiptap/extension-placeholder";
  import Image from "@tiptap/extension-image";

  let {
    content = "",
    onchange,
  }: { content?: string; onchange?: (html: string) => void } = $props();

  let element: HTMLDivElement;
  let editor: Editor;
  let imageInput: HTMLInputElement;
  let isInitialized = false;

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        StarterKit,
        Image.configure({
          HTMLAttributes: {
            class: 'editor-image'
          },
          allowBase64: true
        }),
        Placeholder.configure({ placeholder: "Start writing your post…" }),
      ],
      content,
      onUpdate: ({ editor }) => {
        onchange?.(editor.getHTML());
      },
    });
    isInitialized = true;
  });

  $effect(() => {
    if (isInitialized && editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
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
  function addImage() {
    const url = prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }
  function uploadImage() {
    imageInput?.click();
  }
  function handleImageFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }
</script>

<div class="editor-wrap">
  <input 
    type="file" 
    accept="image/*" 
    hidden 
    bind:this={imageInput}
    onchange={handleImageFile}
  />
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
      <button type="button" onclick={uploadImage} title="Upload image">📷 Upload</button>
      <button type="button" onclick={addImage} title="Insert image URL">🔗 URL</button>
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
  :global(.editor-body .editor-image) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1.5rem 0;
    display: block;
  }
  :global(.editor-body .ProseMirror-selectednode .editor-image) {
    outline: 2px solid #c9a84c;
  }
</style>
