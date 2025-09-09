import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActorDto } from './dtos/create-actor.dto';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { Actor } from './entities/actors.entity';
import { Movie } from './entities/movies.entity';
import moviesConfig from './movies.config';

@Injectable({
  scope: Scope.DEFAULT,
})
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>, // @Inject(DATA_SOURCE) private readonly dataSource: DataSource
    // private readonly configService: ConfigService,
    @Inject(moviesConfig.KEY)
    private readonly moviesConfiguration: ConfigType<typeof moviesConfig>
  ) {
    // console.log('Data Source is initialized:', this.dataSource.isInitialized);
    // console.log('MoviesService instance created');

    // console.log(
    //   'Database Host:',
    //   this.configService.get<string>('POSTGRES_HOST')
    // );

    // console.log('user', this.configService.get<string>('user.name'));

    console.log('Movies Config - foo:', this.moviesConfiguration.foo);
  }

  findAll() {
    return this.movieRepository.find({
      relations: ['actorList'],
    });
  }

  async findOne(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['actorList'],
    });

    if (movie === undefined || movie === null) {
      //   throw new HttpException(`Movie with ID ${id} not found`, 404);

      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async create(createMovieDto: CreateMovieDto) {
    const actorList = await Promise.all(
      createMovieDto.actorList.map((actor) =>
        this.preloadActorByNickname(actor)
      )
    );

    const movie = this.movieRepository.create({ ...createMovieDto, actorList });

    return this.movieRepository.save(movie);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const newActorList =
      updateMovieDto.actorList === undefined
        ? undefined
        : await Promise.all(
            updateMovieDto.actorList.map((actor) =>
              this.preloadActorByNickname(actor)
            )
          );

    const movie = await this.movieRepository.preload({
      id,
      ...updateMovieDto,
      ...(newActorList === undefined ? {} : { actorList: newActorList }),
    });

    if (movie === undefined || movie === null) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return this.movieRepository.save(movie);
  }

  async remove(id: number) {
    const movie = await this.findOne(id);

    return this.movieRepository.remove(movie);
  }

  private async preloadActorByNickname(createActorDto: CreateActorDto) {
    const actor = await this.actorRepository.findOne({
      where: { nickname: createActorDto.nickname },
    });

    if (actor !== undefined && actor !== null) {
      return actor;
    }

    return this.actorRepository.create(createActorDto);
  }
}
