import { pathToFileURL } from 'node:url';

const __dirname = path.dirname(pathToFileURL(import.meta.url).pathname);

/**
 * @param  {...string} args
 */
export function resolveToPackages(...args) {
  return path.resolve(__dirname, '..', '..', 'packages', ...args);
}

/**
 * @param  {...string} args
 */
export function resolveCurrent(...args) {
  return path.resolve(__dirname, ...args);
}
