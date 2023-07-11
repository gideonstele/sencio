module.exports = {
  'src/**/*.{ts,tsx}': 'pnpm run lint:fix',
  '**/*.ts?(x)': () => 'pnpm run typecheck',
}
