<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Placeholder from "@tiptap/extension-placeholder";
  import Image from "@tiptap/extension-image";
  import BubbleMenu from "@tiptap/extension-bubble-menu";

  let {
    content = "",
    onchange,
  }: { content?: string; onchange?: (html: string) => void } = $props();

  let element: HTMLDivElement;
  let bubbleMenuElement: HTMLDivElement;
  let editor = $state<Editor>();
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
        BubbleMenu.configure({
          element: bubbleMenuElement,
          shouldShow: ({ state }) => {
            const { selection } = state;
            const { empty } = selection;
            return !empty;
          },
        }),
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

  // Command wrappers
  function toggleBold() { editor?.chain().focus().toggleBold().run(); }
  function toggleItalic() { editor?.chain().focus().toggleItalic().run(); }
  function toggleH2() { editor?.chain().focus().toggleHeading({ level: 2 }).run(); }
  function toggleH3() { editor?.chain().focus().toggleHeading({ level: 3 }).run(); }
  function toggleBullet() { editor?.chain().focus().toggleBulletList().run(); }
  function toggleOrdered() { editor?.chain().focus().toggleOrderedList().run(); }
  function toggleBlockquote() { editor?.chain().focus().toggleBlockquote().run(); }
  function toggleCode() { editor?.chain().focus().toggleCodeBlock().run(); }
  function undo() { editor?.chain().focus().undo().run(); }
  function redo() { editor?.chain().focus().redo().run(); }
  
  function addImage() {
    const url = prompt('Enter image URL:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }
  
  function uploadImage() { imageInput?.click(); }
  
  function handleImageFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        editor?.chain().focus().setImage({ src }).run();
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

  <!-- Bubble Menu (Selection-based) -->
  <div bind:this={bubbleMenuElement} class="bubble-menu">
    <button type="button" onclick={toggleBold} class:active={editor?.isActive('bold')} title="Bold">
      <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
    </button>
    <button type="button" onclick={toggleItalic} class:active={editor?.isActive('italic')} title="Italic">
      <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
    </button>
    <button type="button" onclick={toggleCode} class:active={editor?.isActive('codeBlock')} title="Code">
      <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
    </button>
  </div>

  <div class="toolbar">
    <div class="toolbar-group">
      <button type="button" onclick={toggleBold} class:active={editor?.isActive('bold')} title="Bold">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
      </button>
      <button type="button" onclick={toggleItalic} class:active={editor?.isActive('italic')} title="Italic">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
      </button>
    </div>
    
    <div class="divider"></div>
    
    <div class="toolbar-group">
      <button type="button" onclick={toggleH2} class:active={editor?.isActive('heading', { level: 2 })} title="Heading 2">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M5 4v7h10V4h2v15h-2v-6H5v6H3V4h2zm11.231 15v-1.789c.478-.444 1.144-1.044 2-1.8.855-.756 1.439-1.328 1.75-1.716.311-.389.553-.761.725-1.117a3.483 3.483 0 0 0 .258-1.373c0-.5-.108-.942-.325-1.325a2.227 2.227 0 0 0-.916-.889c-.394-.216-.867-.325-1.417-.325-.561 0-1.047.114-1.458.342-.411.227-.722.544-.933.95s-.317.886-.317 1.442H14c0-.989.214-1.814.642-2.475.428-.661 1.011-1.147 1.75-1.458.739-.311 1.572-.467 2.5-.467 1.022 0 1.897.181 2.625.542.728.361 1.272.875 1.633 1.542.361.667.542 1.428.542 2.283 0 .544-.064 1.042-.192 1.492a5.717 5.717 0 0 1-.55 1.408c-.239.428-.592.908-1.058 1.442-.467.533-1.089 1.158-1.867 1.875l-1.433 1.342h6.058V19h-9.115z"/></svg>
      </button>
      <button type="button" onclick={toggleH3} class:active={editor?.isActive('heading', { level: 3 })} title="Heading 3">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M5 4v7h10V4h2v15h-2v-6H5v6H3V4h2zm13.136 10.375a3.344 3.344 0 0 0 1.571 1.042c.633.194 1.306.292 2.017.292.511 0 .983-.067 1.417-.2s.783-.322 1.05-.567c.267-.244.4-.556.4-.933 0-.322-.092-.603-.275-.842a1.597 1.597 0 0 0-.742-.558c-.378-.15-.817-.225-1.317-.225h-1.35v-1.767h1.083c.456 0 .864-.067 1.225-.2.361-.133.647-.328.858-.583.211-.256.317-.575.317-.958 0-.367-.119-.664-.358-.892-.239-.228-.558-.392-.958-.492a4.42 4.42 0 0 0-1.125-.15c-.489 0-.944.067-1.367.2-.422.133-.764.328-1.025.583-.261.256-.444.575-.55.958H16.15c.089-.867.35-1.6.783-2.2.433-.6.994-1.053 1.683-1.358.689-.306 1.467-.458 2.333-.458.911 0 1.733.153 2.467.458.733.306 1.306.744 1.717 1.317.411.572.617 1.233.617 1.983 0 .478-.089.925-.267 1.342-.178.417-.453.778-.825 1.083-.372.306-.85.55-1.433.733v.1c.711.167 1.289.467 1.733.9.444.433.764.956.958 1.567.194.611.292 1.281.292 2.008 0 .822-.192 1.547-.575 2.175-.383.628-.936 1.114-1.658 1.458-.722.344-1.575.517-2.558.517-.967 0-1.847-.175-2.642-.525-.794-.35-1.425-.85-1.892-1.5-.467-.65-.725-1.436-.775-2.358h1.91z"/></svg>
      </button>
    </div>

    <div class="divider"></div>

    <div class="toolbar-group">
      <button type="button" onclick={toggleBullet} class:active={editor?.isActive('bulletList')} title="List">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
      </button>
      <button type="button" onclick={toggleOrdered} class:active={editor?.isActive('orderedList')} title="Numbers">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
      </button>
    </div>

    <div class="divider"></div>

    <div class="toolbar-group">
      <button type="button" onclick={toggleBlockquote} class:active={editor?.isActive('blockquote')} title="Quote">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
      </button>
      <button type="button" onclick={toggleCode} class:active={editor?.isActive('codeBlock')} title="Code">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
      </button>
    </div>

    <div class="divider"></div>

    <div class="toolbar-group">
      <button type="button" onclick={uploadImage} title="Upload">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 7v2.99s-1.99.01-2 0V7h-3V5h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/></svg>
      </button>
      <button type="button" onclick={addImage} title="URL">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
      </button>
    </div>

    <div class="divider mobile-hide"></div>

    <div class="toolbar-group mobile-hide">
      <button type="button" onclick={undo} title="Undo">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
      </button>
      <button type="button" onclick={redo} title="Redo">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>
      </button>
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

  /* Bubble Menu */
  .bubble-menu {
    display: none;
    background: #1a1814;
    padding: 0.25rem;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    gap: 0.25rem;
  }

  :global(.editor-body .ProseMirror) .bubble-menu {
    display: flex;
  }

  .bubble-menu button {
    background: none;
    border: none;
    color: #8a7e6a;
    padding: 0.4rem;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.15s;
  }

  .bubble-menu button:hover {
    color: #f0e8d8;
    background: #2e2a20;
  }

  .bubble-menu button.active {
    color: #c9a84c;
    background: #221e18;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 0.15rem;
    padding: 0.4rem 0.6rem;
    background: #f7f4ef;
    border-bottom: 1px solid #e8e0d0;
    flex-wrap: wrap;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .toolbar-group {
    display: flex;
    gap: 0.1rem;
  }

  .toolbar button {
    background: none;
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 0.4rem;
    color: #5a5248;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toolbar button:hover {
    background: #fff;
    border-color: #e0d8cc;
    color: #1a1814;
  }

  .toolbar button.active {
    background: #fff;
    border-color: #c9a84c;
    color: #c9a84c;
  }

  .divider {
    width: 1px;
    height: 18px;
    background: #e0d8cc;
    margin: 0 0.4rem;
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

  @media (max-width: 600px) {
    .mobile-hide {
      display: none;
    }
    
    .toolbar {
      padding: 0.25rem;
      gap: 0.1rem;
    }
    
    .divider {
      margin: 0 0.15rem;
    }
    
    .editor-body {
      padding: 1rem;
      min-height: 300px;
    }
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
