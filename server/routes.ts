import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertOrderSchema, 
  insertContactSchema, 
  insertNewsletterSchema,
  registerUserSchema,
  loginUserSchema
} from "@shared/schema";
import { z } from "zod";
import { 
  authenticateToken, 
  requireAdmin, 
  optionalAuth, 
  hashPassword, 
  comparePassword, 
  generateSessionToken,
  generateJWT
} from "./auth";
import { authLimiter, apiLimiter, orderLimiter } from "./middleware";
import { logger, logSecurityEvent, logBusinessEvent } from "./logger";
import { phoneVerificationService } from "./phoneVerification";

export async function registerRoutes(app: Express): Promise<Server> {

  // Authentication routes
  app.post("/api/auth/register", authLimiter, async (req, res) => {
    try {
      const userData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists with this email" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(userData.password);
      const user = await storage.createUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "customer"
      });

      // Generate JWT token
      const jwtToken = generateJWT({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      // Also create session for additional security
      const sessionToken = await generateSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await storage.createUserSession({
        userId: user.id,
        sessionToken,
        expiresAt
      });

      res.status(201).json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        },
        token: jwtToken,
        sessionToken
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      }
      logger.error("Registration failed", { error, email: userData.email });
      logSecurityEvent("REGISTRATION_FAILED", req, { email: userData.email });
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const credentials = loginUserSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(credentials.email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password
      const isPasswordValid = await comparePassword(credentials.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const jwtToken = generateJWT({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      // Create session
      const sessionToken = await generateSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await storage.createUserSession({
        userId: user.id,
        sessionToken,
        expiresAt
      });

      res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        },
        token: jwtToken,
        sessionToken
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      logger.error("Login failed", { error, email: credentials.email });
      logSecurityEvent("LOGIN_FAILED", req, { email: credentials.email });
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", authenticateToken, async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (token) {
        await storage.deleteUserSession(token);
      }
      
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      logger.error("Logout failed", { error, userId: req.user?.id });
      res.status(500).json({ message: "Logout failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        phone: user.phone,
        address: user.address
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user data" });
    }
  });

  // Apply rate limiting to API endpoints
  app.use("/api", apiLimiter);

  // Products endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const products = await storage.getProducts(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Orders endpoints
  app.get("/api/orders", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/my", authenticateToken, async (req, res) => {
    try {
      const orders = await storage.getUserOrders(req.user!.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });

  app.post("/api/orders", orderLimiter, optionalAuth, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // If user is logged in, associate order with user
      if (req.user) {
        orderData.userId = req.user.id;
      }
      
      const order = await storage.createOrder(orderData);
      
      logBusinessEvent("ORDER_CREATED", {
        orderId: order.id,
        amount: order.totalAmount,
        customerEmail: order.customerEmail,
        paymentMethod: order.paymentMethod,
        items: JSON.parse(order.items).length
      });

      // Generate phone verification for cash-on-delivery orders
      if (order.paymentMethod === 'cash_on_delivery' && order.customerPhone) {
        try {
          await phoneVerificationService.generateVerificationCode(order.customerPhone, order.id);
          logBusinessEvent("PHONE_VERIFICATION_SENT", {
            orderId: order.id,
            phone: order.customerPhone.slice(-4) // Log only last 4 digits
          });
        } catch (verificationError) {
          logger.warn("Failed to send phone verification", { 
            orderId: order.id, 
            error: verificationError 
          });
        }
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      logger.error("Order creation failed", { error, body: req.body });
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      logBusinessEvent("ORDER_STATUS_UPDATED", {
        orderId: order.id,
        oldStatus: req.body.oldStatus,
        newStatus: status,
        adminId: req.user!.id
      });
      
      res.json(order);
    } catch (error) {
      logger.error("Failed to update order status", { error, orderId: req.params.id });
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Phone verification endpoints
  app.post("/api/orders/:orderId/verify-phone", async (req, res) => {
    try {
      const { phone, code } = req.body;
      const { orderId } = req.params;
      
      if (!phone || !code) {
        return res.status(400).json({ message: "Phone and verification code are required" });
      }
      
      const result = await phoneVerificationService.verifyCode(phone, code, orderId);
      
      if (result.success) {
        logBusinessEvent("PHONE_VERIFICATION_SUCCESS", { orderId, phone: phone.slice(-4) });
        
        // Update order status to confirmed
        await storage.updateOrderStatus(orderId, "confirmed");
      } else {
        logBusinessEvent("PHONE_VERIFICATION_FAILED", { orderId, phone: phone.slice(-4) });
      }
      
      res.json(result);
    } catch (error) {
      logger.error("Phone verification failed", { error, orderId: req.params.orderId });
      res.status(500).json({ message: "Phone verification failed" });
    }
  });

  app.post("/api/orders/:orderId/resend-verification", async (req, res) => {
    try {
      const { phone } = req.body;
      const { orderId } = req.params;
      
      if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
      }
      
      const result = await phoneVerificationService.resendVerificationCode(phone, orderId);
      
      logBusinessEvent("PHONE_VERIFICATION_RESENT", { orderId, phone: phone.slice(-4) });
      
      res.json(result);
    } catch (error) {
      logger.error("Failed to resend verification code", { error, orderId: req.params.orderId });
      res.status(500).json({ message: "Failed to resend verification code" });
    }
  });

  app.get("/api/orders/:orderId/verification-status", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { phone } = req.query;
      const { orderId } = req.params;
      
      if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
      }
      
      const status = phoneVerificationService.getVerificationStatus(phone as string);
      res.json({ orderId, ...status });
    } catch (error) {
      logger.error("Failed to get verification status", { error, orderId: req.params.orderId });
      res.status(500).json({ message: "Failed to get verification status" });
    }
  });

  // Contact endpoints
  app.get("/api/contacts", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  app.put("/api/contacts/:id/status", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const contact = await storage.updateContactStatus(req.params.id, status);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to update contact status" });
    }
  });

  // Newsletter endpoints
  app.get("/api/newsletter", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const subscriptions = await storage.getNewsletterSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch newsletter subscriptions" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const subscriptionData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.createNewsletterSubscription(subscriptionData);
      res.status(201).json(subscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
