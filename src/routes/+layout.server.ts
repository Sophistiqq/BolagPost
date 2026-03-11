
import { lucia } from '$lib/server/auth';

// This runs on every request and makes `user` available in all pages
export const load = async ({ cookies }) => {
  const sessionId = cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    return { user: null };
  }

  const { session, user } = await lucia.validateSession(sessionId);

  // Refresh cookie if session was extended
  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '/',
      ...sessionCookie.attributes
    });
  }

  // Clear cookie if session is invalid
  if (!session) {
    const blankCookie = lucia.createBlankSessionCookie();
    cookies.set(blankCookie.name, blankCookie.value, {
      path: '/',
      ...blankCookie.attributes
    });
  }

  return { user };
};
