import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('🧪 Starting database verification...\n');

  // =================================================================
  // TEST 1: MULTI-TENANCY ISOLATION (STORE COUNT)
  // =================================================================
  console.log('--- Test 1: Verifying Multi-Tenant Store Count ---');
  const stores = await prisma.store.findMany({
    select: { id: true, name: true, slug: true }
  });
  console.log(`Successfully found ${stores.length} stores in database:`);
  stores.forEach(s => console.log(` - [ID: ${s.id}] Store Name: "${s.name}" (Slug: ${s.slug})`));
  console.log(stores.length === 3 ? '✅ Test 1 Passed!\n' : '❌ Test 1 Failed!\n');


  // =================================================================
  // TEST 2: SELF-REFERENTIAL 1:N CATEGORIES (HIERARCHY)
  // =================================================================
  console.log('--- Test 2: Verifying Self-Referential Category Tree ---');
  const laptopCategory = await prisma.category.findFirst({
    where: { name: 'Laptops' },
    include: {
      parent: true
    }
  });

  if (laptopCategory) {
    console.log(`Category: "${laptopCategory.name}"`);
    console.log(`Parent Category ID: ${laptopCategory.parentId}`);
    if (laptopCategory.parent) {
      console.log(`Parent Category Name: "${laptopCategory.parent.name}"`);
      console.log(laptopCategory.parent.name === 'Electronics' ? '✅ Test 2 Passed!\n' : '❌ Test 2 Failed!\n');
    } else {
      console.log('❌ Test 2 Failed: No parent category found!\n');
    }
  } else {
    console.log('❌ Test 2 Failed: "Laptops" category not found!\n');
  }


  // =================================================================
  // TEST 3: SELF-REFERENTIAL N:M PRODUCTS (RECOMMENDATIONS)
  // =================================================================
  console.log('--- Test 3: Verifying Related Product Recommendations ---');
  const macbookProduct = await prisma.product.findFirst({
    where: { name: { contains: 'MacBook' } },
    include: {
      relatedTo: {
        include: {
          relatedProduct: true
        }
      }
    }
  });

  if (macbookProduct) {
    console.log(`Product: "${macbookProduct.name}"`);
    console.log('Related recommendations seeded:');
    macbookProduct.relatedTo.forEach(rel => {
      console.log(` - Recommended Product: "${rel.relatedProduct.name}" ($${rel.relatedProduct.price})`);
    });

    const hasMouse = macbookProduct.relatedTo.some(rel => rel.relatedProduct.name.includes('MX Master'));
    console.log(hasMouse ? '✅ Test 3 Passed!\n' : '❌ Test 3 Failed!\n');
  } else {
    console.log('❌ Test 3 Failed: MacBook not found!\n');
  }


  // =================================================================
  // TEST 4: STORE-SCOPED SEQUENCES
  // =================================================================
  console.log('--- Test 4: Verifying Store-Scoped Order Sequences ---');
  const firstOrders = await prisma.order.findMany({
    where: { orderNumber: 1 },
    include: {
      store: true
    }
  });

  console.log(`Found ${firstOrders.length} orders registered with Order Number #1:`);
  firstOrders.forEach(o => {
    console.log(` - Order ID: ${o.id} belongs to Store: "${o.store.name}" (Total: $${o.totalAmount})`);
  });

  const uniqueStores = new Set(firstOrders.map(o => o.storeId));
  console.log(uniqueStores.size >= 2 ? '✅ Test 4 Passed!\n' : '❌ Test 4 Failed!\n');
}

verify()
  .catch((err) => {
    console.error('❌ Verification script crashed:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
