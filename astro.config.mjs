// @ts-check
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import sentry from "@sentry/astro";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://skift.work",

  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },

    imageService: "cloudflare",
  }),

  integrations: [
    sitemap({
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date(),
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          sv: "sv-SE",
        },
      },
    }),
    partytown({
      config: {
        forward: ["fbq", "dataLayer.push", "_hsq.push"],
      },
    }),
    sentry({
      sourceMapsUploadOptions: {
        project: "launch-website",
        org: "skift",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    mdx(),
    icon(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.skift.work",
      },
    ],

    responsiveStyles: true,
    layout: "constrained",
  },

  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },

  i18n: {
    locales: ["en", "sv"],
    defaultLocale: "en",
    fallback: {
      sv: "en",
    },
  },
});
