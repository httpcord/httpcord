import type { OptionData } from "./Options";
import type { MWrap, OptionProvider, UnwrapAll } from "./Provider";
import type { OptionResolver } from "./Resolver";
import type { Option, SubType } from "./Utils";

/* -------------------------------------------------------------------------- */
/* TypeScript Generics Magic - do not edit unless you know what you're doing! */
/* -------------------------------------------------------------------------- */

/** Represents the *wrapped* options object that is passed around internally. */
export type WrappedOptions<T> = T extends { [key: string]: MWrap<Option> }
  ? T
  : { [key: string]: MWrap<Option> };

/** Represents the actual option object passed to the interaction handler. */
export type ResolvedOptions<T> = T extends WrappedOptions<infer V>
  ? UnwrapAll<V>
  : T;

/** Represents the option object returned from the option factory. */
export type ResolvedData<T> = T extends { [key: string]: OptionData }
  ? T
  : { [key: string]: OptionData };

/** Represents the option key passed to the autocomplete callback. */
export type ResolvedACKey<T> = T extends WrappedOptions<infer V>
  ? keyof SubType<V, MWrap<string | number, true>>
  : never;

// Generics magic over

/** Represents the function defined by the user that configures the options. */
export type OptionFactory<T> = (opts: OptionProvider) => WrappedOptions<T>;
/** Represents the same factory function, except is is being resolved. */
export type ConfigurableOptions<T> = (opts: OptionResolver) => ResolvedData<T>;
