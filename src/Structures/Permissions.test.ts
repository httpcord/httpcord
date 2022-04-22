import { Permission, Permissions } from "./Permissions";

// Basic permissions
const sendRead = Permission.SendMessages | Permission.ReadMessageHistory;
const admin = Permission.Administrator;

describe("Permissions", () => {
  let perm: Permissions;

  beforeEach(() => (perm = new Permissions(sendRead)));

  it("Instantiates correctly", () => {
    expect(perm.bits).toEqual(sendRead);
  });

  it("Resolves allowed permissions to true", () => {
    expect(perm.can(Permission.SendMessages)).toBe(true);
    expect(perm.can(Permission.ReadMessageHistory)).toBe(true);
  });

  it("Resolves denied permissions to false", () => {
    expect(perm.can(Permission.Speak)).toBe(false);
    expect(perm.can(Permission.KickMembers)).toBe(false);
    expect(perm.can(Permission.BanMembers)).toBe(false);
    expect(perm.can(Permission.ManageGuild)).toBe(false);
  });

  it("Can inherit admin permission", () => {
    const adminPerm = new Permissions(admin);
    expect(adminPerm.can(Permission.Speak)).toBe(true);
    expect(adminPerm.can(Permission.KickMembers)).toBe(true);
    expect(adminPerm.can(Permission.BanMembers)).toBe(true);
    expect(adminPerm.can(Permission.ManageGuild)).toBe(true);
  });
});
