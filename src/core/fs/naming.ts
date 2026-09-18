import * as opfs from './opfs'
import { BIN_FS, extOf, resolveChain, type FsNode } from './tree'

/* Path translation and collision-free naming helpers. */

/**
 * fsPath of a UI path — null when the node is purely virtual or the
 * path doesn't fully resolve (an ancestor's fsPath would be wrong).
 */
export function fsPathOf(
  roots: Record<string, FsNode>,
  uiPath: string[],
): string[] | null {
  if (uiPath[0] === 'Recycle Bin') return uiPath.length === 1 ? [...BIN_FS] : null
  const chain = resolveChain(roots, uiPath)
  if (chain.length !== uiPath.length) return null
  return chain[chain.length - 1].fsPath ?? null
}

/** "Report.docx" -> "Report (2).docx" when the name is taken. */
export async function uniqueName(dir: string[], name: string): Promise<string> {
  if (!(await opfs.exists([...dir, name]))) return name
  const ext = extOf(name)
  const base = ext ? name.slice(0, -(ext.length + 1)) : name
  const suffix = ext ? `.${ext}` : ''
  for (let i = 2; ; i++) {
    const candidate = `${base} (${i})${suffix}`
    if (!(await opfs.exists([...dir, candidate]))) return candidate
  }
}

/** "Report.docx" -> "Report - Copy.docx" (paste-collision style). */
export async function copyName(dir: string[], name: string): Promise<string> {
  if (!(await opfs.exists([...dir, name]))) return name
  const ext = extOf(name)
  const base = ext ? name.slice(0, -(ext.length + 1)) : name
  const suffix = ext ? `.${ext}` : ''
  const candidate = `${base} - Copy${suffix}`
  if (!(await opfs.exists([...dir, candidate]))) return candidate
  return uniqueName(dir, `${base} - Copy${suffix}`)
}

export const INVALID_NAME = /[\\/:*?"<>|]/
