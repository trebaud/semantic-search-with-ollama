// src/create-collection.ts
import { createTypesenseClient } from './client';
import { logInfo, logSuccess, logError } from './logger';

interface CollectionSchema {
  name: string;
  fields: {
    name: string;
    type: 'string' | 'int32' | 'int64' | 'float' | 'bool' | 'geopoint' | 'string[]' | 'int32[]' | 'int64[]' | 'float[]' | 'bool[]' | 'auto' | 'string*' | 'image';
    num_dim?: number;
  }[];
}

const client = createTypesenseClient();

const schema: CollectionSchema = {
  name: 'documents',
  fields: [
    { name: 'text', type: 'string' },
    { name: 'embedding', type: 'float[]', num_dim: 768 },
  ],
};

async function createCollection(collectionSchema: CollectionSchema) {
  try {
    // Drop collection if it already exists
    await client.collections(collectionSchema.name).delete();
    logInfo('Existing collection deleted.');
  } catch (error) {
    // Ignore error if collection does not exist
  }
  try {
    await client.collections().create(collectionSchema);
    logSuccess('Collection created successfully.');
  } catch (error) {
    logError('Error creating collection:', error);
  }
}

createCollection(schema);