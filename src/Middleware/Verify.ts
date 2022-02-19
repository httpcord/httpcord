import NaCl from "tweetnacl";
import { Request, Response, NextFunction } from "express";

export const Verify =
  (key: string) => (req: Request, res: Response, next: NextFunction) => {
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
