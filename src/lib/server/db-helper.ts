import { getDb, initDb } from './db';

export class Database {
  prepare(sql: string) {
    return {
      get: async (...params: any[]) => {
        await initDb();
        const db = getDb();
        const result = await db.execute({ sql, args: params });
        return result.rows[0] || null;
      },
      all: async (...params: any[]) => {
        await initDb();
        const db = getDb();
        const result = await db.execute({ sql, args: params });
        return result.rows;
      },
      run: async (...params: any[]) => {
        await initDb();
        const db = getDb();
        // Convert undefined to null for libSQL compatibility
        const sanitizedParams = params.map(p => p === undefined ? null : p);
        const result = await db.execute({ sql, args: sanitizedParams });
        return {
          lastInsertRowid: result.lastInsertRowid,
          changes: result.rowsAffected
        };
      }
    };
  }

  async exec(sql: string) {
    await initDb();
    const db = getDb();
    await db.execute(sql);
  }
}

export const db = new Database();
export default db;
