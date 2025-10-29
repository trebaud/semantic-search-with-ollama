// src/create-collection.ts
import Typesense from 'typesense';

interface CollectionSchema {
  name: string;
  fields: {
    name: string;
    type: 'string' | 'int32' | 'int64' | 'float' | 'bool' | 'geopoint' | 'string[]' | 'int32[]' | 'int64[]' | 'float[]' | 'bool[]' | 'auto' | 'string*' | 'image';
  }[];
}

const client = new Typesense.Client({
  nodes: [
    {
      host: 'localhost', // or your Typesense host
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: 'xyz', // your Typesense API key
});

const schema: CollectionSchema = {
  name: 'documents',
  fields: [
    { name: 'text', type: 'string' },
    { name: 'embedding', type: 'float[]' },
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