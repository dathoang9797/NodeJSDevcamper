// Extend Express Response type to include advancedResults
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
    }
}