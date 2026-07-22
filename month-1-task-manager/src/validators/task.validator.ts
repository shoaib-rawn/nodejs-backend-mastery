import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string({ message: "Title is required" }).min(3, "Title must be at least 3 characters long")
  })
});

// Note: updateTaskSchema will be implemented by the user as part of Day 13 Homework!
