// @ts-check
import { defineConfig } from 'astro/config';

const base = process.env.PUBLIC_BASE || '/';
const site = process.env.PUBLIC_SITE || 'http://localhost:3355';

export default defineConfig({
  site,
  base,
  server: {
    port: 3355,
    host: true,
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
