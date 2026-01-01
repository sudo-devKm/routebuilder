// *** import packages ***
import { NextFunction, RequestHandler, Response, Router } from 'express';

// *** Types ***
import { IRequest } from './types/base.type';
import { IEntity } from './interfaces/entity.interface';

// *** Constants ***

// *** Classes ***
import Generator from './generator';
import { ReqTypes } from './constants/base.constant';
import { Route } from '@interfaces/route.interface';

export abstract class Base<M> extends Generator<M> implements Route {
  // *** Basic Route Details ***
  readonly router: Router;
  readonly path: string;
  // *** For more Implementation ***
  protected readonly beforeGet?: RequestHandler;
  protected readonly beforeGetAll?: RequestHandler;
  protected readonly beforePost?: RequestHandler;
  protected readonly beforePostSoft?: RequestHandler;
  protected readonly beforePatch?: RequestHandler;
  protected readonly beforePatchSoft?: RequestHandler;
  protected readonly beforePut?: RequestHandler;
  protected readonly beforePutSoft?: RequestHandler;
  protected readonly afterGet?: RequestHandler;
  protected readonly afterGetAll?: RequestHandler;
  protected readonly afterPost?: RequestHandler;
  protected readonly afterPostSoft?: RequestHandler;
  protected readonly afterPatch?: RequestHandler;
  protected readonly afterPatchSoft?: RequestHandler;
  protected readonly afterPut?: RequestHandler;
  protected readonly afterPutSoft?: RequestHandler;

  constructor(private readonly entity: IEntity<M>) {
    super(entity.model);
    this.path = entity.path;
    this.router = Router();
    this.setUpVerbs();
  }
  private readonly noopMiddleWare = (req: IRequest, res: Response, next: NextFunction) => {
    if (req.data) {
      req.status ? res.status(req.status).json(req.data) : res.json(req.data);
      delete req.data;
      return;
    }
    !res.headersSent && next();
  };

  private readonly setUpVerbs = () => {
    Object.values(ReqTypes).forEach((type) => {
      if (typeof this.entity?.types?.[type] === 'boolean') {
        this.entity.types = {
          ...this.entity?.types,
          [type]: {
            ONE: !!this.entity?.types?.[type],
            ...(type === ReqTypes.GET && { ALL: !!this.entity?.types?.[type] }),
            ...(type !== ReqTypes.GET && { ONESOFT: !!this.entity?.types?.[type] }),
          },
        };
      }
    });
  };

  getModel() {
    return this.entity.model;
  }

  protected readonly setRouter = () => {
    this.setGetRoutes();
    this.setPostRoutes();
    this.setPatchRoutes();
    this.setPutRoutes();
  };

  private setGetRoutes() {
    if (typeof this.entity?.types?.GET === 'object') {
      this.entity?.types?.GET?.ALL &&
        this.router
          .route(`${this.path}`)
          .get(this.beforeGetAll ?? this.noopMiddleWare, this.getAllRoute, this.afterGetAll ?? this.noopMiddleWare);
      this.entity?.types?.GET?.ONE &&
        this.router
          .route(`${this.path}/:id`)
          .get(this.beforeGet ?? this.noopMiddleWare, this.getOneRoute, this.afterGet ?? this.noopMiddleWare);
    }
  }

  private setPostRoutes() {
    if (typeof this.entity?.types?.POST === 'object') {
      this.entity?.types?.POST?.ONE &&
        this.router
          .route(`${this.path}`)
          .post(this.beforePost ?? this.noopMiddleWare, this.createOneRoute, this.afterPost ?? this.noopMiddleWare);

      this.entity?.types?.POST?.ONESOFT &&
        this.router
          .route(`${this.path}/draft`)
          .post(
            this.beforePostSoft ?? this.noopMiddleWare,
            this.createOneRoute,
            this.afterPostSoft ?? this.noopMiddleWare,
          );
    }
  }

  private setPatchRoutes() {
    if (typeof this.entity?.types?.PATCH === 'object') {
      this.entity?.types?.PATCH?.ONE &&
        this.router
          .route(`${this.path}/:id`)
          .patch(this.beforePatch ?? this.noopMiddleWare, this.updateOneRoute, this.afterPatch ?? this.noopMiddleWare);

      this.entity?.types?.PATCH?.ONESOFT &&
        this.router
          .route(`${this.path}/:id/draft`)
          .patch(
            this.beforePatchSoft ?? this.noopMiddleWare,
            this.updateOneRoute,
            this.afterPatchSoft ?? this.noopMiddleWare,
          );
    }
  }

  private setPutRoutes() {
    if (typeof this.entity?.types?.PUT === 'object') {
      this.entity?.types?.PUT?.ONE &&
        this.router
          .route(`${this.path}/:id`)
          .put(this.beforePut ?? this.noopMiddleWare, this.updateOneRoute, this.afterPut ?? this.noopMiddleWare);

      this.entity?.types?.PUT?.ONESOFT &&
        this.router
          .route(`${this.path}/:id/draft`)
          .put(
            this.beforePutSoft ?? this.noopMiddleWare,
            this.updateOneRoute,
            this.afterPutSoft ?? this.noopMiddleWare,
          );
    }
  }
}
