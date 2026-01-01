import { NextFunction, Response } from 'express';
import { Post, IPost } from '@models/post.entity';
import { Base } from '@/lib/route-builder/base.route';
import { IRequest } from '@/lib/route-builder/types/base.type';
import { AppRoute } from '@/types';

export class PostRoute extends Base<IPost> implements AppRoute {
    constructor() {
        super({
            path: '/posts',
            collection: 'posts',
            model: Post,
            types: {
                GET: true,
                POST: {
                    ONE: true,
                    ONESOFT: false,
                },
            },
        });
        /**
         * Important: To Bind current class Method setRouter is called After current class.
         **/
        this.setRouter();
    }

    readonly afterGetAll = (req: IRequest, res: Response, _next: NextFunction) => {
        console.log('Response After GET', req.data);
        return res.json({
            success: true,
            data: req.data,
        });
    };
}
