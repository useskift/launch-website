// @ts-check
import { defineConfig, envField, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://skift.work",

  adapter: cloudflare({
    imageService: "compile",

    platformProxy: {
      enabled: true,
    },
  }),

  integrations: [
    icon({
      include: {
        twemoji: ["flag-sweden", "flag-united-kingdom"],
        "simple-icons": [
          "linkedin",
          "github",
          "x",
          "bluesky",
          "instagram",
          "youtube",
        ],
      },
    }),
    sitemap({
      changefreq: "weekly",
      priority: 1,
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
        forward: ["dataLayer.push", "_hsq.push"],
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  prefetch: {
    defaultStrategy: "viewport",
  },

  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "skift.work",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "sv"],
  },

  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
      TURNSTILE_SITE_KEY: envField.string({
        context: "client",
        access: "public",
      }),
      TURNSTILE_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Geist",
        cssVariable: "--font-geist",
        weights: ["100 900"],
      },
      {
        provider: fontProviders.google(),
        name: "Newsreader",
        cssVariable: "--font-newsreader",
        weights: ["200 800"],
      },
      {
        provider: fontProviders.google(),
        name: "Geist Mono",
        cssVariable: "--font-geist-mono",
        weights: ["400 700"],
      },
    ],

    clientPrerender: true,
    contentIntellisense: true,
  },
});
