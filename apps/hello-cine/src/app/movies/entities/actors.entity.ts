import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Movie } from './movies.entity';

@Entity()
export class Actor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstname!: string;

  @Column()
  lastname!: string;

  @Column()
  nickname!: string;

  @Column()
  age!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @VersionColumn({ default: 1 })
  version!: number;

  @ManyToMany((type) => Movie, (movie) => movie.actorList)
  movieList!: Movie[];
}
//Use the format RFC 3339 to generate a date with a timezone.
//Example: 2023-10-05T14:48:00.000Z
//https://www.ietf.org/rfc/rfc3339.txt
