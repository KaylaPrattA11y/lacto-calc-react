// @ts-check
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: 'https://kaylapratta11y.github.io',
  base: '/lacto-calc-react',
});