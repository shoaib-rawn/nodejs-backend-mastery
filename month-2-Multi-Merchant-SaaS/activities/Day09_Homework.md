# Day 09 Challenge: JWT Authentication & Rotation Validation

Today's challenge is to write a verification script inside `activities/verify-day09.ts` to programmatically test our new login, token refresh, and logout endpoints.

---

## 🎯 Task Objective

Write a TypeScript validation script that does the following:

1.  **Simulate Login:** Send a POST request to `/api/v1/auth/login` using credentials seeded on Day 08:
    *   Email: `buyer1@gmail.com`
    *   Password: `customerpassword123`
2.  **Verify Login Output:** Confirm that:
    *   The API returns a `200` status.
    *   The response body contains a valid `accessToken` string.
    *   A `refreshToken` row is created in the database mapping this `userId`.
3.  **Simulate Token Refresh (Rotation):** Read the refresh token from the database, simulate a refresh request to `/api/v1/auth/refresh`, and verify that:
    *   The old refresh token is **deleted** from the database.
    *   A **new** refresh token is written to the database.
    *   A new access token is returned.
4.  **Simulate Reuse Detection (Security Check):** Attempt to make a second refresh request using the **old, deleted refresh token** and verify that:
    *   The API returns a `403 Forbidden` status.
    *   The database is successfully wiped of **all** refresh tokens for that user ID.

---

## 🚦 Deliverables

1.  Create `activities/verify-day09.ts`.
2.  Run the verification script.
3.  Ensure your terminal logs report that all tests passed successfully.
