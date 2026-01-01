// *** Constants ***
import { Methods, ReqTypes } from './../constants/base.constant';

type GetType = {
  [key in Extract<ReqTypes, 'GET'>]?:
    | {
        [methodKey in Exclude<Methods, 'ONESOFT'>]?: boolean;
      }
    | boolean;
};
type OtherTypes = {
  [key in Exclude<ReqTypes, 'GET'>]?:
    | {
        [methodKey in Exclude<Methods, 'ALL'>]?: boolean;
      }
    | boolean;
};

export type ReqMethodTypes = OtherTypes & GetType;
