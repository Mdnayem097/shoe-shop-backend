"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = (0, express_1.Router)();
// POST /api/orders
router.post("/", auth_1.default, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { shippingName, shippingPhone, shippingAddress } = req.body;
        if (!shippingName || !shippingPhone || !shippingAddress) {
            return res.status(400).json({
                error: "Shipping information is required",
            });
        }
        const cart = await prisma_1.default.cart.findUnique({
            where: {
                userId: userId,
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                sizes: true,
                            },
                        },
                    },
                },
            },
        });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                error: "Your cart is empty",
            });
        }
        let totalAmount = 0;
        for (const item of cart.items) {
            const productSize = item.product.sizes.find((size) => size.size === item.size);
            if (!productSize) {
                return res.status(400).json({
                    error: `Size ${item.size} is not available`,
                });
            }
            if (productSize.stock < item.quantity) {
                return res.status(400).json({
                    error: `Not enough stock for ${item.product.name}`,
                });
            }
            totalAmount += Number(item.product.price) * item.quantity;
        }
        const order = await prisma_1.default.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId: userId,
                    totalAmount: totalAmount,
                    shippingName: shippingName,
                    shippingPhone: shippingPhone,
                    shippingAddress: shippingAddress,
                    items: {
                        create: cart.items.map((item) => ({
                            productId: item.productId,
                            size: item.size,
                            quantity: item.quantity,
                            priceAtPurchase: item.product.price,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });
            for (const item of cart.items) {
                const productSize = item.product.sizes.find((size) => size.size === item.size);
                if (productSize) {
                    await tx.productSize.update({
                        where: {
                            id: productSize.id,
                        },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }
            }
            await tx.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                },
            });
            return newOrder;
        });
        res.status(201).json({
            message: "Order created successfully",
            order,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create order",
        });
    }
});
// GET /api/orders
router.get("/", auth_1.default, async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await prisma_1.default.order.findMany({
            where: {
                userId: userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
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
// GET /api/orders/:id
router.get("/:id", auth_1.default, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                error: "Invalid order ID",
            });
        }
        const order = await prisma_1.default.order.findFirst({
            where: {
                id: id,
                userId: userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order) {
            return res.status(404).json({
                error: "Order not found",
            });
        }
        res.json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch order",
        });
    }
});
exports.default = router;
