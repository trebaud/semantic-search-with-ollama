// src/semantic-search.ts
import ollama from 'ollama';
import Typesense from 'typesense';
import { config } from './config';

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

async function semanticSearch(query: string, pretty: boolean = false) {
  try {
    const { embedding } = await ollama.embeddings({
      model: config.embeddingModel,
      prompt: query,
    });

    console.log('Embedding length:', embedding.length);

    const searchResults = await typesenseClient.multiSearch.perform({
      searches: [{
        collection: 'documents',
        q: '*',
        vector_query: 'embedding:([' + embedding.join(',') + '], k:3, distance_threshold:1.0)',
        per_page: 5,
      }]
    }) as { results: { hits: any[] }[] };

    console.log('Search results for:', query);
    const hits = searchResults.results[0].hits;
    if (pretty) {
      if (hits && hits.length > 0) {
        console.log('Found documents:');
        hits.forEach((hit, index) => {
          console.log(`${index + 1}. ${hit.document.text}`);
        });
      } else {
        console.log('No documents found.');
      }
    } else {
      console.log('Full response:', JSON.stringify(searchResults, null, 2));
      console.log(hits);
    }
  } catch (error) {
    console.error('Error during search:', error);
  }
}

// Example search query
const args = process.argv.slice(2);
const pretty = args.includes('--pretty');
const query = args.filter(arg => arg !== '--pretty').join(' ') || 'a water body';
semanticSearch(query, pretty);
