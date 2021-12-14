import { createRequire } from 'module';

// because shitty ESM doesn't support JSON
export const requireGood = createRequire(import.meta.url);
