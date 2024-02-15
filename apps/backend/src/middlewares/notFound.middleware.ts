import { HttpStatus } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

const allowedUrls: string[] = ["/allowed-url1", "/allowed-url2"]; // Add your allowed URLs here
export function NotFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestedUrl = req.originalUrl;
  console.log("Looking for URL: ", requestedUrl);
  if (!isUrlAllowed(requestedUrl)) {
    console.log("Not Found");
    res.status(HttpStatus.NOT_FOUND);
  }
  next();
}

function isUrlAllowed(url: string): boolean {
  return allowedUrls.includes(url);
}
