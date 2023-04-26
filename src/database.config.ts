import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = new Sequelize(`postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`);