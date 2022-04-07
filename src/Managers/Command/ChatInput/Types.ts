import {
  Attachment,
  AutocompleteInteraction,
  Channel,
  ChatInputInteraction,
  Member,
  Role,
  User
} from "../../../Structures";
import type {
  APIApplicationCommandOptionChoice,
  ChannelType,
  CommandAcknowledgementType
} from "../../../Types";
import { ApplicationCommandOptionType as OptionType } from "../../../Types";

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

/** Base data for acceptable options. */
export type BaseOptionData = {
  name: string;
  description: string;
  type: OptionType;
  required?: boolean;
};

/** Data specifically for string option type. */
export type StringOptionData = BaseOptionData & {
  type: OptionType.String;
  choices?: readonly APIApplicationCommandOptionChoice<string>[];
  autocomplete?: boolean;
};

/** Data specifically for number-based option types. */
export type NumberOptionData = BaseOptionData & {
  type: OptionType.Integer | OptionType.Number;
  choices?: readonly APIApplicationCommandOptionChoice<number>[];
  autocomplete?: boolean;
  minValue?: number;
  maxValue?: number;
};

/** Data specifically for channel option type. */
export type ChannelOptionData = BaseOptionData & {
  type: OptionType.Channel;
  channelTypes?: ChannelType[];
};

// Configuration - params passed when creating that option in OptionFactory.
export type BaseOptionConfig = Partial<BaseOptionData> &
  Pick<BaseOptionData, "description">;
export type StringOptionConfig = BaseOptionConfig & Partial<StringOptionData>;
export type NumberOptionConfig = BaseOptionConfig & Partial<NumberOptionData>;
export type ChannelOptionConfig = BaseOptionConfig & Partial<ChannelOptionData>;

export type OptionData =
  | BaseOptionData
  | StringOptionData
  | NumberOptionData
  | ChannelOptionData;

export type OptionConfig =
  | BaseOptionConfig
  | StringOptionConfig
  | NumberOptionConfig
  | ChannelOptionConfig;

export const defaultOptionConfig: Omit<BaseOptionConfig, "description"> = {
  required: true,
};

/** This interface is purely for typing purposes of command registration. */
export interface OptionProvider {
  /** Creates a string option. */
  string(d: string): string;
  string<T extends readonly APIApplicationCommandOptionChoice<string>[]>(
    d: StringOptionConfig & { choices: T }
  ): T[number]["value"];
  string(d: StringOptionConfig & { required: false }): string | undefined;
  string(d: StringOptionConfig): string;
  string(d: StringOptionConfig | string): string | undefined;

  /** Creates an integer option. */
  integer(d: string): number;
  integer(d: NumberOptionConfig & { required: false }): number | undefined;
  integer(d: NumberOptionConfig): number;
  integer(d: NumberOptionConfig | string): number | undefined;

  /** Creates an integer option. */
  boolean(d: string): boolean;
  boolean(d: BaseOptionConfig & { required: false }): boolean | undefined;
  boolean(d: BaseOptionConfig): boolean;
  boolean(d: BaseOptionConfig | string): boolean | undefined;

  /** Creates a user option. */
  user(d: string): User;
  user(d: NumberOptionConfig & { required: false }): User | undefined;
  user(d: NumberOptionConfig): User;
  user(d: NumberOptionConfig | string): User | undefined;

  /** Creates a channel option. */
  channel(d: string): Channel;
  channel(d: ChannelOptionConfig & { required: false }): Channel | undefined;
  channel(d: ChannelOptionConfig): Channel;
  channel(d: ChannelOptionConfig | string): Channel | undefined;

  /** Creates a role option. */
  role(d: string): Role;
  role(d: BaseOptionConfig & { required: false }): Role | undefined;
  role(d: BaseOptionConfig): Role;
  role(d: BaseOptionConfig | string): Role | undefined;

  /** Creates a mentionable option. */
  mentionable(d: string): User | Role;
  mentionable(
    d: BaseOptionConfig & { required: false }
  ): User | Role | undefined;
  mentionable(d: BaseOptionConfig): User | Role;
  mentionable(d: BaseOptionConfig | string): User | Role | undefined;

  /** Creates a number option. */
  number(d: string): number;
  number(d: NumberOptionConfig & { required: false }): number | undefined;
  number(d: NumberOptionConfig): number;
  number(d: NumberOptionConfig | string): number | undefined;

  /** Creates an attachment option. */
  attachment(d: string): Attachment;
  attachment(d: BaseOptionConfig & { required: false }): Attachment | undefined;
  attachment(d: BaseOptionConfig): Attachment;
  attachment(d: BaseOptionConfig | string): Attachment | undefined;
}

/**
 * This class gets passed to the config function upon registration to grab the
 * options and convert them into a config.
 */
export class OptionResolver {
  string(d: string | StringOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.String };
  }

  integer(d: string | NumberOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Integer };
  }

  boolean(d: string | BaseOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Boolean };
  }

  user(d: string | BaseOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.User };
  }

  channel(d: string | ChannelOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Channel };
  }

  role(d: string | BaseOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Role };
  }

  mentionable(d: string | BaseOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Mentionable };
  }

  number(d: string | NumberOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Number };
  }

  attachment(d: string | BaseOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Attachment };
  }
}

export type ResolvedOptions<T> = T extends { [key: string]: Option | undefined }
  ? T
  : { [key: string]: Option | undefined };

export type ResolvedData<T> = T extends { [key: string]: OptionData }
  ? T
  : { [key: string]: OptionData };

export type OptionFactory<T> = (opts: OptionProvider) => ResolvedOptions<T>;
export type ConfigurableOptions<T> = (opts: OptionResolver) => ResolvedData<T>;

export type ChatInputCommandConfig<T> = {
  name: string;
  description: string;
  options?: OptionFactory<T>;
  ackBehavior?: CommandAcknowledgementType;
};

export type ChatInputCommandGroupConfig = {
  name: string;
  description: string;
};

export type Callback<T> = (
  i: ChatInputInteraction,
  opts: ResolvedOptions<T>
) => unknown;

type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;

type ResolvedAutocomplete<T> = T extends { [k: string]: string | number }
  ? T[keyof T]
  : never;

export type InterfaceMap<T> = Map<keyof T, T[keyof T]>;

export type AutocompleteCallback<T, V = SubType<T, string | number>> = (
  i: AutocompleteInteraction,
  t: keyof SubType<T, ResolvedAutocomplete<V>>,
  opts: ResolvedOptions<T>
) => unknown;
