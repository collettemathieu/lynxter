export default () => ({
  user: {
    name: process.env.USER_NAME || 'user',
  },
  database: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT ?? '', 10) || 5432,
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'secret',
    dbName: process.env.POSTGRES_DB || 'postgres',
  },
});
