import { type Logger } from "pino";
import { type ErrorRequestHandler } from "express";

export class AppError extends Error {
  private readonly statusCode: number;
  private readonly logEventName: string;

  constructor(statusCode: number, logEventName: string, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.logEventName = logEventName;
  }

  public getStatusCode() {
    return this.statusCode;
  }

  public getLogEventName() {
    return this.logEventName;
  }
}

export function getErrorHandlerWithLogger(logger: Logger) {
  const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
    let statusCode = 500;
    let logEventName = 'unknown.error';
    let errorMessage = "An unknown error occurred.";
    if (error instanceof AppError) {
      statusCode = error.getStatusCode();
      logEventName = error.getLogEventName();
      errorMessage = error.message;
    }

    const response = { error: errorMessage };
    res.status(statusCode).json(response);
    logger.info({ // promClient side error, no need to use error level.
      event: logEventName,
      response,
      method: req.method,
      url: req.url,
      ip: req.ip,
    });
  }
  return errorHandler;
}
