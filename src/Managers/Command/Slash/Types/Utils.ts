import type {
  Attachment,
  Channel,
  Member,
  Role,
  User
} from "../../../../Structures";
import type { APIApplicationCommandInteractionDataBasicOption } from "../../../../Types";

/** Mentionable type includes users, members, and roles. */
export type Mentionable = User | Member | Role;

/** Any option that can get passed to the executing function. */
export type Option =
  | string
  | number
  | boolean
  | User
  | Channel
  | Role
  | Member
  | Mentionable
  | Attachment;

/** I actually have no clue what this does, I copied it from SO 2 months ago */
export type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;

/** Represents actual options, without any subcommands or groups. */
export type ActualOptions = APIApplicationCommandInteractionDataBasicOption[];

/** Like required but for a single property. */
export type Require<T> = T extends infer V | undefined ? V : T;
