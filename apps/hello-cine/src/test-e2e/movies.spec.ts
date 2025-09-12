import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateMovieDto } from '../app/movies/dtos/create-movie.dto';
import { MoviesModule } from '../app/movies/movies.module';

describe('[Feature] Movies - /movies', () => {
  let app: INestApplication;

  const movieDto: CreateMovieDto = {
    title: 'Basic instinct',
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

  const newDate = new Date();

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

        expect(body.length).toBeGreaterThan(0);
        expect(body).toEqual([expectedMovie]);
      });
  });

  it('Get one [GET /:id]', () => {
    return request
      .default(app.getHttpServer())
      .get('/movies/1')
      .expect(HttpStatus.OK)
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

  it('Update one [PATCH /:id]', () => {
    return request
      .default(app.getHttpServer())
      .patch('/movies/1')
      .send({
        releaseDate: newDate.toISOString(),
      })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.releaseDate).toEqual(newDate.toISOString());

        return request
          .default(app.getHttpServer())
          .get('/movies/1')
          .then(({ body }) => {
            expect(body.releaseDate).toEqual(newDate.toISOString());
          });
      });
  });

  it('Delete one [DELETE /:id]', () => {
    return request
      .default(app.getHttpServer())
      .delete('/movies/1')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        const expectedMovie = expect.objectContaining({
          ...movieDto,
          releaseDate: newDate.toISOString(),
          actorList: expect.arrayContaining(
            movieDto.actorList.map((actor) =>
              expect.objectContaining({
                ...actor,
              })
            )
          ),
        });

        expect(body).toEqual(expectedMovie);

        return request
          .default(app.getHttpServer())
          .get('/movies/1')
          .expect(HttpStatus.NOT_FOUND);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
