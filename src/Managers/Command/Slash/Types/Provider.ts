import type { Attachment, Channel, Role, User } from "../../../../Structures";
import type { APIApplicationCommandOptionChoice } from "../../../../Types";
import type {
  BaseOptionConfig as CBase,
  ChannelOptionConfig as CChannel,
  NumberOptionConfig as CNumber,
  StringOptionConfig as CString
} from "./Options";

/** Wraps a type so it is possible to store more data in it. */
export type Wrap<T, AC = boolean> = { data: T; autocomplete: AC };

/** Shorthand */
export type MWrap<T, AC = boolean> = Wrap<T | undefined, AC>;

/** Wrap an entire object. */
export type WrapAll<T> = {
  [Key in keyof T]: Wrap<T[Key]>;
};

/** Unwraps a type that was wrapped before. */
export type Unwrap<T> = T extends Wrap<infer V> ? V : T;

/** Unwraps an entire object. Thanks typescript. */
export type UnwrapAll<T> = T extends { [key: string]: Wrap<infer V> }
  ? {
      [Key in keyof T]: Unwrap<T[Key]>;
    }
  : T;

declare const thing: Required<undefined>;
thing;

// Shorthands to try to not overflow onto multiple lines
// Hover over one if you are confused (which you will be)

/** Adds "autocomplete": true property to T. */
type Autocomplete<T> = T & { autocomplete: true };
/** Adds "required": false property to T. */
type NotRequired<T> = T & { required: false };
/** Adds "autocomplete": true and "required": false properties to T. */
type ACNR<T> = Autocomplete<T> & NotRequired<T>;
/** Adds "choices": V property to T. */
type Ch<T, V> = T & { choices: V };
/** Adds "choices": V and "required": false properties to T. */
type ChNR<T, C> = Ch<T, C> & NotRequired<T>;
/** Array of choices of T. */
type C<T> = ReadonlyArray<APIApplicationCommandOptionChoice<T>>;

/**
 * This interface is purely for typing purposes of command registration. Nothing
 * implements it (it is impossible to properly implement), it is only for typing
 * of the "options" factory function. (options parameter in config)
 *
 * It is hard to understand the whole slash command typing system until you
 * properly let the fact that this is unimplementable sink in. We get around
 * this via type casting :)
 */
export interface OptionProvider {
  // Usually the options go in this order:
  // 1. called with string, implied as required
  // 2. optional, called with choices and not required
  // 3. optional, called with choices but required
  // 4. optional, called with autocomplete but not required
  // 5. optional, called with autocomplete but required
  // 6. not required
  // 7. any other config
  // 8. generic

  /** Creates a string option. */
  string(d: string): Wrap<string>;
  string<T extends C<string>>(d: ChNR<CString, T>): MWrap<T[number]["value"]>;
  string<T extends C<string>>(d: Ch<CString, T>): Wrap<T[number]["value"]>;
  string(d: ACNR<CString>): MWrap<string, true>;
  string(d: Autocomplete<CString>): Wrap<string, true>;
  string(d: NotRequired<CString>): MWrap<string>;
  string(d: CString): Wrap<string>;
  string(d: CString | string): MWrap<string>;

  /** Creates an integer option. */
  integer(d: string): Wrap<number>;
  integer<T extends C<number>>(d: ChNR<CNumber, T>): MWrap<T[number]["value"]>;
  integer<T extends C<number>>(d: Ch<CNumber, T>): Wrap<T[number]["value"]>;
  integer(d: ACNR<CNumber>): MWrap<number, true>;
  integer(d: Autocomplete<CNumber>): Wrap<number, true>;
  integer(d: NotRequired<CNumber>): MWrap<number>;
  integer(d: CNumber): number;
  integer(d: CNumber | string): MWrap<number>;

  /** Creates a boolean option. */
  boolean(d: string): Wrap<boolean>;
  boolean(d: NotRequired<CBase>): MWrap<boolean>;
  boolean(d: CBase): Wrap<boolean>;
  boolean(d: CBase | string): MWrap<boolean>;

  /** Creates a user option. */
  user(d: string): Wrap<User>;
  user(d: NotRequired<CBase>): MWrap<User>;
  user(d: CBase): Wrap<User>;
  user(d: CBase | string): MWrap<User>;

  /** Creates a channel option. */
  channel(d: string): Wrap<Channel>;
  channel(d: NotRequired<CChannel>): MWrap<Channel>;
  channel(d: CChannel): Wrap<Channel>;
  channel(d: CChannel | string): MWrap<Channel>;

  /** Creates a role option. */
  role(d: string): Wrap<Role>;
  role(d: NotRequired<CBase>): MWrap<Role>;
  role(d: CBase): Wrap<Role>;
  role(d: CBase | string): MWrap<Role>;

  /** Creates a mentionable option. */
  mentionable(d: string): Wrap<User | Role>;
  mentionable(d: NotRequired<CBase>): MWrap<User | Role>;
  mentionable(d: CBase): Wrap<User | Role>;
  mentionable(d: CBase | string): MWrap<User | Role>;

  /** Creates a number option. */
  number(d: string): Wrap<number>;
  number<T extends C<number>>(d: ChNR<CNumber, T>): MWrap<T[number]["value"]>;
  number<T extends C<number>>(d: Ch<CNumber, T>): Wrap<T[number]["value"]>;
  number(d: ACNR<CNumber>): MWrap<number, true>;
  number(d: Autocomplete<CNumber>): Wrap<number, true>;
  number(d: NotRequired<CNumber>): MWrap<number>;
  number(d: CNumber): Wrap<number>;
  number(d: CNumber | string): MWrap<number>;

  /** Creates an attachment option. */
  attachment(d: string): Wrap<Attachment>;
  attachment(d: NotRequired<CBase>): MWrap<Attachment>;
  attachment(d: CBase): Wrap<Attachment>;
  attachment(d: CBase | string): MWrap<Attachment>;
}
