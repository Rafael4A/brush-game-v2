import { config } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
config();

export const dbdatasource: DataSourceOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [`${__dirname}/**/*.entity{.js,.ts}`],
  migrations: [`${__dirname}/migrations/{*.ts,*.js}`],
  migrationsRun: true,
  synchronize: false,
};

const dataSource = new DataSource(dbdatasource);
export default dataSource;
