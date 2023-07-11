import mustache from 'mustache';
import fs from 'fs-extra';

import { resolveCurrent } from './utils';

/**
 * @typedef {{ name: string; description?: string; isPrivate: boolean; }} Option
 * @param {Option} options
 */
export function createPackage(options) {
  const { name, description, isPrivate } = options;

  const template = fs.readFileSync(resolveCurrent('../templates/package.json.mustache'), 'utf-8');
  return mustache.render(template, { name, description, isPrivate });
}

export function createEntry() {
  const template = fs.readFileSync(resolveCurrent('../templates/main.ts.mustache'), 'utf-8');
  return template;
}
