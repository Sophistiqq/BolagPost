import { lucia } from '$lib/server/auth';
import { initDb } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

// Initialize DB once on server start (or first request)
let dbInitialized = false;

export const handle: Handle = async ({ event, resolve }) => {
  if (!dbInitialized) {
    // We don't await this to avoid blocking the very first request's TTFB, 
    // but the tables will be ready shortly.
    initDb().then(() => { dbInitialized = true; });
  }

  const sessionId = event.cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '/',
      ...sessionCookie.attributes
    });
  }

  if (!session) {
    const blankCookie = lucia.createBlankSessionCookie();
    event.cookies.set(blankCookie.name, blankCookie.value, {
      path: '/',
      ...blankCookie.attributes
    });
  }

  event.locals.user = user as (typeof event.locals.user);
  event.locals.session = session;

  return resolve(event);
};
