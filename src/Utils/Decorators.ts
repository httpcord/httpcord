import type { APIWrapper } from "../API";

export function RequiresToken(obj: any, key: string, desc: PropertyDescriptor) {
  const original = desc.value as Function;
  const api = obj.api as APIWrapper;

  desc.value = function (...args: any[]) {
    if (!api.hasToken) throw new Error(`${key} requires a bot token.`);
    return original.apply(this, args);
  };
  return desc;
}
