import { APIChatInputApplicationCommandInteraction as Interaction } from "discord-api-types/v10";

export type ChatInputCallback<T> = (i: Interaction, o: T) => unknown;
