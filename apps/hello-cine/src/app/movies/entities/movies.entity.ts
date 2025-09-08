export class Movie {
  id!: number;
  title!: string;
  releaseDate!: Date;
  actorList!: string[];
}
//Use the format RFC 3339 to generate a date with a timezone.
//Example: 2023-10-05T14:48:00.000Z
//https://www.ietf.org/rfc/rfc3339.txt
