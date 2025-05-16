import { defineConfig } from 'tsup';

const isProduction = process.env.NODE_ENV === 'production';

console.log('isProduction', process.env.NODE_ENV);

export default defineConfig(options => {
  return {
    entryPoints: ['src/main.ts'],
    minify: isProduction,
    clean: !options.watch,
    format: ['iife', 'esm'],
    external: ['react', 'react-dom'],
    treeshake: true,
    sourcemap: isProduction ? true : 'inline',
    dts: {
      entry: 'src/main.ts',
      resolve: false,
      compilerOptions: {
        composite: false,
      },
    },
    name: 'estate',
    globalName: 'estate',
    outExtension(ctx) {
      if (ctx.format === 'cjs') {
        return {
          js: '.common.cjs',
        };
      } else if (ctx.format === 'iife') {
        return {
          js: '.global.js',
        };
      }
      return {
        js: '.js',
      };
    },
  };
});
