import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),

  description: z.string().min(1, "Description is required"),

  price: z.number().positive("Price must be greater than 0"),

  imageUrl: z.string().min(1, "Image URL is required"),

  brand: z.string().min(1, "Brand is required"),

  category: z.string().min(1, "Category is required"),

  sizes: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),

        stock: z
          .number()
          .int("Stock must be a whole number")
          .min(0, "Stock cannot be negative"),
      })
    )
    .min(1, "At least one size is required"),
});

// For updating a product
// All fields become optional
export const updateProductSchema = productSchema.partial();