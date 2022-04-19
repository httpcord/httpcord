import type { Request, Response } from "express";
import { BaseServer } from "./Base";
import { EJSONBody, ERaw, EVerify } from "./Middleware";
import type { BaseServerConfig, ExpressServerConfig } from "./Types";

/** An interaction server made specifically for using with Express. */
export class ExpressServer extends BaseServer<ExpressServerConfig> {
  constructor(config: BaseServerConfig & ExpressServerConfig) {
    super(config);

    // Determine if what we got in the config was an app or a router.
    const obj = "app" in config ? config.app : config.router;
    const url = "url" in config ? config.url ?? "/" : "/";
    const handleRequest = this.handleRequest.bind(this);

    // Register post url handler.
    obj.post(url, ERaw, EVerify(config.publicKey), EJSONBody, handleRequest);
  }

  /** Handles an incoming Express request. */
  private async handleRequest(req: Request, res: Response) {
    return res.json(await this.handleInteraction(req.body));
  }
}
