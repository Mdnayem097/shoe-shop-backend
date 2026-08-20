"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = (0, express_1.Router)();
// GET /api/cart
router.get("/", auth_1.default, async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await prisma_1.default.cart.findUnique({
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
        });
        if (!cart) {
            return res.json({
                items: [],
            });
        }
        res.json(cart);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch cart",
        });
    }
});
// POST /api/cart/items
router.post("/items", auth_1.default, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, size, quantity } = req.body;
        if (!productId || !size || !quantity) {
            return res.status(400).json({
                error: "Product, size and quantity are required",
            });
        }
        const product = await prisma_1.default.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                sizes: true,
            },
        });
        if (!product || !product.isActive) {
            return res.status(404).json({
                error: "Product not found",
            });
        }
        const productSize = product.sizes.find((item) => item.size === size);
        if (!productSize) {
            return res.status(400).json({
                error: "Selected size is not available",
            });
        }
        if (productSize.stock < quantity) {
            return res.status(400).json({
                error: "Not enough stock",
            });
        }
        let cart = await prisma_1.default.cart.findUnique({
            where: {
                userId: userId,
            },
        });
        if (!cart) {
            cart = await prisma_1.default.cart.create({
                data: {
                    userId: userId,
                },
            });
        }
        const existingItem = await prisma_1.default.cartItem.findUnique({
            where: {
                cartId_productId_size: {
                    cartId: cart.id,
                    productId: productId,
                    size: size,
                },
            },
        });
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > productSize.stock) {
                return res.status(400).json({
                    error: "Not enough stock",
                });
            }
            const updatedItem = await prisma_1.default.cartItem.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity: newQuantity,
                },
            });
            return res.json({
                message: "Cart updated successfully",
                item: updatedItem,
            });
        }
        const cartItem = await prisma_1.default.cartItem.create({
            data: {
                cartId: cart.id,
                productId: productId,
                size: size,
                quantity: quantity,
            },
        });
        res.status(201).json({
            message: "Product added to cart",
            item: cartItem,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to add product to cart",
        });
    }
});
// PATCH /api/cart/items/:id
router.patch("/items/:id", auth_1.default, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { quantity } = req.body;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                error: "Invalid cart item ID",
            });
        }
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                error: "Quantity must be at least 1",
            });
        }
        const cartItem = await prisma_1.default.cartItem.findFirst({
            where: {
                id: id,
                cart: {
                    userId: userId,
                },
            },
            include: {
                product: {
                    include: {
                        sizes: true,
                    },
                },
            },
        });
        if (!cartItem) {
            return res.status(404).json({
                error: "Cart item not found",
            });
        }
        const productSize = cartItem.product.sizes.find((item) => item.size === cartItem.size);
        if (!productSize) {
            return res.status(400).json({
                error: "Selected size is not available",
            });
        }
        if (quantity > productSize.stock) {
            return res.status(400).json({
                error: "Not enough stock",
            });
        }
        const updatedItem = await prisma_1.default.cartItem.update({
            where: {
                id: id,
            },
            data: {
                quantity: quantity,
            },
        });
        res.json({
            message: "Cart updated successfully",
            item: updatedItem,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update cart",
        });
    }
});
// DELETE /api/cart/items/:id
router.delete("/items/:id", auth_1.default, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                error: "Invalid cart item ID",
            });
        }
        const cartItem = await prisma_1.default.cartItem.findFirst({
            where: {
                id: id,
                cart: {
                    userId: userId,
                },
            },
        });
        if (!cartItem) {
            return res.status(404).json({
                error: "Cart item not found",
            });
        }
        await prisma_1.default.cartItem.delete({
            where: {
                id: id,
            },
        });
        res.json({
            message: "Item removed from cart",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to remove cart item",
        });
    }
});
exports.default = router;
