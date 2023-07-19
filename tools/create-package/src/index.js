import path from 'node:path';
import fs from 'fs-extra';
import { resolveToPackages } from './utils';
import { createPackage, createEntry } from './create-package';

/**
 * @typedef {{ name: string; desc?: string; isPrivate: boolean; isNamespace?: boolean }} Option
 * @param {Option} options
 */
function createProject(options) {
  const { name, desc, isPrivate, isNamespace } = options;
  const dir = resolveToPackages(name);
  const namespacedName = isNamespace ? `@breezystack/${name}` : name;

  const pkg = createPackage({
    name: namespacedName,
    description: desc,
    isPrivate,
  });

  const main = createEntry();

  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'package.json'), pkg);
  fs.writeFileSync(path.join(dir, 'main.ts'), main);
}
