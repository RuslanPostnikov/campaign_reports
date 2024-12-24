import { DataSource } from 'typeorm';
import configuration from './config/configuration';

const { database } = configuration();

export default new DataSource({
  type: 'postgres',
  host: database.host,
  port: database.port,
  username: database.username,
  password: database.password,
  database: database.name,
  synchronize: false,
  logging: 'all',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['scripts/migrations/*.ts'],
});
