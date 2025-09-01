import type { Request, Response, NextFunction } from "express";
import Bootcamp from "#src/models/bootcamp.ts";
import ErrorResponse from "#src/utils/errorResponse.ts";
import asyncHandler from "#src/middleware/async.ts";

const getBootcamps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, data: bootcamps });
});

const getBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

const createBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
});

const updateBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
});

const deleteBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

export const bootcampController = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
}