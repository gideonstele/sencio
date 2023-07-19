import path from 'node:path';
import fs from 'fs-extra';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { resolveToPackages } from './utils.mjs';
import { createPackage, createEntry } from './create-package.mjs';

/**
 * @typedef {{ name: string; desc?: string; isPrivate: boolean; isNamespace?: boolean }} Option
 * @param {Option} options
 */
function createProject(options) {
  const { name, desc, isPrivate, isNamespace } = options;
  const dir = resolveToPackages(name);
  const namespacedName = isNamespace ? `@breezy\/${name}` : name;

  const pkg = createPackage({
    name: namespacedName,
    description: desc,
    isPrivate,
  });

  const main = createEntry();

  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'package.json'), pkg);
  fs.writeFileSync(path.join(dir, 'src/main.ts'), main);
}

const args = yargs(hideBin(process.argv))
  .command('create <name>', 'create a new package')
  .option('desc', {
    describe: 'package description',
    type: 'string',
  })
  .option('private', {
    describe: 'private package',
    type: 'boolean',
  })
  .option('namespace', {
    describe: 'scoped package',
    type: 'boolean',
  }).argv;

createProject({
  name: args.name,
  desc: args.desc,
  isPrivate: args.private,
  isNamespace: args.namespace,
});
