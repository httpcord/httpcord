import type { APIWrapper } from "../API";

/** Throws an error if the method is invoked without a token. */
export function RequiresToken(obj: any, key: string, desc: PropertyDescriptor) {
  const original = desc.value as (...args: unknown[]) => unknown;
  const api = obj.api as APIWrapper;

  desc.value = function (...args: any[]) {
    if (!api.hasToken) throw new Error(`${key} requires a bot token.`);
    return original.apply(this, args);
  };
  return desc;
}
