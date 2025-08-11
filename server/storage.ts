import { type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder, type Contact, type InsertContact, type Newsletter, type InsertNewsletter } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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

  // Newsletter
  getNewsletterSubscriptions(): Promise<Newsletter[]>;
  createNewsletterSubscription(subscription: InsertNewsletter): Promise<Newsletter>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private contacts: Map<string, Contact>;
  private newsletter: Map<string, Newsletter>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.contacts = new Map();
    this.newsletter = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      email: "admin@mridulota.com",
      password: "admin123",
      role: "admin"
    };
    this.users.set(adminUser.id, adminUser);

    // Create sample products
    const sampleProducts: Product[] = [
      {
        id: randomUUID(),
        name: "Neem Purifying Soap",
        namebengali: "নিম সাবান",
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
        namebengali: "হলুদ সাবান",
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
        namebengali: "অ্যালোভেরা সাবান",
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
        namebengali: "ল্যাভেন্ডার সাবান",
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
        namebergali: "কফি স্ক্রাব",
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
        namebergali: "নারকেল তেল",
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

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
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
      createdAt: new Date() 
    };
    this.newsletter.set(id, subscription);
    return subscription;
  }
}

export const storage = new MemStorage();
