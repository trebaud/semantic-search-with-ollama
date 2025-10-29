// src/index-documents.ts
import ollama from 'ollama';
import { createTypesenseClient } from './client';
import { config } from './config';
import type { Document } from './types';
import { logSuccess } from './logger';
import documents from '../data/corpus';

const typesenseClient = createTypesenseClient();

async function addDocuments(documents: Document[]) {
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
  logSuccess('Documents indexed successfully.');
}

addDocuments(documents);
