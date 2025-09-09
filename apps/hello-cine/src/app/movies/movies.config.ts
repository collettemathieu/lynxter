import { registerAs } from '@nestjs/config';

export default registerAs('movies', () => ({
  foo: 'bar',
}));
