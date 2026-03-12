# Turso Migration Summary

## ✅ What Was Changed

### 1. Database Layer (`src/lib/server/`)

**New Files:**
- `db.ts` - Turso client initialization
- `db-helper.ts` - SQLite-compatible API wrapper

**Changes:**
- Replaced `bun:sqlite` with `@libsql/client`
- All queries are now async (using `await`)
- Added `initDb()` function to create tables automatically

### 2. Updated Routes

All `.server.ts` files updated to use async queries:
- `src/routes/(blog)/+page.server.ts`
- `src/routes/(blog)/[slug]/+page.server.ts`
- `src/routes/(blog)/rss.xml/+server.ts`
- `src/routes/search/+page.server.ts`
- `src/routes/admin/+page.server.ts`
- `src/routes/admin/posts/+page.server.ts`
- `src/routes/admin/posts/new/+page.server.ts`
- `src/routes/admin/posts/[id]/edit/+page.server.ts`
- `src/routes/admin/profile/+page.server.ts`
- `src/routes/(auth)/login/+page.server.ts`
- `src/routes/(auth)/register/+page.server.ts`

**Pattern Change:**
```typescript
// Before (SQLite)
const posts = db.prepare('SELECT * FROM post').all();

// After (Turso)
const posts = await db.prepare('SELECT * FROM post').all();
```

### 3. Package Dependencies

**Added:**
- `@libsql/client@0.17.0`

## 🚀 How to Use

### Local Development (SQLite)
```bash
# No setup needed - uses blog.sqlite file
bun run dev
```

### With Turso (Vercel)
```bash
# 1. Set environment variables
export TURSO_DATABASE_URL=libsql://...
export TURSO_AUTH_TOKEN=ey...

# 2. Run dev server
bun run dev

# 3. Deploy to Vercel
vercel
```

## 📝 Key Points

1. **All queries are now async** - Use `await` for all database calls
2. **Tables auto-create** - `initDb()` runs on first connection
3. **Backwards compatible** - Works with SQLite locally, Turso in production
4. **No data migration needed** - Start fresh on Turso or export/import SQLite data

## 🔗 Resources

- Setup guide: `MIGRATION.md`
- Environment variables: `.env.example`
- Turso docs: https://docs.turso.tech

## ⚠️ Breaking Changes

If you have custom code using `db` directly:

```typescript
// Old import
import db from '$lib/server/db';

// New import
import db from '$lib/server/db-helper';

// All calls must be async
const result = await db.prepare('...').get(...);
```
