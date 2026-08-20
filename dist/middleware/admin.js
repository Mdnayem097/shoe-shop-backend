"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminMiddleware = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== "ADMIN") {
        res.status(403).json({
            error: "Admin access required",
        });
        return;
    }
    next();
};
exports.default = adminMiddleware;
