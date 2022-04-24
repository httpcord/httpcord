import type {
  APIApplicationCommandBasicOption as BO,
  APIApplicationCommandInteractionDataBasicOption as IBO
} from "../../../Types";
import { ApplicationCommandOptionType as OptionType } from "../../../Types";
import type {
  ActualOptions,
  ConfigurableOptions,
  Option,
  ResolvedACKey,
  ResolvedOptions as R
} from "./Types";
import { OptionResolver } from "./Types";

/**
 * Converts the custom options function to a Discord option config.
 * @param fn The options function that the user passed in to convert.
 * @returns The options that the user passed in, converted to Discord options.
 */
export function getOptConfig(fn: ConfigurableOptions<unknown>) {
  return Object.entries(fn(new OptionResolver())).map(([key, val]) => {
    // Map the custom properties in OptionData/OptionConfig to Discord ones.
    return {
      name: typeof val.name === "string" ? val.name : val.name["en-US"] ?? key,
      name_localizations:
        typeof val.name === "string" ? { "en-US": val.name } : val.name,
      description:
        typeof val.description === "string"
          ? val.description
          : val.description["en-US"],
      description_localizations:
        typeof val.description === "string"
          ? { "en-US": val.description }
          : val.description,
      type: val.type,
      required: val.required ?? true,
      choices: "choices" in val ? val.choices?.map : undefined,
      channel_types: "channelTypes" in val ? val.channelTypes : undefined,
      min_value: "minValue" in val ? val.minValue : undefined,
      max_value: "maxValue" in val ? val.maxValue : undefined,
      autocomplete: "autocomplete" in val ? val.autocomplete : undefined,
    } as BO;
  });
}

/**
 * Converts incoming options into an option object and checks that they are
 * valid and what they are meant to be. (in case of mismatch between the state
 * of commands on Discord servers and internally)
 * @param o The list of *incoming* basic options from the interaction.
 * @param c The list of *config* basic options that were sent to Discord.
 * @returns ResolvedOptions
 */
export function convert<T>(o: IBO[], c: BO[], r: false): Partial<R<T>>;
export function convert<T>(o: IBO[], c: BO[], r: true): R<T>;
export function convert<T>(o: IBO[], c: BO[], r = true) {
  const optConfig = c.sort((f, s) => f.name.localeCompare(s.name));
  const optReceived = o.sort((f, s) => f.name.localeCompare(s.name));
  const options = {};

  // TODO: maybe optimize this somehow
  optReceived.forEach(({ name, type, value }) => {
    const confIndex = optConfig.findIndex((val) => val.name === name);
    if (confIndex === -1) throw new Error("invalid option name");
    // Get the item from the array and simultaneously remove it
    // This maybe helps the search above be quicker
    const [configured] = optConfig.splice(confIndex, 1);
    if (type !== configured.type) throw new Error("option type mismatch");
    Object.defineProperty(options, name, { value });
  });

  // At this point, if there are still some required opts in config array, it
  // means that not all have been filled out. Throw error if enabled.
  if (r && optConfig.some((v) => v.required))
    throw new Error("some required opts are missing");

  return options as R<T>;
}

/**
 * Resolves incoming options (as in array form, from Discord) to the actual
 * option object that is passed to the interaction callback handler.
 */
export function resolveIncomingOptions(opts: ActualOptions) {
  const options: Record<string, Option> = {};

  opts.forEach((option) => {
    let value: Option = option.value;

    switch (option.type) {
      case OptionType.Attachment:
    }

    Object.defineProperty(options, option.name, { value });
  });

  // if (i.type === InteractionType.ApplicationCommandAutocomplete)
  //   i.data.options.forEach((o) => {
  //     Object.defineProperty(options, o.name, { value: o });
  //   });
  // else if (i.data.type === ApplicationCommandType.ChatInput && i.data.options) {
  // for (const o of i.data.options) {
  //   let value: Option = o.value;
  //   switch (o.type) {
  //     case OptionType.User:
  //       value = i.getUser(o.value) as User;
  //       break;
  //     case OptionType.Channel:
  //       value = i.getChannel(o.value) as Channel;
  //       break;
  //     case OptionType.Role:
  //       value = i.getRole(o.value) as Role;
  //       break;
  //     case OptionType.Mentionable:
  //       value = (i.getUser(o.value) || i.getRole(o.value)) as User | Role;
  //       break;
  //     case OptionType.Attachment:
  //       value = i.getAttachment(o.value) as Attachment;
  //       break;
  //   }

  return Object.freeze(options);
}

/** Gets the option name that the user is currently typing, if any. */
export function getFocused<T>(opts: ActualOptions) {
  for (const o of opts) {
    if ((o.type === 3 || o.type === 4) && o.focused)
      return o.name as ResolvedACKey<T>;
  }
}
