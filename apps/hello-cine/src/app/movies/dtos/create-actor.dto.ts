import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateActorDto {
  @ApiProperty({
    description: 'The firstname of the actor',
    example: 'Robert',
  })
  @IsString()
  firstname!: string;

  @ApiProperty({
    description: 'The lastname of the actor',
    example: 'Downey Jr.',
  })
  @IsString()
  lastname!: string;

  @ApiProperty({
    description: 'The nickname of the actor',
    example: '',
  })
  @IsString()
  nickname!: string;

  @ApiProperty({
    description: 'The age of the actor',
    example: 58,
  })
  @IsNumber()
  @Type(() => Number)
  age!: number;
}
