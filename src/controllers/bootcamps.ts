import type { Request, Response, NextFunction } from "express";
import bootcamp from "#src/models/bootcamp.ts";

const getBootcamps = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true, message: "Show all bootcamps" });
};

const getBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true, message: `Show bootcamp ${req.params.id}` });
};

const createBootcamp = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    res.status(201).json({ success: true, message: "Create new bootcamp" });
};

const updateBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true, message: `Update bootcamp ${req.params.id}` });
};

const deleteBootcamp = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true, message: `Delete bootcamp ${req.params.id}` });
};

export const bootcampController = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
}