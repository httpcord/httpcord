import type { Cache } from "../Cache/Cache";
import type { CachedValue } from "../Cache/Value";
import {
  ApplicationCommandInteraction,
  ChatInputInteraction,
  Interaction
} from "../Structures";
import type { APIInteraction } from "../Types";
import { ApplicationCommandType, InteractionType, Snowflake } from "../Types";

/**
 * Helper function that creates a cache sweeper to sweep old values.
 * @param sinceRead ms since last read before an item would be deleted
 * @param sinceWrite ms since last write before an item would be deleted
 */
export function sweepAfterMinutes(sinceRead: number, sinceWrite?: number) {
  const mSinceRead = sinceRead * 1000 * 60;
  const mSinceWrite = sinceWrite && sinceWrite * 1000 * 60;

  return <V>(_cache: Cache<V>, _id: Snowflake, v: CachedValue<V>) => {
    const now = Date.now();
    const readExpired = v.lastRead && now - v.lastRead >= mSinceRead;
    const writeExpired = mSinceWrite && now - v.lastWrite >= mSinceWrite;
    return !!(readExpired || writeExpired);
  };
}

/**
 * Check whether 2 arrays are equal sets (i.e. elements only appear once).
 * @param arr1 The first array.
 * @param arr2 The second array.
 * @returns True if the two arrays are identical as sets.
 */
export function areArraysEqualSets(arr1: unknown[], arr2: unknown[]) {
  // Filter out any objects and convert them to JSON
  const p1 = arr1.map((x) => (typeof x === "object" ? JSON.stringify(x) : x));
  const p2 = arr2.map((x) => (typeof x === "object" ? JSON.stringify(x) : x));

  const unique1 = Array.from(new Set(p1));
  const unique2 = Array.from(new Set(p2));

  const difference = unique1.filter((i) => !unique2.includes(i));
  return difference.length === 0;
}

/**
 * Converts an interaction raw object into an interaction constructor.
 * @param raw The raw interaction data to be converted.
 * @returns A class constructor representing that interaction.
 */
export function toInteraction(raw: APIInteraction) {
  switch (raw.type) {
    case InteractionType.ApplicationCommand:
      // Application command interactions have their own nested type
      switch (raw.data.type) {
        case ApplicationCommandType.ChatInput:
          return ChatInputInteraction;
        default:
          return ApplicationCommandInteraction;
      }

    default:
      return Interaction; // generic interaction
  }
}

/**
 * Sleeps for a certain amount of milliseconds.
 * @param ms The number of milliseconds to sleep for.
 */
export async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}
