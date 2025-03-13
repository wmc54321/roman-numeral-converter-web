import { type Logger } from "pino";
import { type ErrorRequestHandler } from "express";

// check if it's jest test run
const IS_JEST_RUN = !!process.env.JEST_WORKER_ID;

export enum INPUT_ERROR_KEY {
  EMPTY_INPUT = "EMPTY_INPUT",
  NOT_A_NUMBER = "NOT_A_NUMBER",
  NOT_AN_INTEGER = "NOT_AN_INTEGER",
  NEGATIVE_OR_ZERO = "NEGATIVE_OR_ZERO",
  EXCEEDS_SUPPORTED_RANGE = "EXCEEDS_SUPPORTED_RANGE",
}

// The error messages to be displayed.
export const INPUT_ERROR_MESSAGES = {
  [INPUT_ERROR_KEY.EMPTY_INPUT]: "Input query should not be empty.",
  [INPUT_ERROR_KEY.NOT_A_NUMBER]: "Input should be a number.",
  [INPUT_ERROR_KEY.NOT_AN_INTEGER]: "Input should be an integer.",
  [INPUT_ERROR_KEY.NEGATIVE_OR_ZERO]: "Input should be a positive number.",
  [INPUT_ERROR_KEY.EXCEEDS_SUPPORTED_RANGE]: "Numbers more than 3999 are not supported.",
}

// The HTTP status code for client input errors
export const INPUT_ERROR_STATUS_CODE = {
  [INPUT_ERROR_KEY.EMPTY_INPUT]: 400,
  [INPUT_ERROR_KEY.NOT_A_NUMBER]: 400,
  [INPUT_ERROR_KEY.NOT_AN_INTEGER]: 422,
  [INPUT_ERROR_KEY.NEGATIVE_OR_ZERO]: 422,
  [INPUT_ERROR_KEY.EXCEEDS_SUPPORTED_RANGE]: 422,
}

export class InputError extends Error {
  private readonly statusCode: number;
  private readonly logEventName: string;

  constructor(errorKey: INPUT_ERROR_KEY, logEventName: string, ) {
    super(INPUT_ERROR_MESSAGES[errorKey]);
    this.name = errorKey;
    this.statusCode = INPUT_ERROR_STATUS_CODE[errorKey];
    this.logEventName = logEventName;
  }

  public getStatusCode() {
    return this.statusCode;
  }

  public getLogEventName() {
    return this.logEventName;
  }
}

// Express.js error handler middleware
export function getErrorHandlerWithLogger(logger: Logger) {
  const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
    let statusCode = 500;
    let logEventName = 'unknown.error';
    let errorMessage = "An unknown error occurred.";
    if (error instanceof InputError) { // known input errors
      statusCode = error.getStatusCode();
      logEventName = error.getLogEventName();
      errorMessage = error.message;
    } else if (error instanceof Error) { // not a known input error - server errors (500).
      errorMessage = error.message;
    }

    const response = {error: errorMessage};
    res.status(statusCode).json(response);

    if (!IS_JEST_RUN) {
      logger.info({ // promClient side error, no need to use error level.
        event: logEventName,
        response,
        method: req.method,
        url: req.url,
        ip: req.ip,
      });
    }
  };
  return errorHandler;
}
