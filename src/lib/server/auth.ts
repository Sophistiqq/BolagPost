import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import db from "./db"


const adapter = new BetterSqlite3Adapter(db as any, {
  user: 'user',
  session: 'session'
})

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: { secure: process.env.NODE_ENV === 'production' }
  },
  getUserAttributes: (data: any) => ({ username: data.username })
})
