import type { ChannelType } from "../../../Types";
import { TextBasedChannel } from "./Base";

/** Represents a shared DM channel (up to 10 people). */
export class GroupDMChannel extends TextBasedChannel<ChannelType.GroupDM> {}
