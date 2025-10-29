// src/index-documents.ts
import ollama from 'ollama';
import Typesense from 'typesense';
import { config } from './config';

const documents = [
  { text: 'The sky is blue.' },
  { text: 'The ocean is vast and deep.' },
  { text: 'A large, open expanse of water.' },
  { text: 'Birds are flying in the bright blue sky.' },
];

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

async function addDocuments(documents: { text: string }[]) {
  const documentsWithEmbeddings = await Promise.all(
    documents.map(async (doc) => {
      const { embedding } = await ollama.embeddings({
        model: config.embeddingModel,
        prompt: doc.text,
      });
      return { ...doc, embedding };
    })
  );

  await typesenseClient.collections('documents').documents().import(documentsWithEmbeddings);
  console.log('Documents indexed successfully.');
}

addDocuments(documents);
