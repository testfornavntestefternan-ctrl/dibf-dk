// @ts-check
import { defineConfig } from 'astro/config';

const base = process.env.PUBLIC_BASE || '/';
const site = process.env.PUBLIC_SITE || 'http://localhost:3355';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  server: {
    port: 3355,
    host: true,
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  redirects: {
    '/hvem-er-vi': '/om-os',
    '/bestyrelsen': '/om-os',
    '/gravsted-ejer': '/ved-dodsfald',
    '/billeder': '/gravspladsen',
    '/grav/voksne': '/ved-dodsfald',
    '/grav/fostre': '/ved-dodsfald',
    '/grav/born': '/ved-dodsfald',
  },
});
