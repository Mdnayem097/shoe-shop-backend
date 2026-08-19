import { Router } from "express";
import prisma from "../prisma";
import authMiddleware from "../../middleware/auth";
import adminMiddleware from "../../middleware/admin";

const router = Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        sizes: true,
      },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch products",
    });
  }
});

// POST /api/products
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      imageUrl,
      brand,
      category,
      sizes,
    } = req.body;

    const product = await prisma.product.create({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create product",
    });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch product",
    });
  }
});

// PUT /api/products/:id
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "Invalid product ID",
      });
    }

    const { name, description, price, imageUrl, brand, category, } =
      req.body;

    const product = await prisma.product.update({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update product",
    });
  }
});

// DELETE /api/products/:id
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "Invalid product ID",
      });
    }

    const product = await prisma.product.update({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete product",
    });
  }
});

export default router;
