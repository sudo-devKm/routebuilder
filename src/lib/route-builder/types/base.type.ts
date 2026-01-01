// *** Import Packages ***
import { Request } from 'express';

// *** Constants ***
import { Methods, ReqTypes } from '../constants/base.constant';

type GetType = {
    [key in Extract<ReqTypes, 'GET'>]?:
    | {
        [key in Exclude<Methods, 'ONESOFT'>]?: boolean;
    }
    | boolean;
};
type OtherTypes = {
    [key in Exclude<ReqTypes, 'GET'>]?:
    | {
        [key in Exclude<Methods, 'ALL'>]?: boolean;
    }
    | boolean;
};

export interface IRequest extends Request {
    data?: any;
    status?: number;
}

export type ReqMethodTypes = OtherTypes & GetType;
