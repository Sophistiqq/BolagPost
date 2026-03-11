import type { Actions } from "./$types";

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const name = data.get('name');
    console.log(name);
    return {
      body: {
        message: `Hello ${name}!`,
      },
    };
  },
} satisfies Actions;
