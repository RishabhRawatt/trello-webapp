import { Request, Response, NextFunction, RequestHandler } from "express";

const AsyncHandler = (requestHandler: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(requestHandler(req, res, next));
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || "Internal Server Error";
      res.status(statusCode).json({
        success: false,
        error: errorMessage,
      });
    }
  };
};

export default AsyncHandler;
