import type { Request, Response, NextFunction } from "express";
import Course from "#src/models/course.ts";
import Bootcamp from "#src/models/bootcamp.ts";
import ErrorResponse from "#src/utils/errorResponse.ts";
import asyncHandler from "#src/middleware/async.ts";

const getCourses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } else {
        return res.status(200).json(res.advancedResults);
    }
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

const addCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp found with id of ${req.params.bootcampId}`, 404));
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401));
    }

    const newCourse = await Course.create(req.body);
    res.status(201).json({ success: true, data: newCourse });
});

const updateCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`No course found with id of ${req.params.id}`, 404));
    }

    let filter = { _id: req.params.id } as any;
    if (req.user.role !== 'admin')
        filter.user = req.user.id;

    course = await Course.findOneAndUpdate(filter, req.body, {
        new: true,
        runValidators: true
    });

    if (!course) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course`, 401));
    }

    res.status(200).json({ success: true, data: course });
});

const deleteCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`No course found with id of ${req.params.id}`, 404));
    }

    let filter = { _id: req.params.id } as any;
    if (req.user.role !== 'admin')
        filter.user = req.user.id;

    const deletedCourse = await Course.findOneAndDelete(filter);
    if (!deletedCourse) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this course`, 401));
    }

    res.status(200).json({ success: true, data: {} });
});

export const courseController = {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
};