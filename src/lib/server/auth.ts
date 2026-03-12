import { Lucia } from "lucia";
import { PostgresAdapter } from "./db-adapter";
import { getDb } from "./db";

const adapter = new PostgresAdapter(getDb(), {
  user: 'user',
  session: 'session'
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: { secure: process.env.NODE_ENV === 'production' }
  },
  getUserAttributes: (data: any) => ({ username: data.username })
});
