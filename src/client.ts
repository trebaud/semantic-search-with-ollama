// src/client.ts
import Typesense from 'typesense';
import { config } from './config';

export function createTypesenseClient(): any {
  return new Typesense.Client({
    nodes: [
      {
        host: config.typesenseHost,
        port: config.typesensePort,
        protocol: 'http',
      },
    ],
    apiKey: config.typesenseApiKey,
  });
}