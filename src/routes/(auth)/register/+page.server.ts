import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import db from '$lib/server/db-helper';
import { generateId } from 'lucia';

export const actions = {
  register: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString().trim();
    const password = data.get('password')?.toString();
    const email = data.get('email')?.toString().trim();
    const firstname = data.get('firstname')?.toString().trim();
    const lastname = data.get('lastname')?.toString().trim();

    // --- Validation ---
    if (!username || !password) {
      return fail(400, { error: 'All fields are required.', username });
    }
    if (username.length < 3) {
      return fail(400, { error: 'Username must be at least 3 characters.', username });
    }
    if (password.length < 6) {
      return fail(400, { error: 'Password must be at least 6 characters.', username });
    }

    // --- Check if username taken ---
    const existing = await db.prepare('SELECT id FROM user WHERE username = ?').get(username);
    if (existing) {
      return fail(400, { error: 'Username already taken.', username });
    }

    // --- Hash password and create user ---
    const passwordHash = await Bun.password.hash(password);
    const userId = generateId(15);

    await db.prepare(
      'INSERT INTO user (id, username, password_hash, email, firstname, lastname) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(userId, username, passwordHash, email ?? '', firstname ?? '', lastname ?? '');

    // --- Create session and log in immediately ---
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });

    throw redirect(302, '/admin');
  }
};
