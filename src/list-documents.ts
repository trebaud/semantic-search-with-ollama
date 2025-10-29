// src/list-documents.ts
import Typesense from 'typesense';
import { config } from './config';

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: config.typesenseHost,
      port: config.typesensePort,
      protocol: 'http',
    },
  ],
  apiKey: config.typesenseApiKey,
});

async function listDocuments() {
  try {
    const documents = await typesenseClient.collections('documents').documents().export();
    console.log('All indexed documents:');
    console.log(documents);
  } catch (error) {
    console.error('Error listing documents:', error);
  }
}

listDocuments();