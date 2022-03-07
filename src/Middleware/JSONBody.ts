import Express from "express";

export const JSONBody = (body: string) => {
  try {
    return JSON.parse(body);
  } catch (e) {
    return null;
  }
};

export const EJSONBody = (
  req: Express.Request,
  _: Express.Response,
  next: Express.NextFunction
) => {
  try {
    req.body = JSON.parse(req.body);
    next();
  } catch (e) {
    // Continue regardless of error
  }
};
