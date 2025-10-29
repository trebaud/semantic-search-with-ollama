// src/config.ts
export const config = {
  embeddingModel: process.env.EMBEDDING_MODEL || 'nomic-embed-text',
  typesenseHost: process.env.TYPESENSE_HOST || 'localhost',
  typesensePort: parseInt(process.env.TYPESENSE_PORT || '8108'),
  typesenseApiKey: process.env.TYPESENSE_API_KEY || 'xyz',
  collectionName: process.env.COLLECTION_NAME || 'semantic_search_documents',
};