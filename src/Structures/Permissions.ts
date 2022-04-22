import { PermissionFlagsBits } from "../Types";
import { Bits } from "../Utils";

export class Permissions extends Bits {
  protected static DefaultBit = BigInt(104324673);
  public static Flags = PermissionFlagsBits;

  /**
   * Asserts if the permissions can perform an action. It will return true if
   * the user has the administrator permission. To ignore admin permission, use
   * Permissions#has.
   *
   * @param perm The permission to check that exists.
   * @returns True if the action can be performed.
   */
  public can(perm: bigint) {
    if (this.has(PermissionFlagsBits.Administrator)) return true;
    return this.has(perm);
  }
}

// Utility
export { PermissionFlagsBits as Perm, PermissionFlagsBits as Permission };
