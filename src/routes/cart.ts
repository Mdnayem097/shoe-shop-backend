import { Router } from "express";
import prisma from "../prisma";
import authMiddleware from "../../middleware/auth";

const router = Router();

// GET /api/cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const cart = await prisma.cart.findUnique({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch cart",
    });
  }
});

// POST /api/cart/items
router.post("/items", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const { productId, size, quantity } = req.body;

    if (!productId || !size || !quantity) {
      return res.status(400).json({
        error: "Product, size and quantity are required",
      });
    }

    const product = await prisma.product.findUnique({
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

    let cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId,
        },
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
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

      const updatedItem = await prisma.cartItem.update({
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

    const cartItem = await prisma.cartItem.create({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to add product to cart",
    });
  }
});

// PATCH /api/cart/items/:id
router.patch("/items/:id", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
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

    const cartItem = await prisma.cartItem.findFirst({
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

    const productSize = cartItem.product.sizes.find(
      (item) => item.size === cartItem.size,
    );

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

    const updatedItem = await prisma.cartItem.update({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update cart",
    });
  }
});

// DELETE /api/cart/items/:id
router.delete("/items/:id", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "Invalid cart item ID",
      });
    }

    const cartItem = await prisma.cartItem.findFirst({
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

    await prisma.cartItem.delete({
      where: {
        id: id,
      },
    });

    res.json({
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to remove cart item",
    });
  }
});

export default router;
