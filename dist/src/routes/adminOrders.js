"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const admin_1 = __importDefault(require("../../middleware/admin"));
const router = (0, express_1.Router)();
// GET /api/admin/orders
router.get("/", auth_1.default, admin_1.default, async (req, res) => {
    try {
        const orders = await prisma_1.default.order.findMany({
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch orders",
        });
    }
});
// PUT /api/admin/orders/:id/status
router.put("/:id/status", auth_1.default, admin_1.default, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                error: "Invalid order ID",
            });
        }
        const validStatuses = [
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: "Invalid order status",
            });
        }
        const order = await prisma_1.default.order.update({
            where: {
                id: id,
            },
            data: {
                status: status,
            },
        });
        res.json({
            message: "Order status updated successfully",
            order,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update order status",
        });
    }
});
exports.default = router;
