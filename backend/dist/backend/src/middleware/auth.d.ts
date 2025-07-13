import { Request, Response, NextFunction } from 'express';
import { User } from '../../../shared/types';
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const generateToken: (userId: string) => string;
//# sourceMappingURL=auth.d.ts.map