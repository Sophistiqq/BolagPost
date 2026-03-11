declare global {
  namespace App {
    interface Locals {
      user: (import('lucia').User & { username: string }) | null;
      session: import('lucia').Session | null;
    }
  }
}
export { };
