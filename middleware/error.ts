import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  res.status(500).json({
    error: err.message || "Something went wrong",
  });
};

export default errorMiddleware;