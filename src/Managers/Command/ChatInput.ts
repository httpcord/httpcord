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

/**
 * This class lets you create options. It is purely for typing purposes, option
 * resolving is done in a different place.
 */
export abstract class OptionProvider {
  /** Creates a string option. */
  string(d: string): string;
  string<T extends readonly APIApplicationCommandOptionChoice<string>[]>(
    d: StringOptionConfig & { choices: T }
  ): T[number]["value"];
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
    if (typeof d === "string" || d.required !== false) {
      return new User({ id: "", username: "", discriminator: "", avatar: "" });
    }
  }

  /** Creates a channel option. */
  channel(d: string): Channel;
  channel(d: ChannelOptionConfig & { required: false }): Channel | undefined;
  channel(d: ChannelOptionConfig): Channel;
  channel(d: ChannelOptionConfig | string): Channel | undefined {
    if (typeof d === "string" || d.required !== false) {
      return new Channel({ id: "", name: "", type: 0, permissions: "" });
    }
  }

  /** Creates a role option. */
  role(d: string): Role;
  role(d: BaseOptionConfig & { required: false }): Role | undefined;
  role(d: BaseOptionConfig): Role;
  role(d: BaseOptionConfig | string): Role | undefined {
    if (typeof d === "string" || d.required !== false) {
      return new Role({
        id: "",
        name: "",
        color: 0,
        hoist: false,
        position: 0,
        permissions: "",
        managed: false,
        mentionable: false,
      });
    }
  }

  /** Creates a mentionable option. */
  mentionable(d: string): User | Role;
  mentionable(
    d: BaseOptionConfig & { required: false }
  ): User | Role | undefined;
  mentionable(d: BaseOptionConfig): User | Role;
  mentionable(d: BaseOptionConfig | string): User | Role | undefined {
    if (typeof d === "string" || d.required !== false) {
      return new User({ id: "", username: "", discriminator: "", avatar: "" });
    }
  }

  /** Creates a number option. */
  number(d: string): number;
  number(d: NumberOptionConfig & { required: false }): number | undefined;
  number(d: NumberOptionConfig): number;
  number(d: NumberOptionConfig | string): number | undefined {
    if (typeof d === "string" || d.required !== false) return 0;
  }

  /** Creates an attachment option. */
  attachment(d: string): Attachment;
  attachment(d: BaseOptionConfig & { required: false }): Attachment | undefined;
  attachment(d: BaseOptionConfig): Attachment;
  attachment(d: BaseOptionConfig | string): Attachment | undefined {
    if (typeof d === "string" || d.required !== false) {
      return new Attachment({
        id: "",
        filename: "",
        size: 0,
        url: "",
        proxy_url: "",
      });
    }
  }
}

/**
 * This class gets passed to the config function upon registration to grab the
 * options and convert them into a config.
 */
// WIP
export class OptionResolver /*implements OptionProvider*/ {
  private config = new Map<string, OptionData>();

  string(d: string | StringOptionConfig) {
    if (typeof d === "string") d = { description: d };
    this.config.set("test", { ...d, name: "test", type: OptionType.String });
    return "";
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
  const options: Record<string, Option> = {};

  if (i.options) {
    for (const o of i.options) {
      let value: Option = o.value;
      switch (o.type) {
        case OptionType.User:
          value = i.getUser(o.value) as User;
          break;
        case OptionType.Channel:
          value = i.getChannel(o.value) as Channel;
          break;
        case OptionType.Role:
          value = i.getRole(o.value) as Role;
          break;
        case OptionType.Mentionable:
          value = (i.getUser(o.value) || i.getRole(o.value)) as User | Role;
          break;
        case OptionType.Attachment:
          value = i.getAttachment(o.value) as Attachment;
          break;
      }
      Object.defineProperty(options, o.name, { value });
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
      const e = data.ackBehavior === CommandAcknowledgementType.AutoEphemeral;

      /* eslint-disable no-fallthrough */
      switch (data.ackBehavior) {
        default:
          data.fn(i, options); // Run in background
          setTimeout(() => i.defer(e), 1500); // Defer if no reply in 1500ms
        case CommandAcknowledgementType.Manual:
          return await i.awaitResponse();
      }
    }

    return { type: 4, data: { content: "httpcord: unknown command" } };
  }
}
