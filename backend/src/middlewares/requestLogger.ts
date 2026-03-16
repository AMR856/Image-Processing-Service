import morgan from "morgan";
import { logger } from "../utils/logger";
import { Request } from "express";

const getLogLevel = (status: number): "error" | "warn" | "info" | "debug" => {
  if (status >= 500) return "error"; 
  if (status >= 400) return "warn";
  if (status >= 300) return "debug";
  return "info";
};

const formatLogMessage = (
  method: string,
  url: string,
  status: number,
  contentLength: string | undefined,
  responseTime: number,
  params: Record<string, any>,
  query: Record<string, any>
): string => {
  const contentLengthStr = contentLength ? ` | Content-Length: ${contentLength}` : "";
  const paramsStr = Object.keys(params).length ? ` | Params: ${JSON.stringify(params)}` : "";
  const queryStr = Object.keys(query).length ? ` | Query: ${JSON.stringify(query)}` : "";

  return `${method} ${url} [${status}]${contentLengthStr} - ${responseTime}ms${paramsStr}${queryStr}`;
};

morgan.token("params", (req) => JSON.stringify((req as Request).params));
morgan.token("query", (req) => JSON.stringify((req as Request).query));

export const requestLogger = morgan((tokens, req, res) => {
  const method = tokens.method?.(req, res) || "UNKNOWN";
  const url = tokens.url?.(req, res) || "/";
  const status = tokens.status?.(req, res) || "200";
  const contentLength = tokens.res?.(req, res, "content-length");
  const responseTime = parseFloat(tokens["response-time"]?.(req, res) || "0");
  const params = (req as Request).params || {};
  const query = (req as Request).query || {};

  const statusCode = parseInt(status);
  const logLevel = getLogLevel(statusCode);

  const message = formatLogMessage(
    method,
    url,
    statusCode,
    contentLength,
    responseTime,
    params,
    query
  );

  logger[logLevel](message);

  return null;
});