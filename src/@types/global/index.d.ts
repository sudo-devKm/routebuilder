export {};

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
      data?: Record<string, any>;
      status?: number;
    }
  }
}
