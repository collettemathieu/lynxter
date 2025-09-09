import { Module, Scope } from '@nestjs/common';
import { ConnectionOptions, DataSource } from 'typeorm';
import { DATA_SOURCE } from './movies/movies.static';

@Module({})
export class DataBaseModule {
  static register(options: ConnectionOptions) {
    return {
      module: DataBaseModule,
      providers: [
        {
          provide: DATA_SOURCE,
          useFactory: async () => {
            const dataSource = new DataSource(options);

            await dataSource.initialize();

            return dataSource;
          },
          Scope: Scope.REQUEST,
        },
      ],
    };
  }
}
