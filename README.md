# Semantic Search with Ollama & Typesense

🚀 A blazing-fast TypeScript project for semantic search using Ollama embeddings and Typesense vector database.

## Prerequisites

- [Ollama](https://ollama.ai/) running locally with `nomic-embed-text` model
- [Typesense](https://typesense.org/) server running on `localhost:8108`

## Installation

```bash
bun install
```

## Usage

### Setup
Create collection and index sample documents:
```bash
bun run setup
```

### Search
Perform semantic search:
```bash
bun search <query>

bun search <query> --pretty
```

### Other Commands
- `bun run create-collection` - Create Typesense collection
- `bun run index-documents` - Index documents with embeddings
- `bun run list-documents` - List indexed documents

Built with [Bun](https://bun.sh) for speed.
