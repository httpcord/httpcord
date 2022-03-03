import { APIRole } from "discord-api-types/v10";

export class Role {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;

  icon?: string;
  emoji?: string;

  constructor(data: APIRole) {}
}
