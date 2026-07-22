# Month 2 Day 01 Homework: E-Commerce Relational Database Modeling Challenge 🛒

## 🎯 Task Objective
Design a relational schema for an **E-Commerce Platform** on paper or digital text markdown before we write the Prisma code on Days 3, 4, 5 & 6.

---

## 📝 Challenge Requirements

### Part 1: Identify Core Entities
Specify the fields, data types, and primary keys for the following 4 entities:
1. `User` (Customer/Admin account)
2. `Category` (e.g., Electronics, Clothing)
3. `Product` (Items for sale)
4. `Order` (Customer purchases)

---

### Part 2: Map Table Relationships
Answer the following questions:
1. What is the relationship between `User` and `Order`? Where should the Foreign Key be placed?
2. What is the relationship between `Category` and `Product`? Which table holds the Foreign Key?
3. What is the relationship between `Order` and `Product`? Why is a junction table (`OrderItem`) necessary? List the columns of `OrderItem`.

---

### Part 3: Define Constraints
Identify at least 3 database constraints needed for an E-Commerce system:
- Example: Unique email constraint on `User`.
- Example: Non-negative price constraint (`price > 0`) on `Product`.
- Write your 3 constraints!

---

## 📥 Submission
Write down your solutions in a notes file or test your understanding. Compare your answers with Day 4 & 5's Prisma schema design!
