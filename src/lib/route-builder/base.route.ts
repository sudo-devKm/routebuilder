// *** import packages ***
import { NextFunction, Request, Response, Router } from 'express';

// *** Types ***
import { IEntity } from './interfaces/entity.interface';

// *** Classes ***
import Generator from './generator';
import { ReqTypes } from './constants/base.constant';
import { AppRequestHandler, AppRoute } from '@/types';
import { StatusCodes } from 'http-status-codes';

export abstract class Base<M> extends Generator<M> implements AppRoute {
  // *** Basic Route Details ***
  readonly router: Router;
  readonly path: string;
  // *** For more Implementation ***
  protected readonly beforeGet?: AppRequestHandler;
  protected readonly beforeGetAll?: AppRequestHandler;
  protected readonly beforePost?: AppRequestHandler;
  protected readonly beforePostSoft?: AppRequestHandler;
  protected readonly beforePatch?: AppRequestHandler;
  protected readonly beforePatchSoft?: AppRequestHandler;
  protected readonly beforePut?: AppRequestHandler;
  protected readonly beforePutSoft?: AppRequestHandler;
  protected readonly afterGet?: AppRequestHandler;
  protected readonly afterGetAll?: AppRequestHandler;
  protected readonly afterPost?: AppRequestHandler;
  protected readonly afterPostSoft?: AppRequestHandler;
  protected readonly afterPatch?: AppRequestHandler;
  protected readonly afterPatchSoft?: AppRequestHandler;
  protected readonly afterPut?: AppRequestHandler;
  protected readonly afterPutSoft?: AppRequestHandler;

  constructor(private readonly entity: IEntity<M>) {
    super(entity.model);
    this.path = entity.path;
    this.router = Router();
    this.normalizeEntityTypes();
  }

  private readonly noopMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.data) {
      res.status(req.status ?? StatusCodes.OK).json(req.data);
      delete req.data;
      return;
    }
    if (!res.headersSent) {
      next();
    }
  };

  private normalizeEntityTypes(): void {
    if (!this.entity.types) return;

    Object.values(ReqTypes).forEach((type) => {
      const typeValue = this.entity.types?.[type];

      if (typeof typeValue === 'boolean') {
        const normalizedType: any = { ONE: typeValue };

        if (type === ReqTypes.GET) {
          normalizedType.ALL = typeValue;
        } else {
          normalizedType.ONESOFT = typeValue;
        }

        this.entity.types = {
          ...this.entity.types,
          [type]: normalizedType,
        };
      }
    });
  }

  getModel() {
    return this.entity.model;
  }

  protected setRouter(): void {
    this.setGetRoutes();
    this.setPostRoutes();
    this.setPatchRoutes();
    this.setPutRoutes();
  }

  private setGetRoutes(): void {
    const getTypes = this.entity?.types?.GET;
    if (typeof getTypes !== 'object') return;

    if (getTypes.ALL) {
      this.router
        .route(this.path)
        .get(this.beforeGetAll ?? this.noopMiddleware, this.getAllRoute, this.afterGetAll ?? this.noopMiddleware);
    }

    if (getTypes.ONE) {
      this.router
        .route(`${this.path}/:id`)
        .get(this.beforeGet ?? this.noopMiddleware, this.getOneRoute, this.afterGet ?? this.noopMiddleware);
    }
  }

  private setPostRoutes(): void {
    const postTypes = this.entity?.types?.POST;
    if (typeof postTypes !== 'object') return;

    if (postTypes.ONE) {
      this.router
        .route(this.path)
        .post(this.beforePost ?? this.noopMiddleware, this.createOneRoute, this.afterPost ?? this.noopMiddleware);
    }

    if (postTypes.ONESOFT) {
      this.router
        .route(`${this.path}/draft`)
        .post(
          this.beforePostSoft ?? this.noopMiddleware,
          this.createOneRoute,
          this.afterPostSoft ?? this.noopMiddleware,
        );
    }
  }

  private setPatchRoutes(): void {
    const patchTypes = this.entity?.types?.PATCH;
    if (typeof patchTypes !== 'object') return;

    if (patchTypes.ONE) {
      this.router
        .route(`${this.path}/:id`)
        .patch(this.beforePatch ?? this.noopMiddleware, this.updateOneRoute, this.afterPatch ?? this.noopMiddleware);
    }

    if (patchTypes.ONESOFT) {
      this.router
        .route(`${this.path}/:id/draft`)
        .patch(
          this.beforePatchSoft ?? this.noopMiddleware,
          this.updateOneRoute,
          this.afterPatchSoft ?? this.noopMiddleware,
        );
    }
  }

  private setPutRoutes(): void {
    const putTypes = this.entity?.types?.PUT;
    if (typeof putTypes !== 'object') return;

    if (putTypes.ONE) {
      this.router
        .route(`${this.path}/:id`)
        .put(this.beforePut ?? this.noopMiddleware, this.updateOneRoute, this.afterPut ?? this.noopMiddleware);
    }

    if (putTypes.ONESOFT) {
      this.router
        .route(`${this.path}/:id/draft`)
        .put(this.beforePutSoft ?? this.noopMiddleware, this.updateOneRoute, this.afterPutSoft ?? this.noopMiddleware);
    }
  }
}
