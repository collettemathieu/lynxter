import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { Movie } from './entities/movies.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [
    {
      id: 1,
      title: 'Inception',
      releaseDate: new Date('2010-07-16T00:00:00.000Z'),
      actorList: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
    },
    {
      id: 2,
      title: 'The Matrix',
      releaseDate: new Date('1999-03-31T00:00:00.000Z'),
      actorList: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    },
    {
      id: 3,
      title: 'Interstellar',
      releaseDate: new Date('2014-11-07T00:00:00.000Z'),
      actorList: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    },
  ];

  findAll() {
    return this.movies;
  }

  findOne(id: string) {
    const movie = this.movies.find((movie) => movie.id === parseInt(id, 10));

    if (movie === undefined || movie === null) {
      //   throw new HttpException(`Movie with ID ${id} not found`, 404);

      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  create(createMovieDto: CreateMovieDto) {
    this.movies.push(createMovieDto as Movie);
    return createMovieDto;
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    const movieIndex = this.movies.findIndex(
      (movie) => movie.id === parseInt(id, 10)
    );
    if (movieIndex === -1) {
      return null;
    }
    this.movies[movieIndex] = { ...this.movies[movieIndex], ...updateMovieDto };
    return this.movies[movieIndex];
  }

  remove(id: string) {
    const movieIndex = this.movies.findIndex(
      (movie) => movie.id === parseInt(id, 10)
    );
    if (movieIndex === -1) {
      return null;
    }
    const removedMovie = this.movies.splice(movieIndex, 1);
    return removedMovie[0];
  }
}
