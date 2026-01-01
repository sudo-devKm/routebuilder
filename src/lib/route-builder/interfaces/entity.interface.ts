import { Model } from 'mongoose';
import { ReqMethodTypes } from '../types/base.type';

export interface IEntity<M> {
  readonly path: string;
  readonly collection: string;
  readonly model: Model<M>;
  types: ReqMethodTypes;
}
