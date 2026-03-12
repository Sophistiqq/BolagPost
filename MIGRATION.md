# Turso Database Setup Guide

This guide will help you migrate from SQLite to Turso (libSQL) for Vercel deployment.

## What is Turso?

Turso is a SQLite-compatible database built on libSQL that works perfectly with serverless platforms like Vercel. It offers:
- **9 GB storage** free tier
- **Edge replication** for faster queries
- **SQLite-compatible** syntax
- **Vercel integration**

## Setup Steps

### 1. Create a Turso Account

1. Go to [https://turso.tech](https://turso.tech)
2. Sign up with GitHub
3. Install the Turso CLI:
   ```bash
   # macOS
   brew install tursodatabase/tap/turso
   
   # Or with npm
   npm install -g @libsql/turso
   ```

### 2. Create a Database

```bash
# Login to Turso
turso auth login

# Create a new database
turso db create svelty-blog

# Check database info
turso db info svelty-blog
```

### 3. Get Database Credentials

```bash
# Get the database URL
turso db show svelty-blog

# Create an auth token
turso db tokens create svelty-blog
```

You'll get:
- **Database URL**: `libsql://your-org-svelty-blog.turso.io`
- **Auth Token**: A long string starting with `ey...`

### 4. Set Environment Variables

Create a `.env` file in your project root:

```bash
TURSO_DATABASE_URL=libsql://your-org-svelty-blog.turso.io
TURSO_AUTH_TOKEN=ey...
```

For Vercel, add these in your Vercel project settings:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`

### 5. Initialize the Database

The database tables will be created automatically on first run. To manually initialize:

```bash
# Start your dev server - tables will be created automatically
bun run dev
```

Or use the migration script:

```bash
bun run scripts/migrate.ts
```

### 6. Migrate Existing Data (Optional)

If you have existing data in `blog.sqlite`:

```bash
# Export existing data
sqlite3 blog.sqlite .dump > backup.sql

# Import to Turso (optional, for advanced users)
turso db shell svelty-blog < backup.sql
```

### 7. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Make sure your environment variables are set in Vercel!

## Local Development

For local development, the app will use a local SQLite file (`blog.sqlite`) if Turso credentials are not provided:

```bash
# Local dev (uses SQLite file)
bun run dev

# With Turso (uses remote database)
TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... bun run dev
```

## API Reference

The database API is similar to the original `bun:sqlite`:

```typescript
import db from '$lib/server/db-helper';

// Get single row
const user = await db.prepare('SELECT * FROM user WHERE id = ?').get(userId);

// Get multiple rows
const posts = await db.prepare('SELECT * FROM post WHERE status = ?').all('published');

// Insert/Update/Delete
const result = await db.prepare('INSERT INTO post (...) VALUES (...)').run(...values);
```

## Troubleshooting

### "Connection timeout"
- Check your Turso URL is correct
- Ensure auth token is valid
- Check firewall/network settings

### "Table doesn't exist"
- Tables are created on first run
- Check `initDb()` is called (it's called automatically)

### "Authentication failed"
- Regenerate your auth token: `turso db tokens create svelty-blog`
- Update `.env` file

## Resources

- [Turso Docs](https://docs.turso.tech)
- [libSQL Client](https://docs.turso.tech/reference/client-access/javascript-typescript-sdk)
- [Vercel Deployment](https://vercel.com/docs/deployments/git)

## Support

For issues or questions:
- Turso Discord: https://discord.turso.tech
- Turso Docs: https://docs.turso.tech
