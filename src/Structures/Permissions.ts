import type {
  PermissionFlagsBits,
  Permissions as APIPermissions
} from "../Types";

declare const temp1: APIPermissions;
declare const temp2: typeof PermissionFlagsBits;

export class Permissions {
  constructor(readonly bits: BigInt) {}
}
