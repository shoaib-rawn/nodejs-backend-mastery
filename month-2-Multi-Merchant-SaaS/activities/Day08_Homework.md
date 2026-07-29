# Day 08 Challenge: Environment & Password Validation

Today's challenge is to build a verification script inside `activities/verify-day08.ts` that will query the database and test our new validation and hashing systems.

---

## 🎯 Task Objective

Write a script that validates two things:
1.  **Zod Schema Type Casting:** Confirm that `env.PORT` has been cast from a string to a strict TypeScript `number` type.
2.  **Bcrypt Signature Verification:** Query the database and load the seeded `admin@platform.com` user record. Verify that their password:
    *   Is not stored as a plain text string.
    *   Has a length of exactly `60` characters (the standard length of a bcrypt hash).
    *   Starts with the prefix `$2a$` or `$2b$` (the standard signature of a bcrypt hash).
3.  **Password Comparison Logic:** Compare a plain text string `'adminpassword123'` against the loaded database hash using `bcryptjs.compare` and confirm it returns `true`.

---

## 🚦 Deliverables

1.  Create `activities/verify-day08.ts`.
2.  Run the verification script:
    ```bash
    npx ts-node activities/verify-day08.ts
    ```
3.  Ensure your terminal logs report that all tests passed successfully.
