import type Express from "express";
import NaCl from "tweetnacl";

export const Verify = (key: string) => (req: Request, body: string) => {
  if (key === "DISABLE_VERIFICATION") return true;

  const signature = req.headers.get("X-Signature-Ed25519");
  const timestamp = req.headers.get("X-Signature-Timestamp");

  if (!signature || !timestamp || !body) return false;

  const isVerified = NaCl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, "hex"),
    Buffer.from(key, "hex")
  );

  return isVerified;
};

export const EVerify =
  (key: string) =>
  (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    if (key === "DISABLE_VERIFICATION") return next(); // local development

    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");
    const body = req.body;

    if (!signature || !timestamp || !body) {
      return res.status(401).end("Unauthorized");
    }

    const isVerified = NaCl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, "hex"),
      Buffer.from(key, "hex")
    );

    if (!isVerified) return res.status(401).end("Unauthorized");
    next(); // all is good, continue
  };
