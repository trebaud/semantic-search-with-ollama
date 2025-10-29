// src/list-documents.ts
import { createTypesenseClient } from './client';
import { logInfo, logError } from './logger';
import { config } from './config';

const typesenseClient = createTypesenseClient();

async function listDocuments() {
  try {
    const documents = await typesenseClient.collections(config.collectionName).documents().export();
    logInfo('All indexed documents:');
    logInfo(documents);
  } catch (error) {
    logError('Error listing documents:', error);
  }
}

listDocuments();