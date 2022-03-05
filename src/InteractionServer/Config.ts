import { Application, Router } from "express";

export type InteractionServerConfig = {
  publicKey: string;
};

export type ExpressServerConfig =
  | (InteractionServerConfig & { app: Application; url?: string })
  | (InteractionServerConfig & { router: Router });
