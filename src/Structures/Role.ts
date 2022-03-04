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

  constructor(data: APIRole) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.hoist = data.hoist;
    this.position = data.position;
    this.permissions = data.permissions;
    this.managed = data.managed;
    this.mentionable = data.mentionable;

    this.icon = data.icon || undefined;
    this.emoji = data.unicode_emoji || undefined;
  }
}
