import type { Snowflake } from "../Types";
import { PermissionFlagsBits } from "../Types";
import { Bits } from "../Utils";

/** Represents a permission overwrite object, typically found on a channel. */
export interface PermissionOverwrite {
  /** The ID of the subject (either a Role or a Member). */
  id: Snowflake;

  /** The type of the overwrite: 0 for a role or 1 for a member. */
  type: 0 | 1;

  /** The permissions set to "allow". */
  allow: Permissions;

  /** The permissions set to "deny". */
  deny: Permissions;
}

/** Represents a permissions object in Discord. */
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
