import { config } from 'dotenv';
import { App } from './app';

config();

const app = new App();

if (!process.env.PUBLISHED_PORT || Number.isNaN(Number(process.env.PUBLISHED_PORT))) {
  throw new Error('PUBLISHED_PORT is undefined or not a number.');
}

if (process.argv.includes('--multimode')) {
  app.listenMultiPortApplication(Number(process.env.PUBLISHED_PORT));
} else {
  app.listenApplication(Number(process.env.PUBLISHED_PORT));
}
