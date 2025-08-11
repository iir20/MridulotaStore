import { 
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct, 
  type Order, 
  type InsertOrder, 
  type Contact, 
  type InsertContact, 
  type Newsletter, 
  type InsertNewsletter,
  type UserSession,
  type InsertUserSession,
  users,
  products,
  orders,
  contacts,
  newsletter,
  userSessions
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gt, lt } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;

  // User Sessions
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  getUserSession(token: string): Promise<UserSession | undefined>;
  deleteUserSession(token: string): Promise<boolean>;
  cleanExpiredSessions(): Promise<void>;

  // Products
  getProducts(category?: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Contacts
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContactStatus(id: string, status: string): Promise<Contact | undefined>;

  // Newsletter
  getNewsletterSubscriptions(): Promise<Newsletter[]>;
  createNewsletterSubscription(subscription: InsertNewsletter): Promise<Newsletter>;
  updateNewsletterStatus(email: string, status: string): Promise<Newsletter | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private contacts: Map<string, Contact>;
  private newsletter: Map<string, Newsletter>;
  private userSessions: Map<string, UserSession>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.contacts = new Map();
    this.newsletter = new Map();
    this.userSessions = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const adminUser: User = {
      id: randomUUID(),
      firstName: "Admin",
      lastName: "User",
      email: "admin@mridulota.com",
      password: "admin123",
      role: "admin",
      profileImageUrl: null,
      phone: null,
      address: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(adminUser.id, adminUser);

    // Create sample products
    const sampleProducts: Product[] = [
      {
        id: randomUUID(),
        name: "Neem Purifying Soap",
        nameBengali: "নিম সাবান",
        description: "Naturally purifying with neem extracts for healthy, clear skin",
        price: "280.00",
        category: "soaps",
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        ingredients: "Neem extract, coconut oil, olive oil, lye, essential oils",
        benefits: "Anti-bacterial, acne-fighting, natural cleansing",
        inStock: true,
        featured: true,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Turmeric Glow Soap",
        nameBengali: "হলুদ সাবান",
        description: "Brightening turmeric blend for radiant, even-toned skin",
        price: "320.00",
        category: "soaps",
        imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        ingredients: "Turmeric powder, coconut oil, shea butter, honey, lye",
        benefits: "Brightening, anti-inflammatory, natural glow",
        inStock: true,
        featured: true,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Aloe Soothing Soap",
        nameBengali: "অ্যালোভেরা সাবান",
        description: "Gentle aloe vera formula for sensitive and dry skin",
        price: "300.00",
        category: "soaps",
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        ingredients: "Aloe vera gel, coconut oil, olive oil, shea butter, lye",
        benefits: "Moisturizing, healing, gentle cleansing",
        inStock: true,
        featured: true,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Lavender Dream Soap",
        nameBengali: "ল্যাভেন্ডার সাবান",
        description: "Relaxing lavender soap for peaceful skin care",
        price: "290.00",
        category: "soaps",
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        ingredients: "Lavender essential oil, coconut oil, olive oil, lye",
        benefits: "Calming, aromatherapy, gentle cleansing",
        inStock: true,
        featured: false,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Coffee Body Scrub",
        nameBengali: "কফি স্ক্রাব",
        description: "Energizing coffee scrub for smooth, exfoliated skin",
        price: "450.00",
        category: "scrubs",
        imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        ingredients: "Ground coffee, brown sugar, coconut oil, vitamin E",
        benefits: "Exfoliating, energizing, smooth skin",
        inStock: true,
        featured: false,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Pure Coconut Oil",
        nameBengali: "নারকেল তেল",
        description: "Cold-pressed virgin coconut oil for skin and hair",
        price: "380.00",
        category: "oils",
        imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        ingredients: "100% pure coconut oil, cold-pressed",
        benefits: "Moisturizing, anti-bacterial, multi-purpose",
        inStock: true,
        featured: false,
        createdAt: new Date()
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { 
      ...user, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // User Sessions
  async createUserSession(insertSession: InsertUserSession): Promise<UserSession> {
    const id = randomUUID();
    const session: UserSession = { 
      ...insertSession, 
      id, 
      createdAt: new Date() 
    };
    this.userSessions.set(session.sessionToken, session);
    return session;
  }

  async getUserSession(token: string): Promise<UserSession | undefined> {
    const session = this.userSessions.get(token);
    if (!session) return undefined;
    
    // Check if session is expired
    if (session.expiresAt < new Date()) {
      this.userSessions.delete(token);
      return undefined;
    }
    
    return session;
  }

  async deleteUserSession(token: string): Promise<boolean> {
    return this.userSessions.delete(token);
  }

  async cleanExpiredSessions(): Promise<void> {
    const now = new Date();
    for (const [token, session] of this.userSessions) {
      if (session.expiresAt < now) {
        this.userSessions.delete(token);
      }
    }
  }

  // Products
  async getProducts(category?: string): Promise<Product[]> {
    const products = Array.from(this.products.values());
    if (category) {
      return products.filter(product => product.category === category);
    }
    return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date() 
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct: Product = { ...product, ...updateData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      status: "unread",
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContactStatus(id: string, status: string): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;
    
    const updatedContact: Contact = { ...contact, status };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  // Newsletter
  async getNewsletterSubscriptions(): Promise<Newsletter[]> {
    return Array.from(this.newsletter.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNewsletterSubscription(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const id = randomUUID();
    const subscription: Newsletter = { 
      ...insertNewsletter, 
      id, 
      status: "subscribed",
      createdAt: new Date() 
    };
    this.newsletter.set(id, subscription);
    return subscription;
  }

  async updateNewsletterStatus(email: string, status: string): Promise<Newsletter | undefined> {
    const subscription = Array.from(this.newsletter.values()).find(s => s.email === email);
    if (!subscription) return undefined;
    
    const updatedSubscription: Newsletter = { ...subscription, status };
    this.newsletter.set(subscription.id, updatedSubscription);
    return updatedSubscription;
  }
}

class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newUser;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  // User Sessions
  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const [newSession] = await db.insert(userSessions).values({
      ...session,
      createdAt: new Date()
    }).returning();
    return newSession;
  }

  async getUserSession(token: string): Promise<UserSession | undefined> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(and(eq(userSessions.sessionToken, token), gt(userSessions.expiresAt, new Date())));
    return session || undefined;
  }

  async deleteUserSession(token: string): Promise<boolean> {
    const result = await db.delete(userSessions).where(eq(userSessions.sessionToken, token));
    return result.rowCount > 0;
  }

  async cleanExpiredSessions(): Promise<void> {
    await db.delete(userSessions).where(lt(userSessions.expiresAt, new Date()));
  }

  // Products
  async getProducts(category?: string): Promise<Product[]> {
    if (category) {
      return await db.select().from(products).where(eq(products.category, category));
    }
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values({
      ...product,
      createdAt: new Date()
    }).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values({
      ...order,
      createdAt: new Date()
    }).returning();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder || undefined;
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values({
      ...contact,
      status: "unread",
      createdAt: new Date()
    }).returning();
    return newContact;
  }

  async updateContactStatus(id: string, status: string): Promise<Contact | undefined> {
    const [updatedContact] = await db
      .update(contacts)
      .set({ status })
      .where(eq(contacts.id, id))
      .returning();
    return updatedContact || undefined;
  }

  // Newsletter
  async getNewsletterSubscriptions(): Promise<Newsletter[]> {
    return await db.select().from(newsletter).orderBy(desc(newsletter.createdAt));
  }

  async createNewsletterSubscription(subscription: InsertNewsletter): Promise<Newsletter> {
    const [newSubscription] = await db.insert(newsletter).values({
      ...subscription,
      status: "subscribed",
      createdAt: new Date()
    }).returning();
    return newSubscription;
  }

  async updateNewsletterStatus(email: string, status: string): Promise<Newsletter | undefined> {
    const [updatedSubscription] = await db
      .update(newsletter)
      .set({ status })
      .where(eq(newsletter.email, email))
      .returning();
    return updatedSubscription || undefined;
  }
}

export const storage = new DatabaseStorage();
