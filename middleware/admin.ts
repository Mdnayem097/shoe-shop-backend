import { Request, Response, NextFunction } from "express";

const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({
      error: "Admin access required",
    });
  }

  next();
};

export default adminMiddleware;