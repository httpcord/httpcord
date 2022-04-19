import type { Request as ERequest, Response as EResponse } from "express";
import NaCl from "tweetnacl";
import { Headers, Request } from "undici";
import { EVerify, Verify } from "./Verify";

const keyPair = NaCl.sign.keyPair();
const publicKey = Buffer.from(keyPair.publicKey).toString("hex");
const secretKey = keyPair.secretKey;

// Ping payload
const body = JSON.stringify({ type: 1 });

// Helper function to sign
function sign(key = secretKey) {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString();
  const sig = NaCl.sign.detached(Buffer.from(timestamp + body), key);
  return { sig, timestamp };
}

describe("Middleware/Verify (Fetch API)", () => {
  let verify: ReturnType<typeof Verify>;
  let req: Request;

  beforeEach(() => {
    verify = Verify(publicKey);
    req = new Request("http://localhost", { method: "POST", body });
  });

  it("instantiates correctly", () => {
    expect(typeof verify).toEqual("function");
  });

  it("permits signed requests", () => {
    const { sig, timestamp } = sign();
    req.headers.set("X-Signature-Ed25519", Buffer.from(sig).toString("hex"));
    req.headers.set("X-Signature-Timestamp", timestamp);
    expect(verify(req, body)).toBe(true);
  });

  it("permits unsigned requests when verification is disabled", () => {
    verify = Verify("DISABLE_VERIFICATION");
    expect(verify(req, body)).toBe(true);
  });

  it("disallows unsigned requests", () => {
    expect(verify(req, body)).toBe(false);
  });

  it("disallows signed requests with a different signature", () => {
    const { secretKey: otherKey } = NaCl.sign.keyPair();
    const { sig, timestamp } = sign(otherKey);
    req.headers.set("X-Signature-Ed25519", Buffer.from(sig).toString("hex"));
    req.headers.set("X-Signature-Timestamp", timestamp);
    expect(verify(req, body)).toBe(false);
  });

  it("disallows requests without a timestamp", () => {
    const { sig } = sign();
    req.headers.set("X-Signature-Ed25519", Buffer.from(sig).toString("hex"));
    expect(verify(req, body)).toBe(false);
  });

  it("disallows requests with a timestamp but no signature", () => {
    const { timestamp } = sign();
    req.headers.set("X-Signature-Timestamp", timestamp);
    expect(verify(req, body)).toBe(false);
  });

  it("disallows requests with no body", () => {
    const req = new Request("http://localhost");
    expect(verify(req, "")).toBe(false);
  });
});

describe("Middleware/Verify (Express)", () => {
  let verify: ReturnType<typeof EVerify>;
  let req: ERequest;
  let res: EResponse;
  let next: jest.Mock;

  // Set up fake request/responses with only parameters we need
  beforeEach(() => {
    verify = EVerify(publicKey);
    req = {
      headers: new Headers(),
      get(r: string) {
        return (this as { headers: Headers }).headers.get(r);
      },
      body,
    } as unknown as ERequest;
    res = {
      status: jest.fn(function (this: ERequest, _: number) {
        return this;
      }),
      end: jest.fn(),
    } as unknown as EResponse;
    next = jest.fn();
  });

  it("instantiates correctly", () => {
    expect(typeof verify).toBe("function");
  });

  it("permits signed requests", () => {
    const { sig, timestamp } = sign();
    const headers = req.headers as unknown as Headers;
    headers.set("X-Signature-Ed25519", Buffer.from(sig).toString("hex"));
    headers.set("X-Signature-Timestamp", timestamp);

    verify(req, res, next);
    expect((res.status as jest.Mock).mock.calls).toHaveLength(0);
    expect((res.end as jest.Mock).mock.calls).toHaveLength(0);
    expect(next.mock.calls).toHaveLength(1);
  });

  it("permits unsigned requests when verification is disabled", () => {
    verify = EVerify("DISABLE_VERIFICATION");

    verify(req, res, next);
    expect((res.status as jest.Mock).mock.calls).toHaveLength(0);
    expect((res.end as jest.Mock).mock.calls).toHaveLength(0);
    expect(next.mock.calls).toHaveLength(1);
  });

  it("disallows unsigned requests", () => {
    verify(req, res, next);
    expect((res.status as jest.Mock).mock.calls[0][0]).toBe(401);
    expect((res.end as jest.Mock).mock.calls).toHaveLength(1);
    expect(next.mock.calls).toHaveLength(0);
  });

  it("disallows signed requests with a different signature", () => {
    const { secretKey: otherKey } = NaCl.sign.keyPair();
    const { sig, timestamp } = sign(otherKey);
    const headers = req.headers as unknown as Headers;
    headers.set("X-Signature-Ed25519", Buffer.from(sig).toString("hex"));
    headers.set("X-Signature-Timestamp", timestamp);

    verify(req, res, next);
    expect((res.status as jest.Mock).mock.calls[0][0]).toBe(401);
    expect((res.end as jest.Mock).mock.calls).toHaveLength(1);
    expect(next.mock.calls).toHaveLength(0);
  });

  it("disallows requests without a timestamp", () => {
    const { sig } = sign();
    const headers = req.headers as unknown as Headers;
    headers.set("X-Signature-Ed25519", Buffer.from(sig).toString("hex"));

    verify(req, res, next);
    expect((res.status as jest.Mock).mock.calls[0][0]).toBe(401);
    expect((res.end as jest.Mock).mock.calls).toHaveLength(1);
    expect(next.mock.calls).toHaveLength(0);
  });

  it("disallows requests with a timestamp but no signature", () => {
    const { timestamp } = sign();
    const headers = req.headers as unknown as Headers;
    headers.set("X-Signature-Timestamp", timestamp);

    verify(req, res, next);
    expect((res.status as jest.Mock).mock.calls[0][0]).toBe(401);
    expect((res.end as jest.Mock).mock.calls).toHaveLength(1);
    expect(next.mock.calls).toHaveLength(0);
  });

  it("disallows requests with no body", () => {
    req.body = "";

    verify(req, res, next);
    expect((res.status as jest.Mock).mock.calls[0][0]).toBe(401);
    expect((res.end as jest.Mock).mock.calls).toHaveLength(1);
    expect(next.mock.calls).toHaveLength(0);
  });
});
