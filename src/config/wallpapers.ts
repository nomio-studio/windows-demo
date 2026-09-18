import type { CSSProperties } from 'react'
import type { MessageKey } from '../core/i18n/en'

/* Wallpapers — add an entry here and it appears in
 * Settings > Personalization automatically. */

export interface Wallpaper {
  /** Display name — a message key resolved via `t()`. */
  name: MessageKey
  style: CSSProperties
}

export const wallpapers: Wallpaper[] = [
  {
    name: 'wp.hero',
    style: {
      background:
        'radial-gradient(ellipse 90% 70% at 68% 32%, rgba(80,160,240,0.75), transparent 55%),' +
        'radial-gradient(ellipse 70% 80% at 25% 75%, rgba(10,110,220,0.7), transparent 60%),' +
        'linear-gradient(155deg, #1a5fb4 0%, #0d3e8f 45%, #062a6e 100%)',
    },
  },
  {
    name: 'wp.lake',
    style: {
      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450' preserveAspectRatio='xMidYMid slice'>` +
          `<defs>` +
          `<linearGradient id='s' x1='0' y1='0' x2='0' y2='1'>` +
          `<stop offset='0' stop-color='#0A1834'/><stop offset='.42' stop-color='#1B3A6E'/>` +
          `<stop offset='.75' stop-color='#4570AB'/><stop offset='1' stop-color='#7BA6CE'/>` +
          `</linearGradient>` +
          `<radialGradient id='g'>` +
          `<stop offset='0' stop-color='#FFEDC2' stop-opacity='.9'/>` +
          `<stop offset='.4' stop-color='#F6CD7E' stop-opacity='.35'/>` +
          `<stop offset='1' stop-color='#F6CD7E' stop-opacity='0'/>` +
          `</radialGradient>` +
          `<linearGradient id='w' x1='0' y1='0' x2='0' y2='1'>` +
          `<stop offset='0' stop-color='#3E639B'/><stop offset='1' stop-color='#0A1830'/>` +
          `</linearGradient>` +
          `</defs>` +
          `<rect width='800' height='450' fill='url(#s)'/>` +
          `<g fill='#FFF'>` +
          `<circle cx='80' cy='60' r='1.4' opacity='.7'/><circle cx='200' cy='40' r='1' opacity='.5'/>` +
          `<circle cx='330' cy='80' r='1.2' opacity='.6'/><circle cx='470' cy='50' r='.9' opacity='.45'/>` +
          `<circle cx='620' cy='70' r='1.3' opacity='.6'/><circle cx='720' cy='45' r='1' opacity='.5'/>` +
          `<circle cx='140' cy='120' r='.9' opacity='.4'/><circle cx='560' cy='110' r='1' opacity='.45'/>` +
          `<circle cx='680' cy='140' r='.8' opacity='.4'/><circle cx='270' cy='140' r='.8' opacity='.35'/>` +
          `<circle cx='410' cy='30' r='1.1' opacity='.55'/><circle cx='50' cy='160' r='.9' opacity='.4'/>` +
          `</g>` +
          `<ellipse cx='540' cy='300' rx='290' ry='130' fill='url(#g)'/>` +
          `<circle cx='540' cy='296' r='9' fill='#FFEAB9'/>` +
          `<path d='M0 262 70 236 150 262 235 230 320 264 410 240 500 266 590 234 680 262 760 242 800 258V315H0Z' fill='#4A6A9C' opacity='.8'/>` +
          `<path d='M0 282 95 254 185 284 285 252 375 288 470 258 570 290 660 260 745 288 800 272V325H0Z' fill='#2B4A7C'/>` +
          `<path d='M0 300 110 276 220 304 330 274 445 306 555 280 665 308 755 288 800 302V335H0Z' fill='#14294E'/>` +
          `<rect y='302' width='800' height='148' fill='url(#w)'/>` +
          `<ellipse cx='540' cy='306' rx='140' ry='7' fill='#FFF' opacity='.08'/>` +
          `<g fill='#FFE4A8'>` +
          `<ellipse cx='540' cy='318' rx='90' ry='3.5' opacity='.28'/>` +
          `<ellipse cx='540' cy='335' rx='58' ry='2.8' opacity='.2'/>` +
          `<ellipse cx='540' cy='355' rx='32' ry='2.2' opacity='.14'/>` +
          `</g>` +
          `</svg>`,
      )}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  },
  {
    name: 'wp.midnight',
    style: {
      background:
        'radial-gradient(ellipse 80% 60% at 60% 20%, rgba(80,80,140,0.5), transparent 55%),' +
        'linear-gradient(160deg, #1b1b3a 0%, #12122b 60%, #0a0a1a 100%)',
    },
  },
  {
    name: 'wp.blue',
    style: { background: '#0078D7' },
  },
]
