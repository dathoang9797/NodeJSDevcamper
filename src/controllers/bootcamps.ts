import type { Request, Response, NextFunction } from "express";
import type { UploadedFile } from "express-fileupload";
import path from 'path';
import Bootcamp from "#src/models/bootcamp.ts";
import ErrorResponse from "#src/utils/errorResponse.ts";
import asyncHandler from "#src/middleware/async.ts";
// import { GetLatLngByAddress } from "@geocoder-free/google";

const getBootcamps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
});

const getBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

const createBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //Add user to req.body
    req.body.user = req.user.id;

    //Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));
    }

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
});

const updateBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    const filter = { _id: req.params.id } as any;
    if (req.user.role !== 'admin')
        filter.user = req.user.id;

    bootcamp = await Bootcamp.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!bootcamp) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`, 401));
    }

    res.status(200).json({ success: true, data: bootcamp });
});

const deleteBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    const filter = { _id: req.params.id } as any;
    if (req.user.role !== 'admin')
        filter.user = req.user.id;

    bootcamp = await Bootcamp.findOneAndDelete(filter);
    if (!bootcamp) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`, 401));
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