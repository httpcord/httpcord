import type {
  APIApplicationCommandOptionChoice, ApplicationCommandOptionType as OptionType,
  ChannelType
} from "../../../../Types";
import type { StringOrLocalized } from "../../Types";

/** Base data for acceptable options. */
export interface BaseOptionData {
  /** The name of the option. Can be localized. */
  name: StringOrLocalized;
  /** The description of the option. Can be localized. */
  description: StringOrLocalized;
  /** The numerical type of the option. */
  type: OptionType;
  /** Whether or not this option is required (default true). */
  required?: boolean;
}

/** Data specifically for string option type. */
export interface StringOptionData extends BaseOptionData {
  type: OptionType.String;
  /** If true, this option can be autocompleted. */
  autocomplete?: boolean;
  /** If exists, these will be the only choices allowed to the user. */
  choices?: readonly APIApplicationCommandOptionChoice<string>[];
}

/** Data specifically for number-based option types. */
export interface NumberOptionData extends BaseOptionData {
  type: OptionType.Integer | OptionType.Number;
  /** If exists, the minimum value that is accepted. */
  minValue?: number;
  /** If exists, the maximum value that is accepted. */
  maxValue?: number;
  /** If true, this option can be autocompleted. */
  autocomplete?: boolean;
  /** If exists, these will be the only choices allowed to the user. */
  choices?: readonly APIApplicationCommandOptionChoice<number>[];
}

/** Data specifically for channel option type. */
export interface ChannelOptionData extends BaseOptionData {
  type: OptionType.Channel;
  /** If exists, the only permitted channel types. */
  channelTypes?: ChannelType[];
}

// Configuration - params passed when creating that option in OptionFactory.
export type BaseOptionConfig = Omit<
  Partial<BaseOptionData> & Pick<BaseOptionData, "description">,
  "type"
>;
export type StringOptionConfig = Omit<
  BaseOptionConfig & Partial<StringOptionData>,
  "type"
>;
export type NumberOptionConfig = Omit<
  BaseOptionConfig & Partial<NumberOptionData>,
  "type"
>;
export type ChannelOptionConfig = Omit<
  BaseOptionConfig & Partial<ChannelOptionData>,
  "type"
>;

/** Represents any possible option data. */
export type OptionData =
  | BaseOptionData
  | StringOptionData
  | NumberOptionData
  | ChannelOptionData;

/** Represents any possible option configuration. */
export type OptionConfig =
  | BaseOptionConfig
  | StringOptionConfig
  | NumberOptionConfig
  | ChannelOptionConfig;

export const defaultOptionConfig: Omit<BaseOptionConfig, "description"> = {
  required: true,
};
