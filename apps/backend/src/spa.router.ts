import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { join } from "path";

import { ROUTES } from "shared-code";

import { FRONTEND_RELATIVE_PATH } from "./main";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();
    const req: Request = ctx.getRequest();
    const filePath = join(__dirname, FRONTEND_RELATIVE_PATH, "index.html");

    if (isPathValid(req.path)) {
      res.status(200);
    } else {
      res.status(404);
    }

    res.header("Content-Type", "text/html");

    res.sendFile(filePath);
  }
}

function isPathValid(path: string): boolean {
  const pathSegments = path.split("/");

  for (const key in ROUTES) {
    const possiblePathSegments = ROUTES[key].split("/");

    if (pathSegments.length !== possiblePathSegments.length) {
      continue;
    }

    const matches = pathSegments.every(
      (segment, index) =>
        segment === possiblePathSegments[index] ||
        possiblePathSegments[index].startsWith(":")
    );

    if (matches) return true;
  }

  return false;
}
