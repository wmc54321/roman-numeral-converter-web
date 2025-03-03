import './otel-back-end.ts'; // init otel ahead of all other stuff.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from "pino";
import pinoHttp from "pino-http";
import fs from "fs";
import path from "path";
import * as ServerUtils from './server-utils.ts';

dotenv.config();

const PORT = process.env.VITE_API_PORT || 8080;
const LOG_FILE = process.env.VITE_API_LOG || "server.log";
const FE_URI = process.env.VITE_FE_URI || "http://localhost:5173"; // front-end, hmm, need to replace when release...

// write logs to a log file.
const __dirname = path.resolve();
const logStream = fs.createWriteStream(path.join(__dirname, LOG_FILE), { flags: "a" });
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
app.use(pinoHttp({ logger })); // track HTTP requests on server APIs


// handle requests for roman numeral.
app.get('/romannumeral', (req, res): void => {
  logger.info({
    event: 'romannumeral.request.start',
    method: req.method,
    url: req.url,
    ip: req.ip,
  })
  const queryParamStr = String(req.query.query);

  try {
    const romanNumeral = ServerUtils.convertToRomanNumeral(queryParamStr);
    const response = { input: queryParamStr, output: romanNumeral };
    res.json(response);
    logger.info({
      event: 'romannumeral.request.end.success',
      response,
      method: req.method,
      url: req.url,
      ip: req.ip,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    const response = { error: errorMessage };
    res.status(400).json(response);
    logger.info({ // promClient side error, no need to use error level.
      event: 'romannumeral.request.end.error',
      response,
      method: req.method,
      url: req.url,
      ip: req.ip,
    })
  }
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// expose build files.
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
