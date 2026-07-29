import { PrismaClient } from '@prisma/client';
import { generateAccessToken, generateRefreshToken } from '../src/utils/jwt';
import { comparePassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function runTests() {
  console.log('🧪 Starting Day 09 JWT & Token Rotation checks...\n');

  const user = await prisma.user.findUnique({
    where: { email: 'buyer1@gmail.com' }
  });

  if (!user) {
    console.error('❌ Test User buyer1@gmail.com not found. Run migrations and seed first!');
    return;
  }

  // =================================================================
  // TEST 1: GENERATE TOKEN PAIR & REGISTER SESSION
  // =================================================================
  console.log('--- Test 1: Simulating Login and Token Generation ---');
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  console.log(`Generated Access Token length: ${accessToken.length}`);
  console.log(`Generated Refresh Token length: ${refreshToken.length}`);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const savedToken = await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt
    }
  });

  console.log(`Saved Refresh Token ID in DB: ${savedToken.id}`);
  if (savedToken && accessToken.length > 0) {
    console.log('✅ Test 1 Passed! Login tokens created and session registered in DB.\n');
  } else {
    console.log('❌ Test 1 Failed!\n');
  }

  // =================================================================
  // TEST 2: SIMULATE REFRESH & ROTATE TOKEN
  // =================================================================
  console.log('--- Test 2: Simulating Token Rotation (Refresh) ---');

  const activeToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken }
  });

  if (activeToken) {
    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.delete({ where: { id: activeToken.id } });
    const rotatedToken = await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt
      }
    });

    console.log(`Rotated old token ID: ${activeToken.id}`);
    console.log(`Created new token ID in DB: ${rotatedToken.id}`);

    const oldLookup = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });
    console.log('oldLookup result:', oldLookup);

    if (!oldLookup && rotatedToken) {
      console.log('✅ Test 2 Passed! Token successfully rotated (old deleted, new generated).\n');
    } else {
      console.log('❌ Test 2 Failed!\n');
    }
  } else {
    console.log('❌ Test 2 Failed: Active token not found.\n');
  }

  // =================================================================
  // TEST 3: REUSE DETECTION & SECURITY REVOCATION
  // =================================================================
  //   console.log('--- Test 3: Verifying Security Reuse Detection ---');

  //   const staleTokenLookup = await prisma.refreshToken.findUnique({
  //     where: { token: refreshToken }
  //   });

  //   if (!staleTokenLookup) {
  //     console.log('Detected reuse of a stale token! Triggering account security lock...');

  //     await prisma.refreshToken.deleteMany({
  //       where: { userId: user.id }
  //     });

  //     const activeSessions = await prisma.refreshToken.findMany({
  //       where: { userId: user.id }
  //     });

  //     console.log(`Remaining active sessions for User: ${activeSessions.length}`);
  //     if (activeSessions.length === 0) {
  //       console.log('✅ Test 3 Passed! Stale token usage detected and all user sessions revoked.\n');
  //     } else {
  //       console.log('❌ Test 3 Failed! Failed to revoke user sessions.\n');
  //     }
  //   } else {
  //     console.log('❌ Test 3 Failed! Stale token was not deleted during rotation.\n');
  //   }
  // }

} // Closes async function runTests()

runTests()
  .catch(err => console.error('❌ Tests crashed:', err))
  .finally(async () => await prisma.$disconnect());
