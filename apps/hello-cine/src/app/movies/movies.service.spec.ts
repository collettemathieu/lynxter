import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { Actor } from './entities/actors.entity';
import { Movie } from './entities/movies.entity';
import moviesConfig from './movies.config';
import { MoviesService } from './movies.service';

type MockRepository<T extends ObjectLiteral> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

export const createMockRepository = <
  T extends ObjectLiteral
>(): MockRepository<T> => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
  };
};

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: MockRepository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: moviesConfig.KEY,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: createMockRepository<Movie>(),
        },
        {
          provide: getRepositoryToken(Actor),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepository = module.get(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
