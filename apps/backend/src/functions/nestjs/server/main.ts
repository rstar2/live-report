import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // for local testing of Nestjs use this - make it depend on env variable
  if (process.env.NEST_GLOBAL_PREFIX) app.setGlobalPrefix(process.env.NEST_GLOBAL_PREFIX);

  await app.listen(3000);
}

bootstrap();
