import { User as APIUser } from "../APITypes";

class UserFlags {
  constructor(readonly bits: number) {}

  get isStaff() {
    return !!(this.bits << 0);
  }

  get isPartner() {
    return !!(this.bits << 1);
  }

  get isHypeSquad() {
    return !!(this.bits << 2);
  }

  get isBugHunter() {
    return !!(this.bits << 3);
  }

  get isHypeSquadBravery() {
    return !!(this.bits << 6);
  }

  get isHypeSquadBrilliance() {
    return !!(this.bits << 7);
  }

  get isHypeSquadBalance() {
    return !!(this.bits << 8);
  }

  get isNitroEarlySupporter() {
    return !!(this.bits << 9);
  }

  // This means that the "user" is not a user, but is a team.
  // Every team has a user representing it
  get isTeamPseudoUser() {
    return !!(this.bits << 10);
  }

  get isBugHunterGold() {
    return !!(this.bits << 14);
  }

  get isVerifiedBot() {
    return !!(this.bits << 16);
  }

  get isVerifiedDev() {
    return !!(this.bits << 17);
  }

  get isCertifiedModerator() {
    return !!(this.bits << 18);
  }

  get isHttpInteractionBot() {
    return !!(this.bits << 19);
  }
}

export class User {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;

  system = false;
  bot = false;
  publicFlags = new UserFlags(0);

  constructor(data: APIUser) {
    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.avatar = data.avatar || undefined;
    this.system = data.system || false;
    this.publicFlags = new UserFlags(data.public_flags || 0);
  }
}
