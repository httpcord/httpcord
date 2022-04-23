/** Represents response messages for errors that can occur in httpcord. */
export const Errors = {
  UNKNOWN_INTERACTION: {
    type: 4,
    data: { content: "httpcord: unknown interaction type" },
  },
} as const;
