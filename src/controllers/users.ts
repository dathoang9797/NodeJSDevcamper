import User from "#src/models/user.ts";
import ErrorResponse from "#src/utils/errorResponse.ts";
import asyncHandler from "#src/middleware/async.ts";
import type { Request, Response, NextFunction } from "express";

export const GetUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
});
    
export const GetUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: user });
});

export const CreateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
});

export const UpdateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    } 
    res.status(200).json({ success: true, data: user });
});

export const DeleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });
});