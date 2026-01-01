import { NextFunction, Response } from 'express';
import { IRequest } from '../lib/route-builder/types/base.type';
import { HttpException } from '../exceptions/http.exception';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = (err: any, _req: IRequest, res: Response, _next: NextFunction) => {
    let error = { ...err };

    console.log(err.message);
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new HttpException({ message, status: StatusCodes.NOT_FOUND });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new HttpException({ message, status: StatusCodes.BAD_REQUEST });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map((val: any) => val.message)
            .toString();
        error = new HttpException({ message, status: StatusCodes.BAD_REQUEST });
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || err.message || 'Server Error',
    });
};
