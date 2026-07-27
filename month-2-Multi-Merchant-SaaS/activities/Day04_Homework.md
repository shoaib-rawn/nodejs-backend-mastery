# Month 2 Day 04 Homework Challenge: Extending 1:1 Relations & Validating Cascades

## 🎯 Goal
Your challenge is to extend the newly created `User` and `Profile` data models, run database migrations, and write a TypeScript test script to verify that:
1. Users and Profiles are correctly linked in a **1:1 relationship**.
2. Deleting a `User` correctly triggers a **Cascade Delete** to wipe the associated `Profile` record.

---

## 🛠️ Step 1: Extend the Schema with Address Fields

Modify your `prisma/schema.prisma` file to add the following fields to the `Profile` model:
- `street`: A string representing the street address.
- `city`: A string representing the user's city.
- `state`: An optional string representing the state or province.
- `postalCode`: A string representing the ZIP or postal code.
- `country`: A string representing the user's country.

*Remember to write comments explaining each field as per the coding guidelines!*

---

## 🛠️ Step 2: Regenerate Prisma Client

Compile your extended schemas into the node_modules client binaries by running:
```bash
npx prisma generate
```

---

## 🛠️ Step 3: Verify Schema & Relationships via Prisma Studio

Instead of writing complex and throwaway test scripts, verify database integration visually using the official **Prisma Studio** GUI:

1. Launch Prisma Studio:
   ```bash
   npx prisma studio
   ```
2. Open the browser at **`http://localhost:5555`** and open the **User** model.
3. Click **Add record** and create a User. Click **Save 1 change** at the bottom to save the record to Postgres and generate its auto-increment ID.
4. Open the **Profile** model, click **Add record**, fill in the details, double-click the `userId` / `user` relation cell, and connect it to the User record you created. Save the changes.
5. Go back to the **User** model, check the box next to your test user, click **Delete 1 record**, and save the change.
6. Verify that the linked record in the **Profile** model was deleted automatically (Cascade Delete).

---

## 🔍 Validation Checklist
- Did you add the required address fields to the `Profile` model?
- Did you write explanatory comments on each field?
- Did you successfully run `npx prisma db push` to push the changes to PostgreSQL?
- Did you confirm in Prisma Studio that deleting a User successfully deletes their linked Profile?

