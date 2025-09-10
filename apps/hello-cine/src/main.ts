/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './app/common/filters/http-exception.filter';
import { TimeoutInterceptor } from './app/common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from './app/common/interceptors/wrap-response.interceptor';
import { environment } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: new Logger(),
  });

  const globalPrefix = environment.production === true ? 'api' : '';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor()
  );

  const port = process.env.PORT || 3000;

  const options = new DocumentBuilder()
    .setTitle('Hello Cine API')
    .setDescription('The Hello Cine API description')
    .setVersion('1.0')
    .addTag('hello-cine')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
