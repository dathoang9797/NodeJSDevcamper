import type { Request, Response, NextFunction } from "express";
import Course from "#src/models/course.ts";
import Bootcamp from "#src/models/bootcamp.ts";
import ErrorResponse from "#src/utils/errorResponse.ts";
import asyncHandler from "#src/middleware/async.ts";
import Review from "#src/models/reviews.ts";

export const getReviews = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews

        });
    } else {
        return res.status(200).json(res.advancedResults);
    }
});

export const getReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id).populate({
        path: "bootcamp",
        select: "name description"
    });

    if (!review) {
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: review });
});

export const addReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp found with id of ${req.params.bootcampId}`, 404));
    }

    const newReview = await Review.create(req.body);
    res.status(201).json({ success: true, data: newReview });
});

export const updateReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let review = await Review.findById(req.params.id);
    if (!review) {
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this review`, 401));
    }

    review = await Review.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    });

    if (!review) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course`, 401));
    }

    res.status(200).json({ success: true, data: review });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this review`, 401));
    }

    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });
});

