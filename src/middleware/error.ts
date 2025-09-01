import ErrorResponse from "#src/utils/errorResponse.ts";
import type { Request, Response, NextFunction } from "express";


const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).send(err.message || 'Something broke!');
};

export default errorHandler;
