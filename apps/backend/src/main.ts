import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import helmet from "helmet";
import { join } from "path";

import { AppModule } from "./app.module";
import { NotFoundExceptionFilter } from "./spa.router";

export const FRONTEND_RELATIVE_PATH = join("..", "..", "frontend", "dist");

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix("api");

  app.use(helmet());

  app.useStaticAssets(join(__dirname, FRONTEND_RELATIVE_PATH), {
    index: false,
  });

  app.useGlobalFilters(new NotFoundExceptionFilter());

  app.useWebSocketAdapter(new IoAdapter(app));

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({ origin: /\.quorzen\.com$/ });

  await app.listen(3001);
}
bootstrap();
