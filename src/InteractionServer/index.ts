import Express, { Router, Request, Response } from "express";
import { Verify, JSONBody, Raw } from "../Middleware";
import { APIInteraction, APIInteractionResponse } from "../Types";
import { Config } from "./Config";
import APIManager from "../API";
import { Interaction } from "../Structures";

export class InteractionServer {
  private router = Router();
  private app = Express();
  public listen = this.app.listen;
  public api = new APIManager();

  constructor(config: Config) {
    this.router.post("/", Raw, Verify(config.publicKey), JSONBody, this.resp);
    this.app.use(this.router);
  }

  private async resp(req: Request, res: Response) {
    const interaction = req.body as APIInteraction;
    return res.json(await this.handle(interaction));
  }

  private async handle(i: APIInteraction): Promise<APIInteractionResponse> {
    if (i.type === 1) {
      return { type: 1 };
    }
    return { type: 4, data: { content: "Unknown interaction" } };
  }
}
