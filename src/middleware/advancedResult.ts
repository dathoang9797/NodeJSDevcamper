import type { Request, Response, NextFunction } from "express";



export const advancedResults = (model: any, populate?: any) => async (req: Request, res: Response, next: NextFunction) => {
    const reqQuery = { ...req.query };
    const excludedFields = ['select', 'sort', 'page', 'limit'];
    excludedFields.forEach((field) => delete reqQuery[field]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    let queryParse = JSON.parse(queryStr);

    let query = model.find(queryParse);
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

    //kiem tra nếu có page và limit thì query phân trang không thì get all
    let pagination = null;
    if (req.query.page || req.query.limit) {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 1;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        query = query.skip(startIndex).limit(limit);


        pagination = { next: null, prev: null };
        const total = await model.countDocuments(queryParse);
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
    }

    if (populate) {
        query = query.populate(populate);
    }

    const result = await query;
    res.advancedResults = {
        success: true,
        count: result.length,
        data: result
    };

    if (pagination) {
        res.advancedResults.pagination = pagination;
    }
    next();
};