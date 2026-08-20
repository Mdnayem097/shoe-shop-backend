"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    price: zod_1.z.number().positive("Price must be greater than 0"),
    imageUrl: zod_1.z.string().min(1, "Image URL is required"),
    brand: zod_1.z.string().min(1, "Brand is required"),
    category: zod_1.z.string().min(1, "Category is required"),
    sizes: zod_1.z
        .array(zod_1.z.object({
        size: zod_1.z.string().min(1, "Size is required"),
        stock: zod_1.z
            .number()
            .int("Stock must be a whole number")
            .min(0, "Stock cannot be negative"),
    }))
        .min(1, "At least one size is required"),
});
// For updating a product
// All fields become optional
exports.updateProductSchema = exports.productSchema.partial();
