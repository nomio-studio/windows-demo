/* Wi-Fi networks — shared by the tray flyout and Settings > Wi-Fi. */

export interface WifiNetwork {
  ssid: string
  /** 0-4 bars. */
  signal: 0 | 1 | 2 | 3 | 4
  secured: boolean
}

export const wifiNetworks: WifiNetwork[] = [
  { ssid: 'HomeNet-5G', signal: 4, secured: true },
  { ssid: 'HomeNet-2.4G', signal: 3, secured: true },
  { ssid: 'CoffeeShop_Guest', signal: 2, secured: false },
  { ssid: 'Neighbor-WiFi', signal: 1, secured: true },
  { ssid: 'TP-Link_A8F3', signal: 1, secured: true },
]
