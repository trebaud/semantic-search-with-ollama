// src/types.ts
export interface Document {
  text: string;
  embedding?: number[];
}

export interface SearchHit {
  document: Document;
}

export interface SearchResult {
  results: {
    hits: SearchHit[];
  }[];
}
