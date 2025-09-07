import type { Request, Response, NextFunction } from "express";
import Course from "#src/models/course.ts";
import Bootcamp from "#src/models/bootcamp.ts";
import ErrorResponse from "#src/utils/errorResponse.ts";
import asyncHandler from "#src/middleware/async.ts";

const getCourses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find().populate({
            path: "bootcamp",
            select: "name description"
        });
    }

    const courses = await query;
    res.status(200).json({ success: true, data: courses, count: courses.length });
});

const getCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findById(req.params.id).populate({
        path: "bootcamp",
        select: "name description"
    });

    if (!course) {
        return next(new ErrorResponse(`No course found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: course });
});

const createCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp found with id of ${req.params.bootcampId}`, 404));
    }

    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
});

const updateCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!course) {
        return next(new ErrorResponse(`No course found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: course });
});

const deleteCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`No course found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });
});

export const courseController = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
};