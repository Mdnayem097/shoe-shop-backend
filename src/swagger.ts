import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Shoe Shop API",
    version: "1.0.0",
    description: "REST API for Shoe Shop e-commerce application",
  },

  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      ProductSize: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          size: {
            type: "string",
            example: "US 9",
          },
          stock: {
            type: "integer",
            example: 10,
          },
        },
      },

      Product: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "cmsyx7wg600008stz2tvnab3d",
          },
          name: {
            type: "string",
            example: "Nike Air Max 270",
          },
          description: {
            type: "string",
            example: "Comfortable and stylish running shoes.",
          },
          price: {
            type: "number",
            example: 129.99,
          },
          imageUrl: {
            type: "string",
            example: "https://example.com/shoe.jpg",
          },
          brand: {
            type: "string",
            example: "Nike",
          },
          category: {
            type: "string",
            example: "Running",
          },
          isActive: {
            type: "boolean",
            example: true,
          },
          sizes: {
            type: "array",
            items: {
              $ref: "#/components/schemas/ProductSize",
            },
          },
        },
      },

      OrderStatus: {
        type: "string",
        enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      },
    },
  },

  paths: {
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get all active products",
        responses: {
          "200": {
            description: "Products fetched successfully",
          },
          "500": {
            description: "Failed to fetch products",
          },
        },
      },

      post: {
        tags: ["Products"],
        summary: "Create a new product",
        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "name",
                  "description",
                  "price",
                  "imageUrl",
                  "brand",
                  "category",
                  "sizes",
                ],
                properties: {
                  name: {
                    type: "string",
                    example: "Nike Air Max 270",
                  },
                  description: {
                    type: "string",
                    example: "Comfortable and stylish running shoes.",
                  },
                  price: {
                    type: "number",
                    example: 129.99,
                  },
                  imageUrl: {
                    type: "string",
                    example: "https://example.com/shoe.jpg",
                  },
                  brand: {
                    type: "string",
                    example: "Nike",
                  },
                  category: {
                    type: "string",
                    example: "Running",
                  },
                  sizes: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["size", "stock"],
                      properties: {
                        size: {
                          type: "string",
                          example: "US 9",
                        },
                        stock: {
                          type: "integer",
                          example: 10,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        responses: {
          "201": {
            description: "Product created successfully",
          },
          "400": {
            description: "Invalid product data",
          },
          "401": {
            description: "Authentication required",
          },
          "403": {
            description: "Admin access required",
          },
          "500": {
            description: "Failed to create product",
          },
        },
      },
    },

    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get a single product",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Product fetched successfully",
          },
          "404": {
            description: "Product not found",
          },
          "500": {
            description: "Failed to fetch product",
          },
        },
      },

      put: {
        tags: ["Products"],
        summary: "Update a product",
        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: "Nike Air Max Updated",
                  },
                  description: {
                    type: "string",
                    example: "Updated shoe description",
                  },
                  price: {
                    type: "number",
                    example: 139.99,
                  },
                  imageUrl: {
                    type: "string",
                    example: "https://example.com/shoe.jpg",
                  },
                  brand: {
                    type: "string",
                    example: "Nike",
                  },
                  category: {
                    type: "string",
                    example: "Running",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Product updated successfully",
          },
          "400": {
            description: "Invalid product data",
          },
          "401": {
            description: "Authentication required",
          },
          "403": {
            description: "Admin access required",
          },
          "500": {
            description: "Failed to update product",
          },
        },
      },

      delete: {
        tags: ["Products"],
        summary: "Soft delete a product",
        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          "200": {
            description: "Product deleted successfully",
          },
          "400": {
            description: "Invalid product ID",
          },
          "401": {
            description: "Authentication required",
          },
          "403": {
            description: "Admin access required",
          },
          "500": {
            description: "Failed to delete product",
          },
        },
      },
    },

    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: {
                    type: "string",
                    example: "Md Nayem",
                  },
                  email: {
                    type: "string",
                    example: "nayem@example.com",
                  },
                  password: {
                    type: "string",
                    example: "12345678",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
          },
          "400": {
            description: "Invalid registration data",
          },
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    example: "nayem@example.com",
                  },
                  password: {
                    type: "string",
                    example: "12345678",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
          },
          "401": {
            description: "Invalid email or password",
          },
        },
      },
    },

    "/api/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get current user's cart",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Cart fetched successfully",
          },
          "401": {
            description: "Authentication required",
          },
        },
      },
    },

    "/api/cart/items": {
      post: {
        tags: ["Cart"],
        summary: "Add product to cart",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "size", "quantity"],
                properties: {
                  productId: {
                    type: "string",
                    example: "cmsyx7wg600008stz2tvnab3d",
                  },
                  size: {
                    type: "string",
                    example: "US 9",
                  },
                  quantity: {
                    type: "integer",
                    example: 2,
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Product added to cart",
          },
          "400": {
            description: "Invalid cart data or insufficient stock",
          },
          "401": {
            description: "Authentication required",
          },
        },
      },
    },

    "/api/cart/items/{id}": {
      patch: {
        tags: ["Cart"],
        summary: "Update cart item quantity",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["quantity"],
                properties: {
                  quantity: {
                    type: "integer",
                    minimum: 1,
                    example: 3,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Cart item quantity updated successfully",
          },
          "400": {
            description: "Invalid quantity or insufficient stock",
          },
          "401": {
            description: "Authentication required",
          },
          "404": {
            description: "Cart item not found",
          },
        },
      },

      delete: {
        tags: ["Cart"],
        summary: "Remove item from cart",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Cart item removed successfully",
          },
          "404": {
            description: "Cart item not found",
          },
          "401": {
            description: "Authentication required",
          },
        },
      },
    },

    "/api/orders": {
      post: {
        tags: ["Orders"],
        summary: "Create a new order",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  shippingName: {
                    type: "string",
                    example: "Md Nayem",
                  },
                  shippingAddress: {
                    type: "string",
                    example: "Dhaka, Bangladesh",
                  },
                  phone: {
                    type: "string",
                    example: "01700000000",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Order created successfully",
          },
          "400": {
            description: "Invalid order or insufficient stock",
          },
          "401": {
            description: "Authentication required",
          },
        },
      },

      get: {
        tags: ["Orders"],
        summary: "Get current user's orders",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Orders fetched successfully",
          },
          "401": {
            description: "Authentication required",
          },
        },
      },
    },

    "/api/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get a single order",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Order fetched successfully",
          },
          "404": {
            description: "Order not found",
          },
          "401": {
            description: "Authentication required",
          },
        },
      },
    },

    "/api/admin/orders": {
      get: {
        tags: ["Admin"],
        summary: "Get all orders",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "All orders fetched successfully",
          },
          "401": {
            description: "Authentication required",
          },
          "403": {
            description: "Admin access required",
          },
        },
      },
    },

    "/api/admin/orders/{id}/status": {
      put: {
        tags: ["Admin"],
        summary: "Update order status",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    $ref: "#/components/schemas/OrderStatus",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Order status updated successfully",
          },
          "400": {
            description: "Invalid order status",
          },
          "401": {
            description: "Authentication required",
          },
          "403": {
            description: "Admin access required",
          },
        },
      },
    },
  },
};

export { swaggerDocument, swaggerUi };
