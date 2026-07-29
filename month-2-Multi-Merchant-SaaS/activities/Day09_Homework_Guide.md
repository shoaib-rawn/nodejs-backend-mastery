# Day 09 Solution Guide: JWT Authentication & Rotation Validation

This guide contains step-by-step instructions and code explanations to complete the Day 09 verification challenge.

---

## Step 1: Create the Verification Script

Create the file [activities/verify-day09.ts](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/verify-day09.ts) and add the following verification logic:

```typescript
import { PrismaClient } from '@prisma/client';
import { generateAccessToken, generateRefreshToken } from '../src/utils/jwt';
import { comparePassword } from '../src/utils/password';
import { prisma as db } from '../src/config/prisma.config';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function runTests() {
  console.log('🧪 Starting Day 09 JWT & Token Rotation checks...\n');

  // Load target test user
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

  // Save the refresh token in the database (simulating controller save)
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
  
  // A. Check token exists in DB
  const activeToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken }
  });

  if (activeToken) {
    // B. Generate new pair
    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    // C. Rotate: Delete old, Insert new
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

    // D. Assert old token is deleted
    const oldLookup = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

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
  console.log('--- Test 3: Verifying Security Reuse Detection ---');
  
  // Simulate attacker attempting to refresh using the OLD, DELETED token
  const staleTokenLookup = await prisma.refreshToken.findUnique({
    where: { token: refreshToken } // The original deleted token
  });

  if (!staleTokenLookup) {
    console.log('Detected reuse of a stale token! Triggering account security lock...');
    
    // Revoke all tokens for this user ID
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id }
    });

    // Verify all sessions are gone
    const activeSessions = await prisma.refreshToken.findMany({
      where: { userId: user.id }
    });

    console.log(`Remaining active sessions for User: ${activeSessions.length}`);
    if (activeSessions.length === 0) {
      console.log('✅ Test 3 Passed! Stale token usage detected and all user sessions revoked.\n');
    } else {
      console.log('❌ Test 3 Failed! Failed to revoke user sessions.\n');
    }
  } else {
    console.log('❌ Test 3 Failed! Stale token was not deleted during rotation.\n');
  }
}

runTests()
  .catch(err => console.error('❌ Tests crashed:', err))
  .finally(async () => await prisma.$disconnect());
```

---

## Code & Logic Explanation

Let's break down the technical validation and rotation mechanics:

### 1. Token Lifespan & Expiration Settings
```typescript
{ expiresIn: '15m' } // Access Token
{ expiresIn: '7d' }  // Refresh Token
```
*   **`expiresIn`**: Instructs the `jsonwebtoken` library to embed an `exp` payload claim. Once that timestamp is passed, any call to `jwt.verify` will automatically fail and throw a `TokenExpiredError`.

### 2. Token Rotation Mechanics
*   **The Rotation Rule:** In a real API, the client makes a request to `/refresh`. The API deletes the used refresh token from the database and returns a brand new refresh token in a cookie.
*   **Why delete the old one?** If you do not delete the used token, an attacker who steals that cookie can refresh it forever. Deleting it on use forces a strict one-use lifecycle.

### 3. Reuse Detection Logic (Test 3)
```typescript
const activeToken = await prisma.refreshToken.findUnique({
  where: { token: refreshToken }
});
if (!activeToken) {
  // Stale token! Wipe everything.
  await prisma.refreshToken.deleteMany({ where: { userId } });
}
```
*   **Automatic Revocation:** If a token signature is valid (meaning it is a real token signed by your secret key) but does **not** exist in the `RefreshToken` table, it means the token was already used and deleted. The database immediately detects this anomalous state and clears all active sessions for that user, neutralizing the stolen token immediately.

---

## Step 2: Run the Verification

Execute the validation script in your terminal:

```bash
npx ts-node activities/verify-day09.ts
```
