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
 * Sleeps for a certain amount of milliseconds.
 * @param ms The number of milliseconds to sleep for.
 */
export async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}
