import Express, { Router, Request, Response } from "express";
import { Verify, JSONBody, Raw } from "../Middleware";
import { APIInteraction, APIInteractionResponse } from "../Types";
import { Config } from "./Config";
import APIManager from "../API";
import { Interaction, ApplicationCommandInteraction } from "../Structures";
import { CommandManager } from "../Managers";

/**
 * Represents an interaction server. It takes a public key (and optionally bot
 * token) and in return gives something similar to an Express app (it actually
 * uses Express under the hood).
 */
export class InteractionServer {
  api = new APIManager();
  command = new CommandManager();

  private router = Router();
  private app = Express();

  /** Maps to the server's internal Express app listen function. */
  listen = this.app.listen;

  /**
   * Creates a new interaction server.
   * @param {config} Config - the configuration to use
   */
  constructor(config: Config) {
    this.router.post("/", Raw, Verify(config.publicKey), JSONBody, this.resp);
    this.app.use(this.router);
  }

  /**
   * Handles creating the Interaction class and passing it around internally to
   * respond to the interaction.
   */
  private async resp(req: Request, res: Response) {
    const rawInteraction = req.body as APIInteraction;
    let interactionType = Interaction;
    switch (rawInteraction.type) {
      case 2:
        interactionType = ApplicationCommandInteraction;
        break;
    }
    const interaction = new interactionType(this, rawInteraction);
    return res.json(await this.handle(interaction));
  }

  private async handle(i: Interaction): Promise<APIInteractionResponse> {
    // 1: Ping interaction
    if (i.isPing()) return { type: 1 };

    // 2: Application command interaction
    if (i.isApplicationCommand()) return this.command.execute(i);

    // 3: Message component interaction
    if (i.isMessageComponent()) console;

    // 4: Autocomplete interaction
    if (i.isApplicationCommandAutocomplete()) console;

    // 5: Modal submit interaction
    if (i.isModalSubmit()) console;

    // Default for unimplemented interaction types
    return { type: 4, data: { content: "httpcord: unknown interaction type" } };
  }
}
