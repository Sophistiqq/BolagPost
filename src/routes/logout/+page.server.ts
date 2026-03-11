import { lucia } from '$lib/server/auth';
import { redirect, fail } from '@sveltejs/kit';

export const actions = {
  logout: async ({ cookies }) => {
    const sessionId = cookies.get(lucia.sessionCookieName);
    if (!sessionId) {
      throw redirect(302, '/login');
    }

    await lucia.invalidateSession(sessionId);

    const blankCookie = lucia.createBlankSessionCookie();
    cookies.set(blankCookie.name, blankCookie.value, {
      path: '/',
      ...blankCookie.attributes
    });

    throw redirect(302, '/login');
  }
}
