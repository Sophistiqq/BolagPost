import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import db from '$lib/server/db-helper';

export const load = async ({ locals }) => {
  if (locals.user) throw redirect(302, '/admin');
  return {};
};

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString().trim();
    const password = data.get('password')?.toString();

    // --- Basic validation ---
    if (!username || !password) {
      return fail(400, { error: 'Username and password are required.', username });
    }

    // --- Look up user ---
    const user: any = await db.prepare('SELECT * FROM "user" WHERE username = ?').get(username);
    if (!user) {
      // Generic message — don't reveal whether user exists
      return fail(400, { error: 'Incorrect username or password.', username });
    }

    // --- Check password ---
    const validPassword = await Bun.password.verify(password, user.password_hash);
    if (!validPassword) {
      return fail(400, { error: 'Incorrect username or password.', username });
    }

    // --- Create session ---
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '/',
      ...sessionCookie.attributes
    });

    // --- Redirect to admin/dashboard after login ---
    throw redirect(302, '/admin');
  }
};
