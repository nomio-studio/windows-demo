import * as opfs from './opfs'
import { BIN_FS } from './tree'

/* Recycle Bin index — $RECYCLE.BIN/index.json records each trashed
 * item's original location and deletion time. */

export interface BinIndex {
  [binName: string]: { path: string[]; deletedAt: number }
}

const BIN_INDEX = [...BIN_FS, 'index.json']

export async function readBinIndex(): Promise<BinIndex> {
  try {
    return JSON.parse(await opfs.readText(BIN_INDEX)) as BinIndex
  } catch {
    return {}
  }
}

export async function writeBinIndex(idx: BinIndex): Promise<void> {
  await opfs.mkdir(BIN_FS)
  await opfs.writeText(BIN_INDEX, JSON.stringify(idx))
}
