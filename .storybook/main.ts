import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { mergeConfig } from 'vite';

const dir = fileURLToPath(new URL('.', import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: ['msw-storybook-addon'],
  framework: { name: '@storybook/react-vite', options: {} },
  staticDirs: ['../public'],
  viteFinal: (viteConfig, { configType }) =>
    mergeConfig(viteConfig, {
      base: configType === 'PRODUCTION' ? '/no-title-yeonu-kim/' : '/',
      plugins: [tailwindcss()],
      resolve: { alias: { '@': path.resolve(dir, '../src') } },
    }),
};

export default config;
