import { redirect } from '@sveltejs/kit';

// This protects every page inside /admin
export const load = async ({ parent }) => {
  const { user } = await parent();

  if (!user) {
    throw redirect(302, '/login');
  }

  return { user };
};
