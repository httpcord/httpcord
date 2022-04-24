import type { ChatInputInteraction } from "../../../../Structures";
import type { CommandAcknowledgementType } from "../../../../Types";
import type { ApplicationCommandConfig, StringOrLocalized } from "../../Types";
import type { OptionFactory } from "./Generics";
import type { UnwrapAll } from "./Provider";

// These are the actual consumer chat input types

/** The configuration for a chat input command. */
export type ChatInputCommandConfig<T> = ApplicationCommandConfig<{
  /** The description of the chat input command. */
  description: StringOrLocalized;

  /**
   * The options of the slash command. Must be a function that returns an object
   * with slash command descriptors. It is passed one object - "opts" - that has
   * methods to create slash command descriptors.
   *
   * @example options: (opts) => ({
   *            name: opts.string("Your name!")
   *          });
   */
  options?: OptionFactory<T>;

  /**
   * The acknowledgement behavior of the command. It dictates what happens when
   * the command takes too long to complete and helps you avoid the 3-second
   * limit for command processing.
   *
   * @default CommandAcknowledgementType.Auto
   */
  ackBehavior?: CommandAcknowledgementType;
}>;

/** The callback that gets executed when a chat input command is executed. */
export type ChatInputCallback<T> = (
  i: ChatInputInteraction,
  opts: UnwrapAll<T>
) => unknown;
