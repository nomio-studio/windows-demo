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
        orientation: 'landscape',
        theme_color: '#0078D7',
        background_color: '#000000',
        categories: ['utilities', 'entertainment', 'personalization'],
        prefer_related_applications: false,
        handle_links: 'preferred',
        launch_handler: { client_mode: 'focus-existing' },
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          icon('icons/icon-192.png', '192x192', 'any'),
          icon('icons/icon-512.png', '512x512', 'any'),
          icon('icons/maskable-192.png', '192x192', 'maskable'),
          icon('icons/maskable-512.png', '512x512', 'maskable'),
        ],
        shortcuts: [
          {
            name: 'File Explorer',
            url: './?app=explorer',
            icons: [icon('icons/icon-192.png', '192x192')],
          },
          {
            name: 'Notepad',
            url: './?app=notepad',
            icons: [icon('icons/icon-192.png', '192x192')],
          },
          {
            name: 'Calculator',
            url: './?app=calculator',
            icons: [icon('icons/icon-192.png', '192x192')],
          },
          {
            name: 'Settings',
            url: './?app=settings',
            icons: [icon('icons/icon-192.png', '192x192')],
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
        // Precache every emitted asset — the whole OS works offline.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
      },
    }),
  ],
  base: '/windows-demo/',
})
