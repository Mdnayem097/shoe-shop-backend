import { Request, Response, NextFunction } from "express";

const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user;

  if (!user || user.role !== "ADMIN") {
    res.status(403).json({
      error: "Admin access required",
    });
    return;
  }

  next();
};

export default adminMiddleware;