# Day 10: Tenant-Level Role-Based Access Control (RBAC)

Today, we implemented the authorization engine for our Multi-Merchant E-Commerce application: **Platform-level** and **Tenant-level Role-Based Access Control (RBAC)**.

---

## 1. Platform-Level vs. Tenant-Level RBAC

In a multi-tenant SaaS application, security occurs at two separate boundaries:

| Scope | Platform-Level Roles | Tenant-Level (Store) Roles |
| :--- | :--- | :--- |
| **Defines** | User's global platform privilege. | User's specific permissions inside a merchant store. |
| **Roles** | `ADMIN` (Platform admin), `SELLER`, `CUSTOMER`. | `OWNER` (Store owner), `ADMIN` (Store manager), `STAFF` (Store staff). |
| **Usage** | E.g. Blocking Customers from creating new stores or accessing platform metrics. | E.g. Restricting staff members from editing store billing or deleting the store catalog. |

---

## 2. Middleware Factory Design Pattern

Instead of hardcoding route guards, we use a **factory design pattern** that generates Express middleware functions based on the allowed roles parameters passed during configuration.

### A. Platform-Level Guard
Ensures global role alignment:
```typescript
export function authorizePlatformRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: 'fail', message: 'Forbidden' });
    }
    next();
  };
}
```

### B. Tenant-Level (Store) Guard
Checks localized store memberships:
```typescript
export function authorizeStoreRoles(...allowedStoreRoles: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const storeId = Number(req.params.storeId || req.body.storeId);
    
    // Platform Admins (ADMIN) automatically bypass store checks
    if (req.user.role === 'ADMIN') return next();

    // Query specific membership linked to this store and user
    const membership = await prisma.storeMember.findUnique({
      where: {
        storeId_userId: { storeId, userId: req.user.id }
      }
    });

    if (!membership || !allowedStoreRoles.includes(membership.role)) {
      return res.status(403).json({ status: 'fail', message: 'Forbidden' });
    }
    next();
  };
}
```

---

## 3. Key Benefits

1.  **Multi-Tenancy Security:** Prevents Staff of Store A from seeing or editing data for Store B.
2.  **DevOps / Admin Bypass:** Platform `ADMIN` accounts automatically bypass store checks, allowing platform operators to troubleshoot store issues.
3.  **High Code Reusability:** Route guards are applied declaratively in Express routers.
