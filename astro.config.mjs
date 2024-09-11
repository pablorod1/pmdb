import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/static'; // O @astrojs/vercel/serverless

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind(), react()],
  adapter: vercel(), // Añade el adaptador aquí
});
