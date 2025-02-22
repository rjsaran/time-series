import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'pg';

import { configuration } from '../config/configuration';

async function createDatabase() {
  const app = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({ load: [configuration] })
  );
  const configService = app.get(ConfigService);

  const databaseName = configService.get<string>('database.postgres.db');

  const dbConfig = {
    user: configService.get<string>('database.postgres.username'),
    password: configService.get<string>('database.postgres.password'),
    host: configService.get<string>('database.postgres.host'),
    port: configService.get<number>('database.postgres.port'),
    database: 'postgres', // Connect to default DB
  };

  const client = new Client(dbConfig);

  await client.connect();

  const result = await client.query(
    `SELECT 1 FROM pg_database WHERE datname='${databaseName}'`
  );

  if (result.rowCount === 0) {
    console.log(`Database "${databaseName}" does not exist. Creating...`);
    await client.query(`CREATE DATABASE ${databaseName}`);
    console.log(`Database "${databaseName}" created.`);
  } else {
    console.log(`Database "${databaseName}" already exists.`);
  }

  await client.end();

  await app.close();
}

async function setupDatabase() {
  await createDatabase();
}

setupDatabase()
  .then(() => console.log('Database setup and seeding completed.'))
  .catch((err) => {
    console.error('Database setup failed:', err);
    process.exit(1);
  });
