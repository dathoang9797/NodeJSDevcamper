import type { Request, Response, NextFunction } from "express";
import Bootcamp from "#src/models/bootcamp.ts";
import ErrorResponse from "#src/utils/errorResponse.ts";

const getBootcamps = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, data: bootcamps });
    } catch (err) {
        next(err);
    }
};

const getBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return res.status(404).json({ success: false, message: "Bootcamp not found" });
        }
        res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
};

const createBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({ success: true, data: bootcamp });
    } catch (err) {
        next(new ErrorResponse("Failed to create bootcamp", 400));
    }
};

const updateBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
        next(err);
    }
};

const deleteBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if (!bootcamp) {
            return res.status(404).json({ success: false, message: "Bootcamp not found" });
        }
        res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
        next(err);
    }
};

export const bootcampController = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
}