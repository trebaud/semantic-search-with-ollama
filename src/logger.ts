// src/logger.ts
export function logInfo(message: string, ...args: any[]) {
  console.log(`[INFO] ${message}`, ...args);
}

export function logError(message: string, error?: any) {
  console.error(`[ERROR] ${message}`, error);
}

export function logSuccess(message: string) {
  console.log(`[SUCCESS] ${message}`);
}