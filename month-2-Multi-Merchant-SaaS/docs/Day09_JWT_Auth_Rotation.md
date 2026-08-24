# Day 09: JWT Session Authentication & Token Rotation

Today, we implemented the core security foundation of our SaaS backend: **JSON Web Token (JWT) Authentication** featuring **Access Tokens** and **Refresh Token Rotation**.

---

## 1. How JWT Session Management Works

Unlike traditional sessions where the server stores user states in memory and issues a session ID, **JSON Web Token (JWT)** is a stateless authentication pattern. The user payload is cryptographically signed and stored entirely on the client-side.

A standard JWT has three parts separated by dots:
1.  **Header:** Specifies the algorithm used (e.g. HS256).
2.  **Payload:** Contains user metadata (claims) like `userId` and `role`.
3.  **Signature:** Validates that the token hasn't been altered.

---

## 2. Access Tokens vs. Refresh Tokens

Storing a highly permissive token on the client-side for weeks is dangerous. If stolen, a hacker has permanent access. To balance user experience and security, we use a two-token system:

| Feature | Access Token | Refresh Token |
| :--- | :--- | :--- |
| **Lifespan** | Short (e.g., 15 minutes) | Long (e.g., 7 days) |
| **Transmission** | Authorization Bearer Header | HttpOnly Secure Cookie |
| **Storage** | Memory / Client variables | Database (linked to User) |
| **Purpose** | Authenticates API requests | Generates a new access token |

---

## 3. Refresh Token Rotation (RTR)

**Refresh Token Rotation (RTR)** is a security mechanism where **every time a refresh token is used, it is deleted and a brand new refresh token is issued**. 

This limits the lifespan of any single refresh token and immediately reveals if a token has been stolen.

### What happens during token reuse?
If a refresh token is stolen, both the legitimate user and the attacker will possess copies of the same token. 
1.  If the attacker uses the token first, they get a new pair.
2.  When the legitimate user's client tries to use the same old token to refresh, the server queries the database and sees that the token **no longer exists** (since it was deleted when the attacker used it).
3.  Because the token is cryptographically valid but missing from active database sessions, the server flags **REUSE DETECTED**.
4.  To protect the account, the server **immediately revokes all active sessions** (deletes all refresh tokens in the database for that user), forcing both the user and the attacker to re-log in.

---

## 4. Code Implementation Highlights

### JWT Verification Helper
```typescript
export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret);
}
```

### Route Protection Middleware
Our `protect` middleware extracts the header, verifies the token, and attaches the user record to the request:
```typescript
const decoded = verifyToken(token, env.JWT_SECRET);
const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
req.user = user;
```
