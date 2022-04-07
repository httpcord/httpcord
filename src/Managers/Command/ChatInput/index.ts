import type {
  Attachment, AutocompleteInteraction,
  Channel,
  ChatInputInteraction,
  Role, User
} from "../../../Structures";
import type {
  APIApplicationCommandBasicOption,
  APIApplicationCommandInteractionDataOption,
  ApplicationCommandInteractionResponse,
  RESTPostAPIApplicationCommandsJSONBody
} from "../../../Types";
import {
  ApplicationCommandOptionType as OptionType,
  CommandAcknowledgementType
} from "../../../Types";
import type {
  AutocompleteCallback,
  Callback,
  ChatInputCommandConfig,
  ConfigurableOptions,
  Option,
  ResolvedData
} from "./Types";
import { OptionResolver } from "./Types";

function resolveIncomingOptions(
  i: ChatInputInteraction | AutocompleteInteraction
) {
  const options: Record<string, Option> = {};

  if (i.isApplicationCommandAutocomplete()) {
    for (const o of i.options) {
      Object.defineProperty(options, o.name, { value: o.value });
    }
  } else if (i.options) {
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

function resolveOptionConfiguration<T>(
  fn: (opts: OptionResolver) => ResolvedData<T>
) {
  const options: APIApplicationCommandBasicOption[] = [];
  const optionData = Object.entries(fn(new OptionResolver()));

  for (const [name, option] of optionData) {
    const raw = new Map();

    raw.set("name", name);
    raw.set("description", option.description);
    raw.set("type", option.type);

    if ("choices" in option) raw.set("choices", option.choices);
    if ("required" in option) raw.set("required", option.required);
    if ("minValue" in option) raw.set("min_value", option.minValue);
    if ("maxValue" in option) raw.set("max_value", option.maxValue);
    if ("autocomplete" in option) raw.set("autocomplete", option.autocomplete);
    if ("channelTypes" in option) raw.set("channel_types", option.channelTypes);

    options.push(Object.fromEntries(raw) as APIApplicationCommandBasicOption);
  }

  return options;
}

function getTypingOption(opts: APIApplicationCommandInteractionDataOption[]) {
  for (const option of opts) {
    if ((option.type === 3 || option.type === 4) && option.focused) {
      return option;
    }
  }
}

export class ChatInputCommand<T> {
  private commandConfig = new Map();
  readonly isGroup = false;

  // params
  ackBehavior?: CommandAcknowledgementType;

  callback: Callback<T>;
  autocompleteCallback?: AutocompleteCallback<T>;

  get config() {
    return Object.fromEntries(this.commandConfig);
  }

  constructor(config: ChatInputCommandConfig<T>, fn: Callback<T>) {
    this.callback = fn;

    this.commandConfig.set("name", config.name);
    this.commandConfig.set("description", config.description);
    this.commandConfig.set("type", 1);
    this.ackBehavior = config.ackBehavior;

    if (config.options) {
      const configFn = config.options as unknown as ConfigurableOptions<T>;
      this.commandConfig.set("options", resolveOptionConfiguration(configFn));
    }
  }

  /**
   * Registers an autocomplete handler.
   *
   * The callback must have 3 arguments:
   * 1. The interaction as AutocompleteInteraction
   * 2. The key of option being typed as string
   * 3. All other options currently filled out as object (like normal callback)
   */
  autocomplete(cb: AutocompleteCallback<T>) {
    this.autocompleteCallback = cb;
    return this as Omit<ChatInputCommand<T>, "autocomplete">;
  }
}

export class ChatInputCommandManager {
  private registered = new Map<string, ChatInputCommand<any>>();

  register<T>(config: ChatInputCommandConfig<T>, fn: Callback<T>) {
    const command = new ChatInputCommand(config, fn);
    this.registered.set(config.name, command);
    return command;
  }

  async execute(
    i: ChatInputInteraction
  ): Promise<ApplicationCommandInteractionResponse> {
    const data = this.registered.get(i.commandName);

    if (data && !data.isGroup) {
      const options = resolveIncomingOptions(i);
      const e = data.ackBehavior === CommandAcknowledgementType.AutoEphemeral;

      /* eslint-disable no-fallthrough */
      switch (data.ackBehavior) {
        default:
          (async () => data.callback(i, options))(); // Run in background
          setTimeout(() => i.defer(e), 1500); // Defer if no reply in 1500ms
        case CommandAcknowledgementType.Manual:
          return await i.awaitResponse();
      }
    }

    const flags = 64; // ephemeral
    return { type: 4, data: { content: "httpcord: unknown command", flags } };
  }

  async autocomplete(i: AutocompleteInteraction) {
    const data = this.registered.get(i.commandName);

    if (data && data.autocompleteCallback) {
      const options = resolveIncomingOptions(i);
      const typing = getTypingOption(i.options)?.name as string;

      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      (async () => data.autocompleteCallback!(i, typing, options))();
      setTimeout(() => i.respond([]), 2000); // give some more time to respond
      return await i.awaitResponse();
    }

    return { type: 5, data: { choices: [] } };
  }

  generateConfig() {
    const config: RESTPostAPIApplicationCommandsJSONBody[] = [];
    for (const [name, command] of this.registered) {
      config.push(command.config);
    }
    return config;
  }
}
