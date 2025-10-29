// src/semantic-search.ts
import ollama from 'ollama';
import { createTypesenseClient } from './client';
import { config } from './config';
import type { SearchResult } from './types';
import { logInfo, logError } from './logger';
import { parseSearchCliArgs } from './utils';

const typesenseClient = createTypesenseClient();

async function generateEmbedding(query: string): Promise<number[]> {
  const { embedding } = await ollama.embeddings({
    model: config.embeddingModel,
    prompt: query,
  });
  return embedding;
}

async function performSearch(embedding: number[]): Promise<SearchResult> {
  const searchResults = await typesenseClient.multiSearch.perform({
    searches: [{
      collection: 'documents',
      q: '*',
      vector_query: `embedding:([${embedding.join(',')}], k:3, distance_threshold:1.0)`,
      per_page: 5,
    }]
  });
  return searchResults;
}

function displayResults(query: string, searchResults: SearchResult, pretty: boolean) {
  logInfo(`Search results for: ${query}`);
  const hits = searchResults.results[0].hits;
  if (pretty) {
    if (hits && hits.length > 0) {
      logInfo('Found documents:');
      hits.forEach((hit: any, index: number) => {
        logInfo(`${index + 1}. ${hit.document.text}`);
      });
    } else {
      logInfo('No documents found.');
    }
  } else {
    logInfo('Full response:', JSON.stringify(searchResults, null, 2));
    logInfo('Hits:', hits);
  }
}

async function semanticSearch(query: string, pretty: boolean = false) {
  try {
    const embedding = await generateEmbedding(query);
    logInfo(`Embedding length: ${embedding.length}`);

    const searchResults = await performSearch(embedding);
    displayResults(query, searchResults, pretty);
  } catch (error) {
    logError('Error during search:', error);
  }
}

const { query, pretty } = parseSearchCliArgs();
semanticSearch(query, pretty);
