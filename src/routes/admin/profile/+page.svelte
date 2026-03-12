<script lang="ts">
  import { enhance } from "$app/forms";
  let { data, form } = $props<{ data: { user: any; profile: any }; form?: any }>();
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
  @media (max-width: 600px) {
    .fields-grid {
      grid-template-columns: 1fr;
    }
    
    .page-header h1 {
      font-size: 1.5rem;
    }
    
    .form-footer {
      justify-content: stretch;
    }
    
    .btn-primary {
      width: 100%;
    }
  }
</style>
