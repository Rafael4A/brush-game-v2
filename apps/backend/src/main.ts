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
  app.useStaticAssets(join(__dirname, "..", "client"), { index: false });

  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalPipes(new ValidationPipe());

  //app.use(NotFoundMiddleware);

  await app.listen(3001);
}
bootstrap();

// https://stackoverflow.com/questions/59847853/how-to-call-a-middlware-on-root-route-that-serves-static-index-html-files-on-nes
// https://stackoverflow.com/questions/64864783/how-to-add-a-route-prefix-to-specific-modules-using-nestjs
// https://rafaeldalsenter.medium.com/docker-compose-nginx-aplica%C3%A7%C3%A3o-web-banco-de-dados-d8f6f33adfd2
