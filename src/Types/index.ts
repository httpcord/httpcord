export * from "./DiscordAPITypes";
export * from "./HTTP";
export * from "./Interactions";

/** Shorthand type to indicate something could give back a type or undefined. */
export type Maybe<T> = T | undefined;

/** Shorthand type to indicate something could be a sync or async function. */
export type MaybePromise<T> = Promise<T> | T;

/** Shorthand type to signal that the request supports an audit log reason. */
export type WithAuditReason<T> = T & { reason?: string };
