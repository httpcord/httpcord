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
  ApplicationCommandInteractionResponse,
  ApplicationCommandOptionType as OptionType,
  ChannelType,
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

export const defaultOptionConfig: Omit<BaseOptionConfig, "description"> = {
  required: true,
};

export class OptionProvider {
  private op = new Map<string, Option>();
  config = new Map<string, OptionConfig>();

  constructor(i: ChatInputInteraction) {
    for (const option of i.options || []) {
      switch (option.type) {
        case OptionType.String:
          this.op.set(option.name, option.value);
      }
    }
  }

  /** Creates a string option. */
  string(d: string): string;
  string(d: StringOptionConfig & { required: false }): string | undefined;
  string(d: StringOptionConfig): string;
  string(d: StringOptionConfig | string): string | undefined {
    if (typeof d === "string" || d.required !== false) return "";
  }

  /** Creates an integer option. */
  integer(d: string): number;
  integer(d: NumberOptionConfig & { required: false }): number | undefined;
  integer(d: NumberOptionConfig): number;
  integer(d: NumberOptionConfig | string): number | undefined {
    if (typeof d === "string" || d.required !== false) return 0;
  }

  /** Creates an integer option. */
  boolean(d: string): boolean;
  boolean(d: BaseOptionConfig & { required: false }): boolean | undefined;
  boolean(d: BaseOptionConfig): boolean;
  boolean(d: BaseOptionConfig | string): boolean | undefined {
    if (typeof d === "string" || d.required !== false) return false;
  }

  /** Creates a user option. */
  user(d: string): User;
  user(d: NumberOptionConfig & { required: false }): User | undefined;
  user(d: NumberOptionConfig): User;
  user(d: NumberOptionConfig | string): User | undefined {
    if (typeof d === "string" || d.required !== false)
      return new User({ id: "", username: "", discriminator: "", avatar: "" });
  }
}

export type ResolvedOptions<T> = T extends { [key: string]: Option | undefined }
  ? T
  : { [key: string]: Option | undefined };

export type ChatInputCommandConfig<T> = {
  name: string;
  description: string;
  options?: (opts: OptionProvider) => ResolvedOptions<T>;
  ackBehavior?: CommandAcknowledgementType;
};

type Callback<T> = (
  i: ChatInputInteraction,
  opts: ResolvedOptions<T>
) => unknown;

function resolveIncomingOptions(i: ChatInputInteraction) {
  let options: Record<string, Option> = {};

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
    ChatInputCommandConfig<any> & { fn: Callback<any> }
  >();

  register<T>(config: ChatInputCommandConfig<T>, fn: Callback<T>) {
    this.registered.set(config.name, { ...config, fn });
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
