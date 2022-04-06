import type { RESTJSONErrorCodes, Routes } from "discord-api-types/v10";

export * from "discord-api-types/v10";
export type Route = ReturnType<typeof Routes[keyof typeof Routes]>;

export type RESTJSONSingleValue = string | number | boolean;
export interface RESTJSONAnyPayload {
  [k: string]: RESTJSONSingleValue | RESTJSONAnyPayload;
}

export type RESTJSONErrors =
  | { _errors: RESTJSONErrors }
  | { [key: string]: RESTJSONErrors }
  | { code: string; message: string };

export type RESTJSONErrorResponse = {
  code: RESTJSONErrorCodes;
  message: string;
  errors?: RESTJSONErrors;
};
