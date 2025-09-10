import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MoviesController } from '../movies/movies.controller';
import { ApiKeyGuard } from './guards/api-key.guard';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { PublicMiddleware } from './middlewares/public.middleware';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggingMiddleware).forRoutes('*');
    consumer.apply(LoggingMiddleware).forRoutes(
      //   { path: 'movies', method: RequestMethod.GET },
      //   {
      //     path: 'movies{/*splat}',
      //     method: RequestMethod.GET,
      //   }

      MoviesController
    );

    consumer.apply(PublicMiddleware).forRoutes(MoviesController);
  }
}
