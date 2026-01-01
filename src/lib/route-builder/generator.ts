import { NextFunction, Response, Request } from 'express';
import { Model } from 'mongoose';
import { HttpException } from '@/exceptions/http.exception';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

export default abstract class Generator<M> {
    private model: Model<M>;

    constructor(model: Model<M>) {
        this.model = model;
    }

    protected getOneRoute = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
        const doc = await this.model.findById(req.params.id).lean();
        if (!doc) {
            throw new HttpException({ message: 'No Record Found', status: StatusCodes.NOT_FOUND });
        }
        req.data = doc;
        next();
    });

    protected getAllRoute = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
        const query: any = this.model.find((req.query as any) ?? {});
        if (req.query?.select) {
            query.select(req.query?.select);
        }
        const docs = await query;
        if (!docs) {
            throw new HttpException({ message: 'No Document Found With given Id', status: StatusCodes.NOT_FOUND });
        }
        req.data = docs;
        next();
    });

    protected updateOneRoute = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
        const doc = await this.model.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true,
        });
        if (!doc) {
            throw new HttpException({ message: 'No Document Found With given Id', status: StatusCodes.NOT_FOUND });
        }
        req.data = doc;
        next();
    });

    protected deleteOneRoute = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
        const doc = await this.model.findByIdAndDelete(req.params.id);

        if (!doc) {
            throw new HttpException({ message: 'No Document Found With given Id', status: StatusCodes.NOT_FOUND });
        }
        req.data = doc;
        next();
    });

    protected createOneRoute = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
        const doc = await this.model.create(req.body);
        req.data = doc;
        next();
    });
}
