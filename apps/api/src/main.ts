import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config, env, swaggerConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, config.app);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  app.enableCors(config.cors);
  await app.listen(env.PORT);
  console.log(`Server running on http://localhost:${env.PORT}`);
}
bootstrap();
