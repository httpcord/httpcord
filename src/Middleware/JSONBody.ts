import { Request, Response, NextFunction } from "express";

export const JSONBody = (req: Request, _: Response, next: NextFunction) => {
  req.body = JSON.parse(req.body);
  next();
};
