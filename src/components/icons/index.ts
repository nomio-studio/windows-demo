/*
 * Icon system barrel — keeps `import ... from '../components/icons'`
 * stable while the implementation is split by domain:
 *
 *   glyphs.tsx    Fluent re-export aliases (UI, settings, file-ops, apps)
 *   brand.tsx     hand-drawn brand marks (Windows logo, Edge, Notepad)
 *   resources.tsx Windows resource icons (folder, This PC, bin, drives)
 */
export * from './glyphs'
export * from './brand'
export * from './resources'
