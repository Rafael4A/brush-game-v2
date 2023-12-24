import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";

import { join } from "path";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.enableCors();

  // Set up the global prefix for your API routes
  app.setGlobalPrefix("api");

  // Serve your static files (React app)
  // TODO CREATE FOLDER AND SERVE IT
  app.useStaticAssets(join(__dirname, "..", "client"));

  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);
}
bootstrap();
