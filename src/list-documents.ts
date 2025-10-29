// src/list-documents.ts
import { createTypesenseClient } from './client';
import { logInfo, logError } from './logger';

const typesenseClient = createTypesenseClient();

async function listDocuments() {
  try {
    const documents = await typesenseClient.collections('documents').documents().export();
    logInfo('All indexed documents:');
    logInfo(documents);
  } catch (error) {
    logError('Error listing documents:', error);
  }
}

listDocuments();