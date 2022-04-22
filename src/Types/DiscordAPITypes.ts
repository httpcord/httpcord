import type {
  APIGuildMember,
  APIInteractionDataResolvedGuildMember,
  Routes
} from "discord-api-types/v10";

export * from "discord-api-types/v10";

export type APIFetchedGuildMember = APIGuildMember &
  Required<Pick<APIGuildMember, "user">>;
export type Snowflake = `${bigint}`; // discord-api-types snowflake sucks
export type Route = ReturnType<typeof Routes[keyof typeof Routes]>;

export type APIFullOrInteractionGuildMember =
  | APIGuildMember
  | APIInteractionDataResolvedGuildMember;
