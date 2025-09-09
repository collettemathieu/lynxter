import { Type } from 'class-transformer';
import { IsArray, IsDate, IsString, ValidateNested } from 'class-validator';
import { CreateActorDto } from './create-actor.dto';

export class CreateMovieDto {
  @IsString()
  title!: string;

  @IsDate()
  @Type(() => Date)
  releaseDate!: Date;

  @Type(() => CreateActorDto)
  @IsArray()
  @ValidateNested()
  actorList!: CreateActorDto[];
}
