export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl:
      process.env.DB_SSL_MODE === 'require'
        ? {
            rejectUnauthorized: false,
          }
        : false,
  },
  externalApi: {
    fakestoreUrl: process.env.FAKESTORE_API_URL,
  },
});
