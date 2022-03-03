import { Permissions as APIPermissions, PermissionFlagsBits } from "../Types";

export class Permissions {
  raw: APIPermissions;

  constructor(data: APIPermissions) {
    this.raw = data;
  }
}
