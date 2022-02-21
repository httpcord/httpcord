import { Routes } from "discord-api-types/v10";

export * from "discord-api-types/v10";
export type Route = ReturnType<typeof Routes[keyof typeof Routes]>;
