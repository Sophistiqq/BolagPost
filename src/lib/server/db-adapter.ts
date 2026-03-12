import type { Adapter, DatabaseSession, DatabaseUser } from 'lucia';
import { type Client, createClient } from '@libsql/client';
import { initDb } from './db';

interface Tables {
  user: string;
  session: string;
}

interface SessionCache {
  session: DatabaseSession | null;
  user: DatabaseUser | null;
  timestamp: number;
}

export class TursoAdapter implements Adapter {
  private client: Client;
  private tables: Tables;
  private sessionCache: Map<string, SessionCache> = new Map();
  private readonly CACHE_TTL = 1000; // 1 second cache

  constructor(client: Client, tables: Tables) {
    this.client = client;
    this.tables = tables;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await initDb();
    await this.client.execute({
      sql: `DELETE FROM ${this.tables.session} WHERE id = ?`,
      args: [sessionId]
    });
    this.sessionCache.delete(sessionId);
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await initDb();
    await this.client.execute({
      sql: `DELETE FROM ${this.tables.session} WHERE user_id = ?`,
      args: [userId]
    });
    this.sessionCache.clear();
  }

  async getSessionAndUser(sessionId: string): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    await initDb();
    // Check cache first
    const cached = this.sessionCache.get(sessionId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return [cached.session, cached.user];
    }

    const result = await this.client.execute({
      sql: `
        SELECT 
          s.id AS session_id, s.user_id, s.expires_at,
          u.username, u.email, u.firstname, u.lastname
        FROM ${this.tables.session} s 
        JOIN ${this.tables.user} u ON u.id = s.user_id 
        WHERE s.id = ?
      `,
      args: [sessionId]
    });

    if (result.rows.length === 0) {
      this.sessionCache.delete(sessionId);
      return [null, null];
    }

    const row = result.rows[0] as any;
    const session: DatabaseSession = {
      id: row.session_id,
      userId: row.user_id,
      expiresAt: new Date(row.expires_at * 1000),
      attributes: {}
    };
    const user: DatabaseUser = {
      id: row.user_id,
      attributes: {
        username: row.username,
        email: row.email,
        firstname: row.firstname,
        lastname: row.lastname
      }
    };

    this.sessionCache.set(sessionId, { session, user, timestamp: Date.now() });
    return [session, user];
  }

  async getUserSessions(userId: string): Promise<DatabaseSession[]> {
    await initDb();
    const result = await this.client.execute({
      sql: `SELECT * FROM ${this.tables.session} WHERE user_id = ?`,
      args: [userId]
    });

    return result.rows.map(row => ({
      id: (row as any).id,
      userId: (row as any).user_id,
      expiresAt: new Date((row as any).expires_at * 1000),
      attributes: {}
    }));
  }

  async setSession(session: DatabaseSession): Promise<void> {
    await initDb();
    await this.client.execute({
      sql: `INSERT INTO ${this.tables.session} (id, user_id, expires_at) VALUES (?, ?, ?)`,
      args: [
        session.id,
        session.userId,
        Math.floor(session.expiresAt.getTime() / 1000)
      ]
    });
  }

  async updateSessionExpiration(
    sessionId: string,
    expiresAt: Date
  ): Promise<void> {
    await initDb();
    await this.client.execute({
      sql: `UPDATE ${this.tables.session} SET expires_at = ? WHERE id = ?`,
      args: [Math.floor(expiresAt.getTime() / 1000), sessionId]
    });
  }

  async deleteExpiredSessions(): Promise<void> {
    await initDb();
    const now = Math.floor(Date.now() / 1000);
    await this.client.execute({
      sql: `DELETE FROM ${this.tables.session} WHERE expires_at < ?`,
      args: [now]
    });
  }
}
