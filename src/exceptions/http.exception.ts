import { HttpExceptionOptions } from "@/types";
import { StatusCodes } from "http-status-codes";

export class HttpException extends Error {
    readonly message: string;
    readonly status: number;
    readonly data: Record<string, any> | null;
    readonly success: boolean;

    constructor(options: HttpExceptionOptions) {
        const { data = null, message = 'Something went wrong', status = StatusCodes.INTERNAL_SERVER_ERROR, success = false } = options;
        super(message);

        // set prototype
        Object.setPrototypeOf(this, HttpException.prototype);

        this.message = message;
        this.data = data;
        this.status = status;
        this.success = success;

        // capture stack trace.
        Error.captureStackTrace(this, this.constructor);
    }
}