"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: err.message || "Something went wrong",
    });
};
exports.default = errorMiddleware;
