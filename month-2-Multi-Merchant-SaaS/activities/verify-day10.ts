import { prisma } from '../src/config/prisma.config';
import { authorizePlatformRoles, authorizeStoreRoles, AuthenticatedRequest } from '../src/middlewares/auth.middleware';
import { Response, NextFunction } from 'express';

async function runTests() {
  console.log('🧪 Starting Day 10 Tenant-Level RBAC checks...\n');

  // Load target test users from seeded database
  const customer = await prisma.user.findUnique({ where: { email: 'buyer1@gmail.com' } });
  const staff = await prisma.user.findUnique({ where: { email: 'staff@techworld.com' } });
  const owner = await prisma.user.findUnique({ where: { email: 'owner@techworld.com' } });

  if (!customer || !staff || !owner) {
    console.error('❌ Test users not found. Please make sure database is migrated and seeded!');
    return;
  }

  // Get a target store ID (from seed, TechWorld Store is Store 1)
  const store = await prisma.store.findFirst({ where: { name: 'TechWorld Store' } });
  if (!store) {
    console.error('❌ Store "TechWorld Store" not found. Run seed first!');
    return;
  }
  const storeId = store.id;

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

  // =================================================================
  // TEST 1: PLATFORM-LEVEL ROLE BLOCKED (CUSTOMER ACCESSES ADMIN ROUTE)
  // =================================================================
  console.log('--- Test 1: Platform-Level RBAC (Customer accessing Admin-only) ---');
  
  const req1 = {
    user: customer
  } as any;
  
  const res1 = createMockResponse();
  let nextCalled1 = false;

  // Run platform authorize middleware
  const adminGuard = authorizePlatformRoles('ADMIN');
  adminGuard(req1, res1, () => { nextCalled1 = true; });

  console.log(`Status Code returned: ${res1.statusCode}`);
  console.log(`Response message: ${res1.body?.message}`);
  
  if (res1.statusCode === 403 && !nextCalled1) {
    console.log('✅ Test 1 Passed! Customer was successfully blocked from Admin route.\n');
  } else {
    console.log('❌ Test 1 Failed!\n');
  }

  // =================================================================
  // TEST 2: TENANT-LEVEL ROLE BLOCKED (CUSTOMER IS NOT MEMBER OF STORE)
  // =================================================================
  console.log('--- Test 2: Tenant-Level RBAC (Non-member accessing Store-only) ---');

  const req2 = {
    user: customer,
    params: { storeId: String(storeId) }
  } as any;

  const res2 = createMockResponse();
  let nextCalled2 = false;

  // Run store authorize middleware for OWNER or ADMIN
  const storeGuard = authorizeStoreRoles('OWNER', 'ADMIN');
  await storeGuard(req2, res2, () => { nextCalled2 = true; });

  console.log(`Status Code returned: ${res2.statusCode}`);
  console.log(`Response message: ${res2.body?.message}`);

  if (res2.statusCode === 403 && !nextCalled2) {
    console.log('✅ Test 2 Passed! Non-member was successfully blocked from accessing Store.\n');
  } else {
    console.log('❌ Test 2 Failed!\n');
  }

  // =================================================================
  // TEST 3: TENANT-LEVEL ROLE SUFFICIENT (STAFF ACCESSING STAFF ALLOWED ROUTE)
  // =================================================================
  console.log('--- Test 3: Tenant-Level RBAC (Staff member accessing Staff-allowed route) ---');

  const req3 = {
    user: staff,
    params: { storeId: String(storeId) }
  } as any;

  const res3 = createMockResponse();
  let nextCalled3 = false;

  // Allow OWNER, ADMIN, or STAFF
  const staffAllowedGuard = authorizeStoreRoles('OWNER', 'ADMIN', 'STAFF');
  await staffAllowedGuard(req3, res3, () => { nextCalled3 = true; });

  console.log(`Status Code returned: ${res3.statusCode}`);
  console.log(`Next function called: ${nextCalled3}`);

  if (res3.statusCode === 200 && nextCalled3) {
    console.log('✅ Test 3 Passed! Staff member was successfully authorized.\n');
  } else {
    console.log('❌ Test 3 Failed!\n');
  }

  // =================================================================
  // TEST 4: TENANT-LEVEL ROLE INSUFFICIENT (STAFF ACCESSING OWNER-ONLY ROUTE)
  // =================================================================
  console.log('--- Test 4: Tenant-Level RBAC (Staff accessing Owner-only route) ---');

  const req4 = {
    user: staff,
    params: { storeId: String(storeId) }
  } as any;

  const res4 = createMockResponse();
  let nextCalled4 = false;

  // Require OWNER only
  const ownerOnlyGuard = authorizeStoreRoles('OWNER');
  await ownerOnlyGuard(req4, res4, () => { nextCalled4 = true; });

  console.log(`Status Code returned: ${res4.statusCode}`);
  console.log(`Response message: ${res4.body?.message}`);

  if (res4.statusCode === 403 && !nextCalled4) {
    console.log('✅ Test 4 Passed! Staff was successfully blocked from Owner-only route.\n');
  } else {
    console.log('❌ Test 4 Failed!\n');
  }

  // =================================================================
  // TEST 5: TENANT-LEVEL ROLE SUFFICIENT (OWNER ACCESSING OWNER-ONLY ROUTE)
  // =================================================================
  console.log('--- Test 5: Tenant-Level RBAC (Owner accessing Owner-only route) ---');

  const req5 = {
    user: owner,
    params: { storeId: String(storeId) }
  } as any;

  const res5 = createMockResponse();
  let nextCalled5 = false;

  // Require OWNER
  await ownerOnlyGuard(req5, res5, () => { nextCalled5 = true; });

  console.log(`Status Code returned: ${res5.statusCode}`);
  console.log(`Next function called: ${nextCalled5}`);

  if (res5.statusCode === 200 && nextCalled5) {
    console.log('✅ Test 5 Passed! Store Owner was successfully authorized.\n');
  } else {
    console.log('❌ Test 5 Failed!\n');
  }
}

runTests()
  .catch(err => console.error('❌ Tests crashed:', err))
  .finally(async () => await prisma.$disconnect());

