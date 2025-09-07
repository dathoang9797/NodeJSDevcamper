import type { Request, Response, NextFunction } from "express";
import type { UploadedFile } from "express-fileupload";
import path from 'path';
import Bootcamp from "#src/models/bootcamp.ts";
import ErrorResponse from "#src/utils/errorResponse.ts";
import asyncHandler from "#src/middleware/async.ts";
// import { GetLatLngByAddress } from "@geocoder-free/google";

const getBootcamps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const reqQuery = { ...req.query };
    const excludedFields = ['select', 'sort', 'page', 'limit'];
    excludedFields.forEach((field) => delete reqQuery[field]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    let queryParse = JSON.parse(queryStr);

    let query = Bootcamp.find(queryParse).populate('courses');
    if (req.query.select) {
        const select = req.query.select as string;
        const fields = select.split(",").join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort as string;
        const fields = sortBy.split(",").join(' ');
        query = query.sort(fields);
    } else {
        query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments(queryParse);
    query = query.skip(startIndex).limit(limit);

    const pagination = { next: null, prev: null };
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    const bootcamps = await query;
    res.status(200).json({ success: true, data: bootcamps, pagination });
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

export const uploadImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }
    const file = req.files.file as UploadedFile;

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    if (file.size > parseInt(process.env.MAX_FILE_UPLOAD, 10)) {
        return next(new ErrorResponse(`Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({ success: true, data: file.name });
    });
});

export const bootcampController = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    uploadImage
    // getBootcampsInRadius
}