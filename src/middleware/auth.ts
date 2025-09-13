import jwt from 'jsonwebtoken';
import asyncHandler from './async.ts';
import ErrorResponse from '#src/utils/errorResponse.ts';
import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import User from '#src/models/user.ts';

const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization?.startsWith?.("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // if(req.cookies.token){
    // }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        console.log({ decoded })
        const id = decoded.id;
        const user = await User.findById(id);
        if (!user) {
            return next(new ErrorResponse("Not authorized to access this route", 401));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }

});

export { protect };