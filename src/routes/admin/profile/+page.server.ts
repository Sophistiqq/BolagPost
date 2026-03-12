import { fail, error } from '@sveltejs/kit';
import db from '$lib/server/db-helper';
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const buffer = scryptSync(password, salt, 64);
  return timingSafeEqual(buffer, Buffer.from(hash, 'hex'));
}

export const load = async ({ locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const profile: any = await db.prepare('SELECT * FROM "user" WHERE id = ?').get(locals.user.id);
  return { profile };
};

export const actions = {
  update: async ({ request, locals }) => {
    if (!locals.user) throw error(401, 'Unauthorized');

    const data = await request.formData();
    const firstname = data.get('firstname')?.toString().trim() ?? '';
    const lastname = data.get('lastname')?.toString().trim() ?? '';
    const email = data.get('email')?.toString().trim() ?? '';
    const bio = data.get('bio')?.toString().trim() ?? '';
    const currentPassword = data.get('current_password')?.toString();
    const newPassword = data.get('new_password')?.toString();
    const confirmPassword = data.get('confirm_password')?.toString();

    // Update profile fields
    await db.prepare(`
      UPDATE "user" SET firstname = ?, lastname = ?, email = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(firstname, lastname, email, bio, locals.user.id);

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return fail(400, { error: 'Current password is required to set a new one.' });
      }
      if (newPassword !== confirmPassword) {
        return fail(400, { error: 'New passwords do not match.' });
      }
      if (newPassword.length < 6) {
        return fail(400, { error: 'New password must be at least 6 characters.' });
      }

      const user: any = await db.prepare('SELECT password_hash FROM "user" WHERE id = ?').get(locals.user.id);
      const valid = verifyPassword(currentPassword, user.password_hash);
      if (!valid) {
        return fail(400, { error: 'Current password is incorrect.' });
      }

      const newHash = hashPassword(newPassword);
      await db.prepare('UPDATE "user" SET password_hash = ? WHERE id = ?').run(newHash, locals.user.id);
    }

    return { success: true };
  }
};
