// src/list-documents.ts
import Typesense from 'typesense';

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: 'localhost',
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: 'xyz',
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