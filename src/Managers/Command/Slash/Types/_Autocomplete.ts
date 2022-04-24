import type { AutocompleteInteraction } from "../../../../Structures";
import type { ResolvedACKey, ResolvedOptions } from "./Generics";

/** Represents the type for a chat input command autocomplete callback. */
export type AutocompleteCallback<T> = (
  i: AutocompleteInteraction,
  t: ResolvedACKey<T>,
  // not all options could be filled out
  opts: Partial<ResolvedOptions<T>>
) => unknown;
