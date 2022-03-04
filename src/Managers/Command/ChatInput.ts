import {
  Attachment,
  Channel,
  ChatInputInteraction,
  Member,
  Role,
  User,
} from "../../Structures";
import {
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType as OptionType,
  ChannelType,
  ApplicationCommandInteractionResponse,
  CommandAcknowledgementType,
} from "../../Types";

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
  choices?: APIApplicationCommandOptionChoice<string>[];
  autocomplete?: boolean;
};

/** Data specifically for number-based option types. */
export type NumberOptionData = BaseOptionData & {
  type: OptionType.Integer | OptionType.Number;
  choices?: APIApplicationCommandOptionChoice<number>[];
  autocomplete?: boolean;
  minValue?: number;
  maxValue?: number;
};

/** Data specifically for channel option type. */
export type ChannelOptionData = BaseOptionData & {
  type: OptionType.Channel;
  channelTypes?: ChannelType[];
};

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

export class OptionProvider {
  /** Creates a string option. */
  static string(d: string | StringOptionConfig) {
    if (typeof d === "string") d = { description: d, type: OptionType.String };
  }

  /** Creates an integer option. */
  static integer(d: string | NumberOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.String };
  }

  /** Creates a boolean option. */
  static boolean(d: string | BaseOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Boolean };
  }

  /** Creates a user option. */
  static user(d: string | BaseOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.User };
  }

  /** Creates a channel option. */
  static channel(d: string | ChannelOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Channel };
  }

  /** Creates a role option. */
  static role(d: string | BaseOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Role };
  }

  /** Creates a mentionable option. */
  static mentionable(d: string | BaseOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Mentionable };
  }

  /** Creates a number (double) option. */
  static number(d: string | NumberOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Number };
  }

  /** Creates an attachment option. */
  static attachment(d: string | BaseOptionConfig) {
    if (typeof d === "string") d = { description: d };
    return { ...d, type: OptionType.Attachment };
  }
}

export type ResolvedOptions = { [key: string]: Option };

export type ChatInputCommandConfig = {
  name: string;
  description: string;
  options?: (opts: OptionProvider) => { [key: string]: OptionConfig };
  ackBehavior?: CommandAcknowledgementType;
};

type CommandConfigResolved = Omit<ChatInputCommandConfig, "options"> & {
  options?: Map<string, OptionData>;
};

type Callback = (i: ChatInputInteraction, opts: ResolvedOptions) => unknown;

function resolveIncomingOptions(i: ChatInputInteraction) {
  let options: ResolvedOptions = {};

  if (i.options) {
    for (const o of i.options) {
      let value: Option = o.value;
      if (o.type === OptionType.User) value;
      Object.defineProperty(options, o.name, { value: o.value });
    }
  }

  return options;
}

export class ChatInputCommandManager {
  private registered = new Map<
    string,
    CommandConfigResolved & { fn: Callback }
  >();

  register(config: ChatInputCommandConfig, fn: Callback) {
    const options = new Map<string, OptionData>();

    // Resolve options, if there are any
    if (config.options)
      for (const [k, v] of Object.entries(config.options)) {
        const data = v as OptionConfig & Required<Pick<OptionConfig, "type">>;
        const name = data.name || k;
        options.set(name, { ...data, name });
      }

    this.registered.set(config.name, { ...config, options, fn });
  }

  async execute(
    i: ChatInputInteraction
  ): Promise<ApplicationCommandInteractionResponse> {
    const data = this.registered.get(i.commandName);

    if (data) {
      const options = resolveIncomingOptions(i);

      if (data.ackBehavior !== CommandAcknowledgementType.Manual) {
        const e = data.ackBehavior === CommandAcknowledgementType.AutoEphemeral;

        data.fn(i, options); // Run in background
        setTimeout(() => i.defer(e), 1500); // Defer if no reply in 1500ms
        return i.awaitResponse(); // Guaranteed to be something because of above
      } else {
        // Manual mode, no timeout or anything
        return i.awaitResponse();
      }
    }

    return { type: 4, data: { content: "httpcord: unknown command" } };
  }
}
