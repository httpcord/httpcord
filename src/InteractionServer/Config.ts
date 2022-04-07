import type { Application, Router } from "express";

export type InteractionServerConfig = {
  publicKey: string;
  token?: string;
  registerCommands?: number | false;
};

export type ExpressServerConfig =
  | (InteractionServerConfig & { app: Application; url?: string })
  | (InteractionServerConfig & { router: Router });
