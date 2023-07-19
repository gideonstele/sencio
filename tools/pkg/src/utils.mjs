import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * @param  {...string} args
 */
export function resolveToPackages(...args) {
  return path.resolve(__dirname, '../../..', 'packages', ...args);
}

/**
 * @param  {...string} args
 */
export function resolveCurrent(...args) {
  return path.resolve(__dirname, ...args);
}
