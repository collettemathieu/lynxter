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
import { Protocol } from '../common/decorators/protocol.decorator';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { MoviesService } from './movies.service';
import { MOVIES_RELEASE_DATE_TOKEN } from './movies.static';

@ApiTags('movies')
// @UsePipes(
//   new ValidationPipe({
//     whitelist: true,
//     forbidNonWhitelisted: true,
//     transform: true,
//   })
// )
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
  // @UsePipes(new ValidationPipe({ transform: true }))
  // @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: { limit: number; offset: number }
  ) {
    const { limit, offset } = paginationQuery;
    console.log(`Limit: ${limit}, Offset: ${offset}`);

    console.log({ protocol });

    return this.moviesService.findAll();
    // return of(this.moviesService.findAll()).pipe(delay(5000));
  }

  @ApiResponse({ status: 200, description: 'Return a movie by ID.' })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    console.log(createMovieDto instanceof CreateMovieDto);

    return this.moviesService.create(createMovieDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }
}
