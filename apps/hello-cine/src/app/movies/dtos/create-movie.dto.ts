import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title!: string;

  @IsDate()
  @Type(() => Date)
  releaseDate!: Date;

  @IsString({ each: true })
  actorList!: string[];
}
