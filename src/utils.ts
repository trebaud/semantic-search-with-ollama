// src/utils.ts
import type { CliArgs } from './types';

export function parseSearchCliArgs(): CliArgs {
  const args = process.argv.slice(2);
  const pretty = args.includes('--pretty');
  const query = args.filter(arg => arg !== '--pretty').join(' ');
  if (!query) {
    throw new Error('Query is required');
  }
  return { query, pretty };
}
