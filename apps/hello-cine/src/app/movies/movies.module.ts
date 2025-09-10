import { Injectable, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { Actor } from './entities/actors.entity';
import { Movie } from './entities/movies.entity';
import moviesConfig from './movies.config';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import {
  MOVIES_RELEASE_DATE,
  MOVIES_RELEASE_DATE_TOKEN,
} from './movies.static';

@Injectable()
export class MoviesReleaseDateFactory {
  create() {
    return MOVIES_RELEASE_DATE;
  }
}

@Module({
  imports: [
    CommonModule,
    ConfigModule.forFeature(moviesConfig),
    TypeOrmModule.forFeature([Movie, Actor]),
    // DataBaseModule.register({
    //   type: 'postgres',
    //   host: process.env.POSTGRES_HOST,
    //   port: parseInt(process.env.POSTGRES_PORT ?? '', 10) || 5432,
    //   username: process.env.POSTGRES_USER,
    //   password: process.env.POSTGRES_PASSWORD,
    //   database: process.env.POSTGRES_DB,
    // }),
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    MoviesReleaseDateFactory,
    {
      provide: MOVIES_RELEASE_DATE_TOKEN,
      useFactory: (moviesReleaseDateFactory: MoviesReleaseDateFactory) => {
        return moviesReleaseDateFactory.create();
      },
      inject: [MoviesReleaseDateFactory],
    },
    // {
    //   provide: DATA_SOURCE,
    //   useFactory: async () => {
    //     const dataSource = new DataSource({
    //       type: 'postgres',
    //       host: process.env.POSTGRES_HOST,
    //       port: parseInt(process.env.POSTGRES_PORT ?? '', 10) || 5432,
    //       username: process.env.POSTGRES_USER,
    //       password: process.env.POSTGRES_PASSWORD,
    //       database: process.env.POSTGRES_DB,
    //     });

    //     await dataSource.initialize();

    //     return dataSource;
    //   },
    // },
    // {
    //   provide: 'testToken',
    //   useFactory: async (dataSource: DataSource) => {
    //     const actors = await dataSource.query('SELECT * FROM actor');
    //     console.log('Actors:', actors);

    //     return actors;
    //   },
    //   inject: [DATA_SOURCE],
    // },

    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: false,
        }),
    },
  ],
  exports: [MoviesService],
})
export class MoviesModule {}
