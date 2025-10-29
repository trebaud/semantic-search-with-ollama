An effective way to use Ollama and Typesense together with TypeScript is to generate vector embeddings with a local Ollama model and then store and search them using Typesense
. Both services provide official client libraries for TypeScript/JavaScript, which simplifies the integration process. 
Step 1: Install and set up dependencies 
First, ensure you have Ollama and Typesense running locally or hosted on a server. Then, set up your TypeScript project and install the necessary dependencies using Bun.js. 

```
# Initialize a new Node.js project
bun init -y

# Install TypeScript, the Ollama client, and the Typesense client
bun install --save-dev typescript @types/node
bun install ollama typesense

```

Step 2: Create a Typesense collection 
Before you can store embeddings, you need to create a collection in Typesense that includes a float[] field to hold the vector embeddings

```typescript
// src/create-collection.ts
import Typesense from 'typesense';

const client = new Typesense.Client({
  nodes: [
    {
      host: 'localhost', // or your Typesense host
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: 'xyz', // your Typesense API key
});

const schema = {
  name: 'documents',
  fields: [
    { name: 'text', type: 'string' },
    { name: 'embedding', type: 'float[]' },
  ],
};

async function createCollection() {
  try {
    // Drop collection if it already exists
    await client.collections('documents').delete();
    console.log('Existing collection deleted.');
  } catch (error) {
    // Ignore error if collection does not exist
  }
  await client.collections().create(schema);
  console.log('Collection created successfully.');
}

createCollection();
```


Step 3: Generate embeddings with Ollama 
Use the Ollama client to generate vector embeddings from your text. The ollama.embeddings() function makes this process straightforward.

Step 4: Index documents with embeddings in Typesense
Combine the previous steps to process your documents. First, generate an embedding for each document using Ollama, and then index the documents with their corresponding embeddings in your Typesense collection.

```typescript
// src/index-documents.ts
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

async function addDocuments(documents: { text: string }[]) {
  const documentsWithEmbeddings = await Promise.all(
    documents.map(async (doc) => {
      const { embedding } = await ollama.embeddings({
        model: 'nomic-embed-text',
        prompt: doc.text,
      });
      return { ...doc, embedding };
    })
  );

  await typesenseClient.collections('documents').documents().import(documentsWithEmbeddings);
  console.log('Documents indexed successfully.');
}

// Example documents
const documents = [
  { text: 'The sky is blue.' },
  { text: 'The ocean is vast and deep.' },
  { text: 'A large, open expanse of water.' },
  { text: 'Birds are flying in the bright blue sky.' },
];

addDocuments(documents);
```

Step 5: Perform semantic search
With your documents and their embeddings indexed in Typesense, you can perform semantic searches. Generate an embedding for a user's query and then use Typesense's vector search to find the most semantically similar documents.

```typescript
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
    model: 'nomic-embed-text',
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
```
