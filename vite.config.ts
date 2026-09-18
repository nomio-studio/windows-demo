import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const icon = (src: string, sizes: string, purpose?: string) => ({
  src,
  sizes,
  type: 'image/png',
  ...(purpose ? { purpose } : {}),
})

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        id: './',
        name: 'Windows 10 Web',
        short_name: 'Windows 10',
        description:
          'A faithful, fully interactive Windows 10 desktop clone that runs in the browser.',
        lang: 'en',
        dir: 'ltr',
        start_url: './',
        scope: './',
        display: 'standalone',
        theme_color: '#0078D7',
        background_color: '#ffffff',
        categories: ['utilities', 'entertainment', 'personalization'],
        prefer_related_applications: false,
        handle_links: 'preferred',
        launch_handler: { client_mode: 'focus-existing' },
        // `?v=` busts the browser's favicon/app-icon caches (keyed by URL
        // and not cleared with "cached images") — bump when icons change.
        // Workbox strips the param for precache lookup below.
        icons: [
          {
            src: 'icon.svg?v=4',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          icon('icons/icon-192.png?v=4', '192x192', 'any'),
          icon('icons/icon-512.png?v=4', '512x512', 'any'),
          icon('icons/maskable-192.png?v=4', '192x192', 'maskable'),
          icon('icons/maskable-512.png?v=4', '512x512', 'maskable'),
        ],
        shortcuts: [
          {
            name: 'Files',
            url: './?app=explorer',
            icons: [icon('icons/icon-192.png?v=4', '192x192')],
          },
          {
            name: 'Notepad',
            url: './?app=notepad',
            icons: [icon('icons/icon-192.png?v=4', '192x192')],
          },
          {
            name: 'Calculator',
            url: './?app=calculator',
            icons: [icon('icons/icon-192.png?v=4', '192x192')],
          },
          {
            name: 'Settings',
            url: './?app=settings',
            icons: [icon('icons/icon-192.png?v=4', '192x192')],
          },
        ],
        file_handlers: [
          {
            action: './?open=text',
            accept: { 'text/plain': ['.txt', '.md', '.log'] },
          },
        ],
      },
      workbox: {
        // New workers activate on install and claim open pages instead of
        // waiting for the (missable) restart toast — every client converges
        // to the latest deploy on the next navigation.
        skipWaiting: true,
        clientsClaim: true,
        // Icon URLs carry a `?v=` cache-buster; strip it when matching the
        // precache so icons still resolve offline.
        ignoreURLParametersMatching: [/^v$/],
        // Precache every emitted asset — the whole OS works offline.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        // MiSans CDN is version-pinned + immutable — cache it so the zh
        // font keeps working offline after first load.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/misans-webfont/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'misans-fonts',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  base: '/windows-demo/',
})
