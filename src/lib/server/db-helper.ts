import { getDb } from './db';

export class Database {
  prepare(query: string) {
    let i = 1;
    const pgQuery = query.replace(/\?/g, () => `$${i++}`);

    return {
      get: async (...params: any[]) => {
        const sql = getDb();
        const results = await sql.unsafe(pgQuery, params);
        return results[0] || null;
      },
      all: async (...params: any[]) => {
        const sql = getDb();
        return await sql.unsafe(pgQuery, params);
      },
      run: async (...params: any[]) => {
        const sql = getDb();
        let finalQuery = pgQuery;
        if (pgQuery.trim().toUpperCase().startsWith('INSERT') && !pgQuery.toUpperCase().includes('RETURNING')) {
          finalQuery += ' RETURNING id';
        }
        const result = await sql.unsafe(finalQuery, params);
        return {
          lastInsertRowid: result?.[0]?.id || 0,
          changes: result.length
        };
      }
    };
  }

  async exec(sql: string) {
    const db = getDb();
    await db.unsafe(sql, []);
  }
}

export const db = new Database();
export default db;
