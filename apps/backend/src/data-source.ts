import { DataSource } from 'typeorm';
import { BitcoinPrice } from './entities/BitcoinPrice';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.resolve(__dirname, '../database.sqlite'),
  // This would be false in production
  // Should be handled by migrations in production
  synchronize: true,
  logging: false,
  entities: [BitcoinPrice],
  // Migrations would be handled by the migrations folder in production
  migrations: [],
  subscribers: [],
}); 