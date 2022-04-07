import type { Role, User } from ".";
import type { APIWrapper } from "../API";
import type { APIInteractionDataResolvedGuildMember } from "../Types";

export class Member {
  user: User;
  // guild: Guild;

  nick?: string;
  avatar?: string;
  roles: Role[] | string[] = [];

  constructor(
    readonly api: APIWrapper,
    // guild: Guild,
    data: APIInteractionDataResolvedGuildMember,
    user: User,
    roles?: Role[]
  ) {
    this.user = user;
    // this.guild = guild;
    this.roles = roles || data.roles;
  }
}
