import { prisma } from '../src/config/prisma.config';

const API_URL = 'http://localhost:5000/api/v1';

async function verifyDay12() {
  console.log('🚀 Starting Day 12 Automated Verification Script...');

  try {
    // 1. Setup Test User & Store
    console.log('📦 Step 1: Setting up mock User, Store, and Category Tree...');

    const user = await prisma.user.create({
      data: {
        email: `day12_seller_${Date.now()}@test.com`,
        password: 'hashedpassword123',
        role: 'SELLER',
        profile: {
          create: {
            firstName: 'Day12',
            lastName: 'Seller',
            street: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            postalCode: '12345',
            country: 'Test Country',
          },
        },
      },
    });

    const store = await prisma.store.create({
      data: {
        name: `Day 12 Store ${Date.now()}`,
        slug: `day12-store-${Date.now()}`,
        description: 'Store for Day 12 testing',
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'OWNER',
          },
        },
      },
    });

    // 2. Setup Nested Category Tree (Electronics -> Audio -> Headphones)
    const parentCategory = await prisma.category.create({
      data: {
        storeId: store.id,
        name: 'Electronics',
        slug: 'electronics',
      },
    });

    const childCategory = await prisma.category.create({
      data: {
        storeId: store.id,
        name: 'Audio',
        slug: 'audio',
        parentId: parentCategory.id,
      },
    });

    const grandchildCategory = await prisma.category.create({
      data: {
        storeId: store.id,
        name: 'Headphones',
        slug: 'headphones',
        parentId: childCategory.id,
      },
    });

    // 3. Create Seed Products across categories with different prices and stock levels
    console.log('🛒 Step 2: Creating mock products across category tree levels...');

    await prisma.product.create({
      data: {
        storeId: store.id,
        name: 'Wireless Bluetooth Headset',
        slug: 'wireless-headset',
        description: 'Noise cancelling over-ear headphones',
        price: '150.00',
        stock: 10,
        categoryId: grandchildCategory.id, // Deepest nested category
      },
    });

    await prisma.product.create({
      data: {
        storeId: store.id,
        name: 'Studio Monitor Speaker',
        slug: 'studio-speaker',
        description: 'High fidelity audio speaker',
        price: '299.99',
        stock: 5,
        categoryId: childCategory.id,
      },
    });

    await prisma.product.create({
      data: {
        storeId: store.id,
        name: '4K Smart LED TV',
        slug: 'smart-tv',
        description: 'Ultra HD television screen',
        price: '899.00',
        stock: 0, // Out of stock
        categoryId: parentCategory.id,
      },
    });

    // 4. Test Category Tree Descendant Recursion
    console.log('🔍 Step 3: Testing Category Tree Recursive Filtering...');
    const catRes = await fetch(`${API_URL}/stores/${store.id}/products?categoryId=${parentCategory.id}`);
    const catData: any = await catRes.json();

    console.log(`   - Querying Parent Category 'Electronics' (ID: ${parentCategory.id})...`);
    console.log(`   - Expected: 3 products (including child & grandchild categories).`);
    console.log(`   - Received: ${catData.results} products.`);

    if (catData.results !== 3) {
      throw new Error(`Category Tree recursion failed! Expected 3 products, got ${catData.results}`);
    }
    console.log('   ✅ Recursive Category Tree filtering PASSED!');

    // 5. Test Price Range & Stock Status Filtering
    console.log('💰 Step 4: Testing Price Range & Stock Status Filters...');
    const filterRes = await fetch(
      `${API_URL}/stores/${store.id}/products?minPrice=100&maxPrice=500&stockStatus=in-stock`
    );
    const filterData: any = await filterRes.json();

    console.log(`   - Querying minPrice=100 & maxPrice=500 & stockStatus=in-stock...`);
    console.log(`   - Received: ${filterData.results} products.`);

    if (filterData.results !== 2) {
      throw new Error(`Price & Stock filtering failed! Expected 2 in-stock items, got ${filterData.results}`);
    }
    console.log('   ✅ Price & Stock filtering PASSED!');

    // 6. Test Sorting and Pagination
    console.log('📊 Step 5: Testing Sorting & Offset Pagination...');
    const pageRes = await fetch(
      `${API_URL}/stores/${store.id}/products?page=1&limit=2&sortBy=price_asc`
    );
    const pageData: any = await pageRes.json();

    console.log(`   - Querying page=1, limit=2, sortBy=price_asc...`);
    console.log(`   - Total Count: ${pageData.pagination.total}`);
    console.log(`   - Total Pages: ${pageData.pagination.totalPages}`);
    console.log(`   - First Item Price: $${pageData.products[0].price}`);

    if (
      pageData.products.length !== 2 ||
      Number(pageData.products[0].price) !== 150
    ) {
      throw new Error('Sorting or pagination failed!');
    }
    console.log('   ✅ Sorting & Pagination PASSED!');

    // 7. Test Global Catalog Search
    console.log('🌐 Step 6: Testing Global Product Catalog Search...');
    const globalRes = await fetch(`${API_URL}/products?search=headset`);
    const globalData: any = await globalRes.json();

    console.log(`   - Global Search Query: search=headset`);
    console.log(`   - Received: ${globalData.results} matching products.`);

    if (globalData.results !== 1) {
      throw new Error('Global search failed!');
    }
    console.log('   ✅ Global Search PASSED!');

    // 8. Cleanup Database
    console.log('🧹 Step 7: Cleaning up mock verification data...');
    await prisma.product.deleteMany({ where: { storeId: store.id } });
    await prisma.category.deleteMany({ where: { storeId: store.id } });
    await prisma.storeMember.deleteMany({ where: { storeId: store.id } });
    await prisma.store.delete({ where: { id: store.id } });
    await prisma.profile.delete({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });

    console.log('\n🎉 ALL DAY 12 VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (error: any) {
    console.error('\n❌ Verification Failed:', error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDay12();
