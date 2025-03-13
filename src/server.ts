import './otel-back-end'; // init otel ahead of all other stuff.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from "pino";
import pinoHttp from "pino-http";
import fs from "fs";
import path from "path";
import * as ServerUtils from './server-utils';
import { getErrorHandlerWithLogger } from "./error-utils";

dotenv.config();

const PORT = process.env.VITE_API_PORT || 8080;
const LOG_FILE = process.env.VITE_API_LOG || "server.log";
const FE_URI = process.env.VITE_FE_URI || "http://localhost:5173"; // front-end, hmm, need to replace when release...

// check if it's jest test run
const IS_JEST_RUN = !!process.env.JEST_WORKER_ID;

// write logs to a log file.
const dirname = path.resolve();
const logStream = fs.createWriteStream(path.join(dirname, LOG_FILE), { flags: "a" });
const logger = pino({ level: "info" }, logStream);

const app = express();

// Middlewares
app.use(cors({
  // allow traces to be passed through CORS...
  origin: FE_URI,
  allowedHeaders: ['traceparent', 'content-type'],
  exposedHeaders: ['traceparent'],
}));
app.use(express.json());
if (!IS_JEST_RUN) {
  app.use(pinoHttp({ logger })); // track HTTP requests on server APIs
}

// handle requests for roman numeral.
app.get('/romannumeral', (req, res, next): void => {
  try {
    if (!IS_JEST_RUN) {
      logger.info({
        event: 'romannumeral.request.start',
        method: req.method,
        url: req.url,
        ip: req.ip,
      });
    }
    const queryParamOptStr = req.query.query != null ? String(req.query.query) : null;

    const romanNumeral = ServerUtils.convertToRomanNumeral(queryParamOptStr, 'romannumeral.request.end.error');
    const response = { input: queryParamOptStr, output: romanNumeral };
    res.json(response);

    if (!IS_JEST_RUN) {
      logger.info({
        event: 'romannumeral.request.end.success',
        response,
        method: req.method,
        url: req.url,
        ip: req.ip,
      });
    }
  } catch (error: unknown) {
    next(error);
  }
})

// error handling middleware
app.use(getErrorHandlerWithLogger(logger));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// expose build files.
app.use(express.static(path.join(dirname, "dist")));
app.get("*", (_req, res) => {
  res.sendFile(path.join(dirname, "dist", "index.html"));
});

export default app;