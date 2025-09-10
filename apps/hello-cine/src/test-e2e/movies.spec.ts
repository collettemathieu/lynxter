import { Test, TestingModule } from '@nestjs/testing';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateMovieDto } from '../app/movies/dtos/create-movie.dto';
import { MoviesModule } from '../app/movies/movies.module';

describe('[Feature] Movies - /movies', () => {
  let app: INestApplication;

  const movieDto: CreateMovieDto = {
    title: 'Basic Instinct',
    releaseDate: new Date('2023-03-03T08:04:15.863Z'),
    actorList: [
      {
        firstname: 'Mickael',
        lastname: 'Douglas',
        age: 50,
        nickname: 'mdouglas',
      },
      {
        firstname: 'Sharon',
        lastname: 'Stone',
        age: 45,
        nickname: 'sstone',
      },
    ],
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MoviesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'admin',
          password: 'secret',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = module.createNestApplication();

    await app.init();
  });

  it('Create [POST /]', () => {
    return request
      .default(app.getHttpServer())
      .post('/movies')
      .send(movieDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        const expectedMovie = expect.objectContaining({
          ...movieDto,
          releaseDate: movieDto.releaseDate.toISOString(),
          actorList: expect.arrayContaining(
            movieDto.actorList.map((actor) =>
              expect.objectContaining({
                ...actor,
              })
            )
          ),
        });

        expect(body).toEqual(expectedMovie);
      });
  });

  it('Get all [GET /]', () => {
    return request
      .default(app.getHttpServer())
      .get('/movies')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
      });
  });
});
