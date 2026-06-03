// src/inngest/client.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "mybudget",
  name: "My budget",
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000, // Exponential backoff
    maxAttempts: 2,
  }),
});
