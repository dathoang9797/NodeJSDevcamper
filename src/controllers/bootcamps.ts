import type { Request, Response, NextFunction } from "express";
import Bootcamp from "#src/models/bootcamp.ts";
import ErrorResponse from "#src/utils/errorResponse.ts";
import asyncHandler from "#src/middleware/async.ts";
// import { GetLatLngByAddress } from "@geocoder-free/google";

const getBootcamps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    let queryParse = JSON.parse(queryStr);

    const bootcamps = await Bootcamp.find(queryParse);
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

// const getBootcampsInRadius = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const { zipcode, distance } = req.params;

//     // Get lat/lng from geocoder
//     const location = await GetLatLngByAddress(zipcode);
//     const lat = location[0];
//     const lng = location[1];

// Calculate radius
// const radius = distance / 3963;

// const bootcamps = await Bootcamp.find({
//     location: {
//         $geoWithin: {
//             $centerSphere: [[lng, lat], radius]
//         }
//     }
// });

// res.status(200).json({ success: true, data: bootcamps });
// });

export const bootcampController = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    // getBootcampsInRadius
}