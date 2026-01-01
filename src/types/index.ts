import { RequestHandler, Response, Router } from 'express';
import { ZodObject, core } from 'zod';

export interface AppRoute {
  readonly router: Router;
  readonly path?: string;
}

export type AppRequestHandler = RequestHandler | RequestHandler[];

export type HttpExceptionOptions = {
  status?: number;
  message?: string;
  success?: boolean;
  data?: Record<string, any>;
};

export type ErrorResponse = {
  success?: boolean;
  message?: string;
  data?: any;
  details?: string;
};

export type SchemaValidationItem = {
  schema: ZodObject;
  options?: core.ParseContext<core.$ZodIssue>;
};

export type SchemaValidationOptions = {
  [key: string]: SchemaValidationItem;
};

export type SendResponseOptions = {
  status?: number;
  res: Response;
  data?: Record<string, any> | null | undefined;
  message?: string;
  success?: boolean;
};
