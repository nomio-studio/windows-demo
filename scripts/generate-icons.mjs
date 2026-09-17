// Generates all PWA icons into ../public — zero dependencies.
// Run: node scripts/generate-icons.mjs
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public')

// Windows 10 logo: four perspective quads in a 15×16 box (same geometry
// as the favicon in index.html).
const QUADS = [
  [[0, 2.2], [6.5, 1.3], [6.5, 7.3], [0, 8.2]],
  [[7.5, 1.1], [15, 0], [15, 7.5], [7.5, 8.6]],
  [[0, 8.9], [6.5, 8.9], [6.5, 15], [0, 14.1]],
  [[7.5, 9], [15, 9], [15, 16], [7.5, 15.1]],
]
const LOGO_W = 15
const LOGO_H = 16

// ---------------------------------------------------------------- PNG encode
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

const crc32 = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

const chunk = (type, data) => {
  const head = Buffer.alloc(4)
  head.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(td))
  return Buffer.concat([head, td, crc])
}

const encodePng = (size, rgba) => {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ------------------------------------------------------------ rasterisation
const inPoly = (px, py, poly) => {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)
      inside = !inside
  }
  return inside
}

/**
 * Render the logo into an RGBA buffer.
 * `bg = null` produces a transparent icon (straight alpha AA edges);
 * otherwise pixels are composited over the opaque background.
 */
const render = (size, logoFraction, fg, bg) => {
  const SS = 4
  const scale = (size * logoFraction) / LOGO_H
  const ox = (size - LOGO_W * scale) / 2
  const oy = (size - LOGO_H * scale) / 2
  const out = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let covered = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const lx = (x + (sx + 0.5) / SS - ox) / scale
          const ly = (y + (sy + 0.5) / SS - oy) / scale
          if (QUADS.some((q) => inPoly(lx, ly, q))) covered++
        }
      }
      const cov = covered / (SS * SS)
      const i = (y * size + x) * 4
      if (bg) {
        out[i] = Math.round(fg[0] * cov + bg[0] * (1 - cov))
        out[i + 1] = Math.round(fg[1] * cov + bg[1] * (1 - cov))
        out[i + 2] = Math.round(fg[2] * cov + bg[2] * (1 - cov))
        out[i + 3] = 255
      } else {
        out[i] = fg[0]
        out[i + 1] = fg[1]
        out[i + 2] = fg[2]
        out[i + 3] = Math.round(255 * cov)
      }
    }
  }
  return out
}

// ------------------------------------------------------------------ outputs
// Minimalist palette: black logo on a white background.
const INK = [0, 0, 0]
const PAPER = [255, 255, 255]

const write = (rel, buf) => {
  const p = path.join(outDir, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, buf)
  console.log(`wrote public/${rel} (${buf.length} bytes)`)
}

// Vector source of truth (SVG manifest icon + browser favicon):
// black logo centred on a white square with generous padding.
write(
  'icon.svg',
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect width="20" height="20" fill="#fff"/><path fill="#000" transform="translate(2.5 2)" d="M0 2.2 6.5 1.3v6H0zM7.5 1.1 15 0v7.5H7.5zM0 8.9h6.5V15L0 14.1zM7.5 9H15v7l-7.5-1z"/></svg>`,
  ),
)

const jobs = [
  // Any-purpose: install icon, taskbar, app switcher.
  ['icons/icon-192.png', 192, 0.72, INK, PAPER],
  ['icons/icon-512.png', 512, 0.72, INK, PAPER],
  // Maskable: full-bleed white, logo inside the 80% safe zone.
  ['icons/maskable-192.png', 192, 0.48, INK, PAPER],
  ['icons/maskable-512.png', 512, 0.48, INK, PAPER],
  // iOS requires an opaque touch icon.
  ['apple-touch-icon.png', 180, 0.62, INK, PAPER],
  // PNG favicon fallback for older browsers.
  ['favicon-32x32.png', 32, 0.78, INK, PAPER],
]

for (const [rel, size, frac, fg, bg] of jobs) {
  write(rel, encodePng(size, render(size, frac, fg, bg)))
}
