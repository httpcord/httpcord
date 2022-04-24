import { ApplicationCommandOptionType as OptionType } from "../../../../Types";
import type {
  BaseOptionConfig,
  ChannelOptionConfig,
  NumberOptionConfig,
  StringOptionConfig
} from "./Options";

/**
 * This class gets passed to the factory function upon registration to grab the
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
