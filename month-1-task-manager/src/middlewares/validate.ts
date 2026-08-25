import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import fs from 'fs/promises';

export const validate = (schema: z.ZodObject<any, any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            // Clean up uploaded file if validation fails to prevent orphan images
            if (req.file) {
                try {
                    await fs.unlink(req.file.path);
                } catch (err) {
                    console.error("Failed to delete uploaded file after validation error:", err);
                }
            }

            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.issues.map((err: z.ZodIssue) => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            next(error);
        }
    };
};
