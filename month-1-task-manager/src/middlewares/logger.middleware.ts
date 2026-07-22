import type { Request, Response, NextFunction } from 'express';

// This is our custom middleware function
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    // 1. Listen for the 'finish' event on the response object
    // This runs AFTER the route is completely done and the response is sent
    res.on('finish', () => {
        // Ignore annoying background requests from Chrome DevTools
        if (req.originalUrl.includes('.well-known')) return;
        
        console.log(`[LOG] ${req.method} request made to ${req.originalUrl} - Status: ${res.statusCode}`);
    });

    // 2. We MUST call next() to tell Express to move on to the actual routes
    next();
};
