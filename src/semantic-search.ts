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

  const searchResults = await typesenseClient.multiSearch.perform({
    searches: [{
      collection: 'documents',
      q: '*',
      vector_query: 'embedding:[' + embedding.join(',') + ']',
      per_page: 5,
    }]
  }) as { results: { hits: any[] }[] };

  console.log('Search results for:', query);
  console.log(searchResults.results[0].hits);
}

// Example search query
const query = process.argv[2] || 'a water body';
semanticSearch(query);
