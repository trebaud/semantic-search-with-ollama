// src/index-documents.ts
import ollama from 'ollama';
import Typesense from 'typesense';
import { config } from './config';
import documents from '../data/corpus';

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
