import postgres from "postgres";

// Singleton instance
let sql: postgres.Sql;

export function getDb() {
  if (!sql) {
    const connectionString = process.env.DATABASE_URL || "postgres://localhost/svelty";
    
    sql = postgres(connectionString, {
      max: 1, // Vercel Serverless works best with 1 connection per instance
      idle_timeout: 20,
      connect_timeout: 10,
      // Disable prepared statements to save a roundtrip (standard for serverless)
      prepare: false 
    });
  }
  return sql;
}

/**
 * Migration/Initialization script. 
 * Should be called once, or via a manual trigger.
 */
export async function initDb() {
  const db = getDb();
  
  try {
    // Run all table creations in a single transaction for speed
    await db.begin(async (tx) => {
      await tx`CREATE TABLE IF NOT EXISTS "user" (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        bio TEXT,
        image TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

      await tx`CREATE TABLE IF NOT EXISTS "session" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES "user"(id),
        expires_at TIMESTAMPTZ NOT NULL
      )`;

      await tx`CREATE TABLE IF NOT EXISTS post (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image TEXT,
        status TEXT NOT NULL DEFAULT 'draft',
        views INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMPTZ,
        user_id TEXT NOT NULL REFERENCES "user"(id)
      )`;

      await tx`CREATE TABLE IF NOT EXISTS tag (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

      await tx`CREATE TABLE IF NOT EXISTS post_tag (
        post_id INTEGER NOT NULL REFERENCES post(id) ON DELETE CASCADE,
        tag_id INTEGER NOT NULL REFERENCES tag(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id)
      )`;
    });
    console.log("Database initialized successfully");
  } catch (e) {
    console.error('Failed to initialize database:', e);
  }
}

export default getDb;
