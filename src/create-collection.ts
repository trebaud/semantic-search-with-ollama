// src/create-collection.ts
import Typesense from 'typesense';
import { config } from './config';

interface CollectionSchema {
  name: string;
  fields: {
    name: string;
    type: 'string' | 'int32' | 'int64' | 'float' | 'bool' | 'geopoint' | 'string[]' | 'int32[]' | 'int64[]' | 'float[]' | 'bool[]' | 'auto' | 'string*' | 'image';
    num_dim?: number;
  }[];
}

const client = new Typesense.Client({
  nodes: [
    {
      host: config.typesenseHost,
      port: config.typesensePort,
      protocol: 'http',
    },
  ],
  apiKey: config.typesenseApiKey,
});

const schema: CollectionSchema = {
  name: 'documents',
  fields: [
    { name: 'text', type: 'string' },
    { name: 'embedding', type: 'float[]', num_dim: 768 },
  ],
};

async function createCollection() {
  try {
    // Drop collection if it already exists
    await client.collections('documents').delete();
    console.log('Existing collection deleted.');
  } catch (error) {
    // Ignore error if collection does not exist
  }
  await client.collections().create(schema);
  console.log('Collection created successfully.');
}

createCollection();