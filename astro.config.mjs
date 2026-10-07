// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // La page Programme a été supprimée : les anciens liens (favoris, Google) mènent aux tarifs
  redirects: {
    '/programme': '/tarifs',
  },
});
