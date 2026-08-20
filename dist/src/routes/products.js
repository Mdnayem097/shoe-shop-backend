"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const admin_1 = __importDefault(require("../../middleware/admin"));
const product_validation_1 = require("../validations/product.validation");
const router = (0, express_1.Router)();
// GET /api/products
router.get("/", async (req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
            where: {
                isActive: true,
            },
            include: {
                sizes: true,
            },
        });
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch products",
        });
    }
});
// POST /api/products
router.post("/", auth_1.default, admin_1.default, async (req, res) => {
    try {
        const result = product_validation_1.productSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: result.error.issues[0].message,
            });
        }
        const { name, description, price, imageUrl, brand, category, sizes } = result.data;
        const product = await prisma_1.default.product.create({
            data: {
                name,
                description,
                price,
                imageUrl,
                brand,
                category,
                sizes: {
                    create: sizes || [],
                },
            },
            include: {
                sizes: true,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create product",
        });
    }
});
// GET /api/products/:id
router.get("/:id", async (req, res) => {
    try {
        const product = await prisma_1.default.product.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                sizes: true,
            },
        });
        if (!product) {
            return res.status(404).json({
                error: "Product not found",
            });
        }
        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch product",
        });
    }
});
// PUT /api/products/:id
router.put("/:id", auth_1.default, admin_1.default, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                error: "Invalid product ID",
            });
        }
        const result = product_validation_1.updateProductSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: result.error.issues[0].message,
            });
        }
        const { name, description, price, imageUrl, brand, category } = result.data;
        const product = await prisma_1.default.product.update({
            where: {
                id: id,
            },
            data: {
                name,
                description,
                price,
                imageUrl,
                brand,
                category,
            },
        });
        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update product",
        });
    }
});
// DELETE /api/products/:id
router.delete("/:id", auth_1.default, admin_1.default, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                error: "Invalid product ID",
            });
        }
        const product = await prisma_1.default.product.update({
            where: {
                id: id,
            },
            data: {
                isActive: false,
            },
        });
        res.json({
            message: "Product deleted successfully",
            product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete product",
        });
    }
});
exports.default = router;
