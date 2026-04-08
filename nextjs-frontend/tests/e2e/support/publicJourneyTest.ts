import { expect, test as base } from "@playwright/test";

import { mockSupabase } from "./mockSupabase";

export const test = base.extend({
  page: async ({ page }, use) => {
    await mockSupabase(page);
    await use(page);
  },
});

export { expect };
