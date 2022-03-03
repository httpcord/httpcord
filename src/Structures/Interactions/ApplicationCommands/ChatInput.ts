import APIManager, { Routes } from "../../../API";
import {
  APIChatInputApplicationCommandInteraction,
  APIInteractionGuildMember,
  APIMessage,
  APIUser,
} from "../../../Types";
import { InteractionServer } from "../../../InteractionServer";
import { ApplicationCommandInteraction } from ".";

export class ChatInputInteraction extends ApplicationCommandInteraction {}
