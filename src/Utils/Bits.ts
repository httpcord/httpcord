export type BitLike = string | number | bigint | BitLike[];

/** Utility class for dealing with bit fields. */
export class Bits {
  /** The default bit that will return when constructing. */
  protected static DefaultBit = BigInt(0);

  /** The possible values of the bits. */
  public static Flags: { [key: string]: BitLike };

  /** The raw bit number of the bits. */
  public bits: bigint;

  public constructor(bits: BitLike) {
    this.bits = Bits.toBit(bits);
  }

  /**
   * Asserts whether the stored bits have a bit or multiple bits.
   * @param bits The bits to check are included.
   * @returns True if all bits are included.
   */
  public has(...bits: BitLike[]) {
    return Bits.has(this.bits, bits);
  }

  /**
   * Adds new bits to existing bits stored in the class.
   * @param bits The bits to add.
   * @returns The sum of the bits.
   */
  public add(...bits: BitLike[]) {
    this.bits |= Bits.add(this.bits, ...bits);
    return this.bits;
  }

  // Statics

  /**
   * Asserts whether a primary bit has a bit or multiple bits.
   * @param primaryBit The bit to check against.
   * @param bits The bits to check are included.
   * @returns True if all bits are included.
   */
  public static has(primaryBit: BitLike, ...bits: BitLike[]) {
    const primaryResolved = Bits.toBit(primaryBit);
    const resolved = Bits.toBit(bits);
    return (primaryResolved & resolved) === resolved;
  }

  /**
   * Adds multiple bits together.
   * @param bits The bits to add together.
   * @returns The sum of the bits.
   */
  public static add(...bits: BitLike[]) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR_assignment
    let total = Bits.toBit(bits[0]);
    bits.map((b) => Bits.toBit(b)).forEach((b) => (total |= b));
    return total;
  }

  /**
   * Converts a bit-like value to a BigInt.
   * @param bit The bit to convert.
   * @returns The bit.
   */
  public static toBit(bit: BitLike): bigint {
    if (Array.isArray(bit))
      return bit
        .map((b) => this.toBit(b)) // convert everything to bits and sum them up
        .reduce((p, b) => Bits.add(p, b), this.DefaultBit);
    else if (typeof bit !== "bigint") return BigInt(bit);
    else return bit;
  }
}
