import { PrismaClient, Role, StoreRole, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing tables
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.relatedProduct.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.storeMember.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned existing database records.');

  // Pre-hash passwords for seed users
  const adminHash = await bcrypt.hash('adminpassword123', 12);
  const sellerHash = await bcrypt.hash('sellerpassword123', 12);
  const staffHash = await bcrypt.hash('staffpassword123', 12);
  const customerHash = await bcrypt.hash('customerpassword123', 12);

  // ==========================================
  // 👥 CREATE USERS & PROFILES
  // ==========================================

  // Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@platform.com',
      password: adminHash,
      role: Role.ADMIN,
      profile: {
        create: {
          firstName: 'Super',
          lastName: 'Admin',
          street: '100 Platform Way',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94103',
          country: 'USA',
        },
      },
    },
  });

  // Store Owners
  const seller1 = await prisma.user.create({
    data: {
      email: 'owner@techworld.com',
      password: sellerHash,
      role: Role.SELLER,
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          street: '42 Silicon Boulevard',
          city: 'San Jose',
          state: 'CA',
          postalCode: '95112',
          country: 'USA',
        },
      },
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      email: 'owner@fashionhub.com',
      password: sellerHash,
      role: Role.SELLER,
      profile: {
        create: {
          firstName: 'Jane',
          lastName: 'Smith',
          street: '88 Fashion Avenue',
          city: 'New York',
          state: 'NY',
          postalCode: '10018',
          country: 'USA',
        },
      },
    },
  });

  // Store Staff
  const staff1 = await prisma.user.create({
    data: {
      email: 'staff@techworld.com',
      password: staffHash,
      role: Role.SELLER,
      profile: {
        create: {
          firstName: 'David',
          lastName: 'Lee',
          street: '12 Computer Street',
          city: 'San Jose',
          state: 'CA',
          postalCode: '95113',
          country: 'USA',
        },
      },
    },
  });

  // Customers
  const customer1 = await prisma.user.create({
    data: {
      email: 'buyer1@gmail.com',
      password: customerHash,
      role: Role.CUSTOMER,
      profile: {
        create: {
          firstName: 'Alice',
          lastName: 'Wonderland',
          street: '77 Wonderland Lane',
          city: 'Seattle',
          state: 'WA',
          postalCode: '98101',
          country: 'USA',
        },
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'buyer2@gmail.com',
      password: customerHash,
      role: Role.CUSTOMER,
      profile: {
        create: {
          firstName: 'Bob',
          lastName: 'Builder',
          street: '123 Construction Road',
          city: 'Austin',
          state: 'TX',
          postalCode: '78701',
          country: 'USA',
        },
      },
    },
  });

  console.log('👥 Created 6 users with profiles.');

  // ==========================================
  // 🏢 CREATE STORES & MEMBERSHIPS
  // ==========================================

  // TechWorld Store
  const techStore = await prisma.store.create({
    data: {
      name: 'TechWorld Store',
      slug: 'techworld',
      description: 'Your one-stop shop for premium gadgets, computers, and electronics.',
      ownerId: seller1.id,
    },
  });

  // FashionHub Store
  const fashionStore = await prisma.store.create({
    data: {
      name: 'FashionHub Store',
      slug: 'fashionhub',
      description: 'Latest trends in apparel, shoes, and modern designer fashion.',
      ownerId: seller2.id,
    },
  });

  // Dynamic Store (unused placeholder for Day 07 validation)
  const emptyStore = await prisma.store.create({
    data: {
      name: 'Fresh Grocers',
      slug: 'fresh-grocers',
      description: 'Organic groceries delivered fresh from local farms.',
      ownerId: seller1.id, // Owned by same user as techworld (multi-store ownership demonstration)
    },
  });

  // Store Memberships
  await prisma.storeMember.createMany({
    data: [
      { storeId: techStore.id, userId: seller1.id, role: StoreRole.OWNER },
      { storeId: techStore.id, userId: staff1.id, role: StoreRole.STAFF },
      { storeId: fashionStore.id, userId: seller2.id, role: StoreRole.OWNER },
      { storeId: emptyStore.id, userId: seller1.id, role: StoreRole.OWNER },
    ],
  });

  console.log('🏢 Created 3 stores and established memberships.');

  // ==========================================
  // 📂 CREATE CATEGORIES (WITH NESTING)
  // ==========================================

  // TechWorld Categories (Electronics -> Laptops, Accessories -> Cables)
  const catElectronics = await prisma.category.create({
    data: {
      storeId: techStore.id,
      name: 'Electronics',
      slug: 'electronics',
      description: 'All kinds of hardware and consumer electronics',
    },
  });

  const catLaptops = await prisma.category.create({
    data: {
      storeId: techStore.id,
      name: 'Laptops',
      slug: 'laptops',
      parentId: catElectronics.id,
      description: 'Ultrabooks, gaming notebooks, and work laptops',
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      storeId: techStore.id,
      name: 'Accessories',
      slug: 'accessories',
      description: 'Tech accessories and gadgets',
    },
  });

  const catCables = await prisma.category.create({
    data: {
      storeId: techStore.id,
      name: 'Cables',
      slug: 'cables',
      parentId: catAccessories.id,
      description: 'USB, HDMI, and lightning power cords',
    },
  });

  // FashionHub Categories (Apparel -> Menswear, Apparel -> Womenswear)
  const catApparel = await prisma.category.create({
    data: {
      storeId: fashionStore.id,
      name: 'Apparel',
      slug: 'apparel',
      description: 'Designer fashion clothes and apparel',
    },
  });

  const catMenswear = await prisma.category.create({
    data: {
      storeId: fashionStore.id,
      name: 'Menswear',
      slug: 'menswear',
      parentId: catApparel.id,
      description: 'Men jackets, shirts, jeans, and formal wear',
    },
  });

  const catWomenswear = await prisma.category.create({
    data: {
      storeId: fashionStore.id,
      name: 'Womenswear',
      slug: 'womenswear',
      parentId: catApparel.id,
      description: 'Women dresses, coats, skirts, and designer wear',
    },
  });

  console.log('📁 Created nested Category structures per store.');

  // ==========================================
  // 📦 CREATE PRODUCTS
  // ==========================================

  // TechStore Products
  const prodMacBook = await prisma.product.create({
    data: {
      storeId: techStore.id,
      categoryId: catLaptops.id,
      name: 'MacBook Pro 16-inch M3',
      slug: 'macbook-pro-16-m3',
      description: 'The ultimate pro laptop. Powered by M3 Max chip with 36GB unified memory.',
      price: 2499.99,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8'],
    },
  });

  const prodDellXPS = await prisma.product.create({
    data: {
      storeId: techStore.id,
      categoryId: catLaptops.id,
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description: 'Premium developer laptop. Intel Core i9, 32GB RAM, 1TB SSD, RTX 4060.',
      price: 1899.99,
      stock: 8,
      images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45'],
    },
  });

  const prodMouse = await prisma.product.create({
    data: {
      storeId: techStore.id,
      categoryId: catAccessories.id,
      name: 'MX Master 3S Wireless Mouse',
      slug: 'mx-master-3s',
      description: 'Ergonomic office mouse with silent clicks and 8K DPI tracking.',
      price: 99.99,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7'],
    },
  });

  const prodHdmiCable = await prisma.product.create({
    data: {
      storeId: techStore.id,
      categoryId: catCables.id,
      name: 'Premium High-Speed HDMI Cable 2.1',
      slug: 'high-speed-hdmi-cable-21',
      description: '8K @ 60Hz high-definition braided cable with gold-plated connectors.',
      price: 19.99,
      stock: 120,
      images: ['https://images.unsplash.com/photo-1557853197-aefb550b6fdc'],
    },
  });

  // FashionStore Products
  const prodLeatherJacket = await prisma.product.create({
    data: {
      storeId: fashionStore.id,
      categoryId: catMenswear.id,
      name: 'Classic Leather Bomber Jacket',
      slug: 'classic-leather-bomber-jacket',
      description: 'Handcrafted premium lambskin leather jacket with soft lining.',
      price: 299.99,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5'],
    },
  });

  const prodSilkDress = await prisma.product.create({
    data: {
      storeId: fashionStore.id,
      categoryId: catWomenswear.id,
      name: 'Silk Maxi Evening Gown',
      slug: 'silk-maxi-evening-gown',
      description: 'Elegant flowy silk evening dress in cobalt blue.',
      price: 189.99,
      stock: 12,
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8'],
    },
  });

  console.log('📦 Created 6 products.');

  // ==========================================
  // 🔗 CREATE RELATED PRODUCTS (BUNDLES)
  // ==========================================

  // MacBook Pro has related products: MX Master Mouse and HDMI Cable
  await prisma.relatedProduct.createMany({
    data: [
      { productId: prodMacBook.id, relatedId: prodMouse.id },
      { productId: prodMacBook.id, relatedId: prodHdmiCable.id },
      { productId: prodDellXPS.id, relatedId: prodMouse.id },
    ],
  });

  console.log('🔗 Created self-referential Related Products connections.');

  // ==========================================
  // 💬 CREATE REVIEWS
  // ==========================================

  await prisma.review.createMany({
    data: [
      { productId: prodMacBook.id, userId: customer1.id, rating: 5, comment: 'Phenomenal machine. Best laptop I have ever owned!' },
      { productId: prodMacBook.id, userId: customer2.id, rating: 4, comment: 'Great screen and speed, but very heavy.' },
      { productId: prodMouse.id, userId: customer1.id, rating: 5, comment: 'Extremely comfortable for long work hours.' },
      { productId: prodLeatherJacket.id, userId: customer2.id, rating: 5, comment: 'Perfect fit, high quality leather. Highly recommend!' },
    ],
  });

  console.log('💬 Seeded initial product reviews.');

  // ==========================================
  // 🛒 CREATE SHOPPING CARTS
  // ==========================================

  // Customer 1 has MacBook Pro and Mouse in cart
  await prisma.cartItem.createMany({
    data: [
      { userId: customer1.id, productId: prodMacBook.id, quantity: 1 },
      { userId: customer1.id, productId: prodMouse.id, quantity: 1 },
    ],
  });

  // Customer 2 has Silk Dress in cart
  await prisma.cartItem.createMany({
    data: [
      { userId: customer2.id, productId: prodSilkDress.id, quantity: 2 },
    ],
  });

  console.log('🛒 Seeded active user shopping cart items.');

  // ==========================================
  // 🧾 CREATE TEST ORDERS & SEQUENCES
  // ==========================================

  // TechStore Order #1
  const orderTech1 = await prisma.order.create({
    data: {
      storeId: techStore.id,
      userId: customer1.id,
      totalAmount: 2599.98,
      status: OrderStatus.PAID,
      orderNumber: 1, // Store-scoped order sequence #1
      orderItems: {
        createMany: {
          data: [
            { productId: prodMacBook.id, quantity: 1, priceAtPurchase: 2499.99 },
            { productId: prodMouse.id, quantity: 1, priceAtPurchase: 99.99 },
          ],
        },
      },
    },
  });

  // TechStore Order #2
  const orderTech2 = await prisma.order.create({
    data: {
      storeId: techStore.id,
      userId: customer2.id,
      totalAmount: 1899.99,
      status: OrderStatus.SHIPPED,
      orderNumber: 2, // Store-scoped order sequence #2
      orderItems: {
        createMany: {
          data: [
            { productId: prodDellXPS.id, quantity: 1, priceAtPurchase: 1899.99 },
          ],
        },
      },
    },
  });

  // FashionStore Order #1
  const orderFashion1 = await prisma.order.create({
    data: {
      storeId: fashionStore.id,
      userId: customer2.id,
      totalAmount: 299.99,
      status: OrderStatus.PAID,
      orderNumber: 1, // Store-scoped order sequence #1 (different store!)
      orderItems: {
        createMany: {
          data: [
            { productId: prodLeatherJacket.id, quantity: 1, priceAtPurchase: 299.99 },
          ],
        },
      },
    },
  });

  console.log('🧾 Seeded historical checkouts with store-scoped order sequences.');
  console.log('🚀 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
