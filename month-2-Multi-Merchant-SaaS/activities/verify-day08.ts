import { PrismaClient } from '@prisma/client';
import { env } from '../src/config/env';
import { comparePassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function runTests() {
  console.log('🧪 Starting Day 08 security checks...\n');

  // =================================================================
  // TEST 1: ZOD TYPE CASTING VERIFICATION
  // =================================================================
  console.log('--- Test 1: Verifying Zod Type Casting ---');
  console.log(`Port value: ${env.PORT}`);
  console.log(`Port data type: ${typeof env.PORT}`);

  if (typeof env.PORT === 'number') {
    console.log('✅ Test 1 Passed! env.PORT was successfully cast to a number.\n');
  } else {
    console.log('❌ Test 1 Failed! env.PORT is still a string.\n');
  }

  // =================================================================
  // TEST 2: BCRYPT HASH SIGNATURE VERIFICATION
  // =================================================================
  console.log('--- Test 2: Verifying Password Hash Signature ---');
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@platform.com' }
  });

  if (adminUser) {
    const passwordHash = adminUser.password;
    console.log(`Loaded password string: "${passwordHash}"`);
    console.log(`Hash length: ${passwordHash.length} characters`);
    
    const hasCorrectSignature = passwordHash.startsWith('$2a$') || passwordHash.startsWith('$2b$');
    const hasCorrectLength = passwordHash.length === 60;

    if (hasCorrectSignature && hasCorrectLength) {
      console.log('✅ Test 2 Passed! Database contains a secure 60-character bcrypt hash signature.\n');
    } else {
      console.log('❌ Test 2 Failed! The password is not correctly hashed.\n');
    }

    // =================================================================
    // TEST 3: PASSWORD COMPARISON LOGIC
    // =================================================================
    console.log('--- Test 3: Verifying Password Comparison ---');
    const isPasswordCorrect = await comparePassword('adminpassword123', passwordHash);
    console.log(`Password match result: ${isPasswordCorrect}`);

    if (isPasswordCorrect) {
      console.log('✅ Test 3 Passed! The plain text password matches the database hash.\n');
    } else {
      console.log('❌ Test 3 Failed! Comparison function returned incorrect result.\n');
    }
  } else {
    console.log('❌ Tests failed because admin user was not found. Make sure to run seeding first!\n');
  }
}

runTests()
  .catch((err) => console.error('❌ Tests crashed:', err))
  .finally(async () => await prisma.$disconnect());
