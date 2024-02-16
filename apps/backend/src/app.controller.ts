import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { join } from "path";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(@Res() res: Response) {
    const filePath = join(
      __dirname,
      "..",
      "..",
      "frontend",
      "dist",
      "index.html"
    );

    res.status(200);

    res.header("Content-Type", "text/html");
    res.sendFile(filePath);
  }
}
