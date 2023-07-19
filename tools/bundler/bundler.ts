import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import tailwindcss from 'tailwindcss';
import { UserConfigExport } from 'vite';
import { name } from './package.json';

interface Options {
  css?: boolean;
  externals?: string[];
}

export const createConfig = async (
  entry: string,
  options?: Options,
): Promise<UserConfigExport> => {
  const externals = options?.externals || [];

  const css = options?.css
    ? {
        postcss: {
          plugins: [tailwindcss],
        },
      }
    : undefined;

  const cfg: UserConfigExport = {
    plugins: [
      react.default(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    css: css as any,
    build: {
      lib: {
        entry: path.resolve(entry, 'src/main.ts'),
        name,
        formats: ['es', 'umd'],
        fileName: format => `${name}.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'tailwindcss', ...externals],
        // output: {
        //   globals: {
        //     react: 'React',
        //     'react-dom': 'ReactDOM',
        //     tailwindcss: 'tailwindcss',
        //   },
        // },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  };

  return defineConfig(cfg);
};
