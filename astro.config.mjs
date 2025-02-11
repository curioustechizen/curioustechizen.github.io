import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
    site: 'https://kiranrao.in',
    markdown: {
        shikiConfig: {
            themes: {
                light: 'github-light',
                dark: 'github-dark',
            },
        }
    },
    integrations: [
        expressiveCode(),
        mdx(), 
        sitemap(), 
        tailwind({
            applyBaseStyles: false
        })
    ],
    redirects: {
        "/blog/tags/[slug]/[...page]": "/tags/[slug]/[...page]"
    }
});