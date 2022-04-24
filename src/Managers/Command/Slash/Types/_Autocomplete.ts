import type { AutocompleteInteraction } from "../../../../Structures";
import type { ResolvedACKey, ResolvedACOpts } from "./Generics";
import type { UnwrapAll } from "./Provider";

/** Represents the type for a chat input command autocomplete callback. */
export type AutocompleteCallback<T> = (
  i: AutocompleteInteraction,
  t: ResolvedACKey<T>,
  // not all options could be filled out
  opts: UnwrapAll<ResolvedACOpts<T>>
) => unknown;
