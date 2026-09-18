import type { FsNode } from '../../core/fs/tree'
import type { ContextMenuItem } from '../../core/store/system'

export type SortKey = 'name' | 'modified' | 'type' | 'size'
export type ViewMode = 'details' | 'icons'

export interface MenuState {
  x: number
  y: number
  items: ContextMenuItem[]
}

export type Dialog =
  | { kind: 'props'; node: FsNode }
  | { kind: 'move'; node: FsNode }
  | null
