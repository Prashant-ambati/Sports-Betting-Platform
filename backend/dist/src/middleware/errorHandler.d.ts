import { Request, Response } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare const errorHandler: (error: AppError, req: Request, res: Response) => void;
export declare const createError: (message: string, statusCode?: number) => AppError;
export declare const notFound: (req: Request, res: Response) => void;
//# sourceMappingURL=errorHandler.d.ts.map