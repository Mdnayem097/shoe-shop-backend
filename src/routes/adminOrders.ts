import { Router } from "express";
import prisma from "../prisma";
import authMiddleware from "../../middleware/auth";
import adminMiddleware from "../../middleware/admin";

const router = Router();

// GET /api/admin/orders
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch orders",
    });
  }
});

// PUT /api/admin/orders/:id/status
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
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

    const order = await prisma.order.update({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update order status",
    });
  }
});

export default router;
