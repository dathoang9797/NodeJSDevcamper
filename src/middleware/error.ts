import ErrorResponse from "#src/utils/errorResponse.ts";
import type { Request, Response, NextFunction } from "express";

const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err };

    error.message = err.message;
    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value}`;
        err = new ErrorResponse(message, 404);
    }

    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        err = new ErrorResponse(message, 400);
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.value).map((val: any) => val.message).join(", ");
        err = new ErrorResponse(message, 400);
    }

    res.status(err.statusCode || 500).send(err.message || 'Something broke!');
};

export default errorHandler;
