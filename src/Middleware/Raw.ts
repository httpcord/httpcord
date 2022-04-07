import type Express from "express";

export const Raw = (req: Request) => req.text();

export const ERaw = (
  req: Express.Request,
  _: Express.Response,
  next: Express.NextFunction
) => {
  let data = "";
  req.setEncoding("utf8");

  req.on("data", (chunk) => (data += chunk));
  req.on("end", () => {
    req.body = data;
    next();
  });
};
