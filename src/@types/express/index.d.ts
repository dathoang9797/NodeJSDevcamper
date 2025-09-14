import type { IUser } from '#src/models/user.ts';

declare global {
    namespace Express {
        interface Response {
            advancedResults?: {
                success: boolean;
                count: number;
                pagination: { next: any; prev: any };
                data: any;
            };
        }
        interface Request {
            user?: IUser;
        }
    }
}