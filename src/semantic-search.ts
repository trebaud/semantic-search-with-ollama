// src/semantic-search.ts
import ollama from 'ollama';
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

async function semanticSearch(query: string) {
  const { embedding } = await ollama.embeddings({
    model: 'embeddinggemma',
    prompt: query,
  });

  const searchResults = await typesenseClient.collections('documents').documents().search({
    q: '*',
    vector_query: 'embedding:[' + embedding.join(',') + ']',
    per_page: 5,
  });

  console.log('Search results for:', query);
  console.log(searchResults.hits);
}

// Example search query
semanticSearch('a water body');
