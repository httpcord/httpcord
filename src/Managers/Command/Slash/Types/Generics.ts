import type { OptionData } from "./Options";
import type { MWrap, OptionProvider } from "./Provider";
import type { OptionResolver } from "./Resolver";
import type { Option, Require, SubType } from "./Utils";

/* -------------------------------------------------------------------------- */
/* TypeScript Generics Magic - do not edit unless you know what you're doing! */
/* -------------------------------------------------------------------------- */

/** Represents the actual option object passed to the interaction handler. */
export type ResolvedOptions<T> = T extends { [key: string]: MWrap<Option> }
  ? T
  : { [key: string]: MWrap<Option> };

/** Represents the option object returned from the option factory. */
export type ResolvedData<T> = T extends { [key: string]: OptionData }
  ? T
  : { [key: string]: OptionData };

/** Represents the actual option object passed to an autocomplete handler. */
export type ResolvedACOpts<T> = Partial<T> & Require<Pick<T, ResolvedACKey<T>>>;

/** Represents the option key passed to the autocomplete callback. */
export type ResolvedACKey<T> = keyof SubType<T, MWrap<string | number, true>>;

// Generics magic over

/** Represents the function defined by the user that configures the options. */
export type OptionFactory<T> = (opts: OptionProvider) => ResolvedOptions<T>;
/** Represents the same factory function, except is is being resolved. */
export type ConfigurableOptions<T> = (opts: OptionResolver) => ResolvedData<T>;
