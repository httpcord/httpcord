import type { APIApplicationCommandAutocompleteResponse } from "../Types";

type AutocompleteValues<T = string | number> =
  | T
  | T[]
  | { name: string; value: T }
  | { name: string; value: T }[];

type AutocompleteCallbackReturn<T = string | number> =
  | AutocompleteValues<T>
  | Promise<AutocompleteValues<T>>;

export type AutocompleteCallback = (
  typing: string
) =>
  | Promise<APIApplicationCommandAutocompleteResponse>
  | APIApplicationCommandAutocompleteResponse;

export type AutocompleteConfig = {
  name: string;
  optName: string;
};

export class AutocompleteManager {
  private registered = new Map<string, AutocompleteCallback>();

  register(cmdName: string, optName: string, cb: AutocompleteCallback) {}
}
