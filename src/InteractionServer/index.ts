import Express, { Router, Request, Response } from "express";
import { Verify, JSONBody, Raw } from "../Middleware";
import { Interaction, Response as IResponse } from "../APITypes";
import { Config } from "./Config";

export class InteractionServer {
  private router = Router();
  private app = Express();
  public listen = this.app.listen;

  constructor(config: Config) {
    this.router.post("/", Raw, Verify(config.publicKey), JSONBody, this.resp);
    this.app.use(this.router);
  }

  private async resp(req: Request, res: Response) {
    const interaction = req.body as Interaction;
    return res.json(await this.handle(interaction));
  }

  private async handle(interaction: Interaction): Promise<IResponse> {
    if (interaction.type === 1) {
      return { type: 1 };
    }
    return { type: 4, data: { content: "Unknown interaction" } };
  }
}
