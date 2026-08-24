import { prisma } from '../src/config/prisma.config';
import { createStore, updateStore, deleteStore } from '../src/controllers/store.controller';
import { createProduct, getStoreProducts, getProductById, updateProduct, deleteProduct } from '../src/controllers/product.controller';
import { Response } from 'express';

async function runTests() {
  console.log('🧪 Starting Day 11 Store & Product CRUD checks...\n');

  // Load a test owner (SELLER) user from seeded database
  const seller = await prisma.user.findUnique({ where: { email: 'owner@techworld.com' } });
  if (!seller) {
    console.error('❌ Test seller not found. Please make sure database is seeded!');
    return;
  }

  // Helper to generate mock Response object
  function createMockResponse() {
    const res: any = {
      statusCode: 200,
      body: null,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        this.body = data;
        return this;
      }
    };
    return res;
  }

  let createdStoreId: number | null = null;
  let createdCategoryId: number | null = null;
  let createdProductId: number | null = null;

  // =================================================================
  // TEST 1: CREATE STORE & ENFORCE AUTO-OWNER ASSIGNMENT
  // =================================================================
  console.log('--- Test 1: Create Store & Auto-Owner Assignment ---');
  
  const uniqueSlug = `test-store-${Date.now()}`;
  const req1 = {
    user: seller,
    body: {
      name: 'Dynamic Test Store',
      slug: uniqueSlug,
      description: 'A temporary store created during automation testing.',
    }
  } as any;

  const res1 = createMockResponse();
  await createStore(req1, res1);

  console.log(`Status Code: ${res1.statusCode}`);
  
  if (res1.statusCode === 201 && res1.body?.store) {
    createdStoreId = res1.body.store.id;
    console.log(`✅ Store Created! ID: ${createdStoreId}`);
    
    // Validate members relation inside database
    const ownerMember = res1.body.store.members.find((m: any) => m.userId === seller.id);
    if (ownerMember && ownerMember.role === 'OWNER') {
      console.log('✅ Auto-Owner Assignment Verified! User was added as OWNER.\n');
    } else {
      console.log('❌ Auto-Owner Assignment Failed!\n');
    }
  } else {
    console.log('❌ Test 1 Failed! Response:', res1.body);
    return;
  }

  // =================================================================
  // TEST 2: UPDATE STORE DETAILS
  // =================================================================
  console.log('--- Test 2: Update Store Details ---');
  
  const req2 = {
    user: seller,
    params: { storeId: String(createdStoreId) },
    body: {
      name: 'Modified Test Store Name',
      description: 'Updated store description.',
    }
  } as any;

  const res2 = createMockResponse();
  await updateStore(req2, res2);

  console.log(`Status Code: ${res2.statusCode}`);
  if (res2.statusCode === 200 && res2.body?.store?.name === 'Modified Test Store Name') {
    console.log('✅ Store details updated successfully.\n');
  } else {
    console.log('❌ Test 2 Failed! Response:', res2.body);
  }

  // =================================================================
  // PREPARATION: Create a Category under the new Store
  // =================================================================
  console.log('--- Preparation: Adding Category for Scoping Products ---');
  const tempCategory = await prisma.category.create({
    data: {
      storeId: createdStoreId!,
      name: 'Electronics Test',
      slug: `electronics-test-${Date.now()}`,
      description: 'Category for product catalog CRUD validation.',
    }
  });
  createdCategoryId = tempCategory.id;
  console.log(`✅ Category Created! ID: ${createdCategoryId}\n`);

  // =================================================================
  // TEST 3: CREATE PRODUCT WITH SCORING CONSTRAINTS
  // =================================================================
  console.log('--- Test 3: Create Product inside Store ---');

  const productSlug = `test-gadget-${Date.now()}`;
  const req3 = {
    params: { storeId: String(createdStoreId) },
    body: {
      name: 'Super Gadget V1',
      slug: productSlug,
      description: 'A revolutionary portable smart accessory.',
      price: '199.99',
      stock: 25,
      categoryId: createdCategoryId,
    }
  } as any;

  const res3 = createMockResponse();
  await createProduct(req3, res3);

  console.log(`Status Code: ${res3.statusCode}`);
  if (res3.statusCode === 201 && res3.body?.product) {
    createdProductId = res3.body.product.id;
    console.log(`✅ Product Created! ID: ${createdProductId}\n`);
  } else {
    console.log('❌ Test 3 Failed! Response:', res3.body);
  }

  // =================================================================
  // TEST 4: RETRIEVE STORE PRODUCTS
  // =================================================================
  console.log('--- Test 4: Retrieve Store Products (Public) ---');

  const req4 = {
    params: { storeId: String(createdStoreId) }
  } as any;

  const res4 = createMockResponse();
  await getStoreProducts(req4, res4);

  console.log(`Status Code: ${res4.statusCode}`);
  if (res4.statusCode === 200 && res4.body?.results > 0) {
    console.log(`✅ Store products retrieved! Count: ${res4.body.results}\n`);
  } else {
    console.log('❌ Test 4 Failed! Response:', res4.body);
  }

  // =================================================================
  // TEST 5: GET SINGLE PRODUCT DETAILS
  // =================================================================
  console.log('--- Test 5: Get Product Details by ID (Public) ---');

  const req5 = {
    params: { id: String(createdProductId) }
  } as any;

  const res5 = createMockResponse();
  await getProductById(req5, res5);

  console.log(`Status Code: ${res5.statusCode}`);
  if (res5.statusCode === 200 && res5.body?.product?.name === 'Super Gadget V1') {
    console.log('✅ Product details fetched successfully.\n');
  } else {
    console.log('❌ Test 5 Failed! Response:', res5.body);
  }

  // =================================================================
  // TEST 6: UPDATE PRODUCT STOCK & DESCRIPTION
  // =================================================================
  console.log('--- Test 6: Update Product stock count ---');

  const req6 = {
    params: { storeId: String(createdStoreId), id: String(createdProductId) },
    body: {
      stock: 120, // Increase stock
      description: 'An updated, longer description for testing purposes.',
    }
  } as any;

  const res6 = createMockResponse();
  await updateProduct(req6, res6);

  console.log(`Status Code: ${res6.statusCode}`);
  if (res6.statusCode === 200 && res6.body?.product?.stock === 120) {
    console.log('✅ Product details updated successfully (Stock verified).\n');
  } else {
    console.log('❌ Test 6 Failed! Response:', res6.body);
  }

  // =================================================================
  // CLEANUP: DELETE PRODUCT & STORE
  // =================================================================
  console.log('--- Cleanup: Delete Product and Store ---');

  const reqDelProd = {
    params: { storeId: String(createdStoreId), id: String(createdProductId) }
  } as any;
  const resDelProd = createMockResponse();
  await deleteProduct(reqDelProd, resDelProd);

  const reqDelStore = {
    params: { storeId: String(createdStoreId) }
  } as any;
  const resDelStore = createMockResponse();
  await deleteStore(reqDelStore, resDelStore);

  console.log(`Delete Product status: ${resDelProd.statusCode}`);
  console.log(`Delete Store status: ${resDelStore.statusCode}`);

  if (resDelProd.statusCode === 200 && resDelStore.statusCode === 200) {
    console.log('✅ Cleanup completed! Database test records removed cleanly.\n');
  } else {
    console.log('❌ Cleanup failed!\n');
  }
}

runTests()
  .catch(err => console.error('❌ Tests crashed:', err))
  .finally(async () => await prisma.$disconnect());
