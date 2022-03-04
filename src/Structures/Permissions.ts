import { Permissions as APIPermissions, PermissionFlagsBits } from "../Types";

export class Permissions {
  constructor(readonly bits: BigInt) {}
}
