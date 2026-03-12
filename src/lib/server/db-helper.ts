import { getDb } from './db';

export class Database {
  prepare(query: string) {
    let i = 1;
    const pgQuery = query.replace(/\?/g, () => `$${i++}`);

    return {
      get: async (...params: any[]) => {
        const results = await getDb().unsafe(pgQuery, params);
        return results[0] || null;
      },
      all: async (...params: any[]) => {
        return await getDb().unsafe(pgQuery, params);
      },
      run: async (...params: any[]) => {
        let finalQuery = pgQuery;
        if (pgQuery.trim().toUpperCase().startsWith('INSERT') && !pgQuery.toUpperCase().includes('RETURNING')) {
          finalQuery += ' RETURNING id';
        }
        const result = await getDb().unsafe(finalQuery, params);
        return {
          lastInsertRowid: result?.[0]?.id || 0,
          changes: result.length
        };
      }
    };
  }

  async exec(sql: string) {
    await getDb().unsafe(sql, []);
  }
}

export const db = new Database();
export default db;
