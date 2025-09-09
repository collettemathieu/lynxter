import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { MoviesService } from './movies.service';
import { MOVIES_RELEASE_DATE_TOKEN } from './movies.static';

@ApiTags('movies')
@Controller({
  path: 'movies',
  version: '1',
})
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    @Inject(MOVIES_RELEASE_DATE_TOKEN) moviesReleaseDate: string[]
  ) {
    console.log('Movies Release Date:', moviesReleaseDate);
  }

  @ApiResponse({ status: 200, description: 'Return all movies.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() paginationQuery: { limit: number; offset: number }) {
    const { limit, offset } = paginationQuery;
    console.log(`Limit: ${limit}, Offset: ${offset}`);

    return this.moviesService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Return a movie by ID.' })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.moviesService.findOne(id);
  }

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    console.log(createMovieDto instanceof CreateMovieDto);

    return this.moviesService.create(createMovieDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.moviesService.remove(id);
  }
}
