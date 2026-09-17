/**
 * Thin async wrapper over the Origin Private File System
 * (`navigator.storage.getDirectory()`). Every OPFS path used by the
 * app is an array of segments relative to the OPFS root — the root
 * itself mirrors `C:\`.
 *
 * All APIs are the async (non-Worker) flavor, which every modern
 * browser ships; when the API is missing `supported` is false and the
 * store degrades to a read-only seeded tree.
 */

export const supported =
  typeof navigator !== 'undefined' && !!navigator.storage?.getDirectory

let rootP: Promise<FileSystemDirectoryHandle> | null = null

function root(): Promise<FileSystemDirectoryHandle> {
  rootP ??= navigator.storage.getDirectory()
  return rootP
}

export interface FsEntry {
  name: string
  kind: 'file' | 'directory'
  /** Byte size — 0 for directories. */
  size: number
  modified: Date | null
}

/** Directory async iteration — missing from this project's DOM lib. */
type DirWithEntries = FileSystemDirectoryHandle & {
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>
}

async function dirHandle(
  path: string[],
  create = false,
): Promise<FileSystemDirectoryHandle> {
  let dir = await root()
  for (const seg of path) dir = await dir.getDirectoryHandle(seg, { create })
  return dir
}

/** Child entries of `path`, sorted directories-first then by name. */
export async function list(path: string[]): Promise<FsEntry[]> {
  const dir = await dirHandle(path)
  const out: FsEntry[] = []
  for await (const [name, handle] of (dir as DirWithEntries).entries()) {
    if (handle.kind === 'directory') {
      out.push({ name, kind: 'directory', size: 0, modified: null })
    } else {
      const f = await (handle as FileSystemFileHandle).getFile()
      out.push({
        name,
        kind: 'file',
        size: f.size,
        modified: new Date(f.lastModified),
      })
    }
  }
  out.sort((a, b) =>
    a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'directory' ? -1 : 1,
  )
  return out
}

export async function readText(path: string[]): Promise<string> {
  const dir = await dirHandle(path.slice(0, -1))
  const fh = await dir.getFileHandle(path[path.length - 1])
  return (await fh.getFile()).text()
}

export async function writeText(path: string[], text: string): Promise<void> {
  const dir = await dirHandle(path.slice(0, -1), true)
  const fh = await dir.getFileHandle(path[path.length - 1], { create: true })
  const w = await fh.createWritable()
  await w.write(text)
  await w.close()
}

export async function mkdir(path: string[]): Promise<void> {
  await dirHandle(path, true)
}

export async function exists(path: string[]): Promise<boolean> {
  try {
    const parent = await dirHandle(path.slice(0, -1))
    const name = path[path.length - 1]
    try {
      await parent.getFileHandle(name)
      return true
    } catch {
      await parent.getDirectoryHandle(name)
      return true
    }
  } catch {
    return false
  }
}

/** Remove a file or directory (recursively). Missing paths are ignored. */
export async function remove(path: string[]): Promise<void> {
  try {
    const parent = await dirHandle(path.slice(0, -1))
    await parent.removeEntry(path[path.length - 1], { recursive: true })
  } catch {
    // Already gone — nothing to do.
  }
}

async function copyFile(
  src: FileSystemFileHandle,
  destDir: FileSystemDirectoryHandle,
  name: string,
): Promise<void> {
  const file = await src.getFile()
  const dest = await destDir.getFileHandle(name, { create: true })
  const w = await dest.createWritable()
  await w.write(await file.arrayBuffer())
  await w.close()
}

async function copyDir(
  src: FileSystemDirectoryHandle,
  destDir: FileSystemDirectoryHandle,
  name: string,
): Promise<void> {
  const dest = await destDir.getDirectoryHandle(name, { create: true })
  for await (const [childName, child] of (src as DirWithEntries).entries()) {
    if (child.kind === 'directory')
      await copyDir(child as FileSystemDirectoryHandle, dest, childName)
    else await copyFile(child as FileSystemFileHandle, dest, childName)
  }
}

/** Copy `src` into `destDir` (files or folders, recursively). */
export async function copy(
  src: string[],
  destDirPath: string[],
  newName?: string,
): Promise<void> {
  const parent = await dirHandle(src.slice(0, -1))
  const name = src[src.length - 1]
  const destDir = await dirHandle(destDirPath, true)
  try {
    const fh = await parent.getFileHandle(name)
    await copyFile(fh, destDir, newName ?? name)
    return
  } catch {
    // Not a file — fall through to directory copy.
  }
  const dh = await parent.getDirectoryHandle(name)
  await copyDir(dh, destDir, newName ?? name)
}

/** Move = copy + remove (OPFS has no rename across directories). */
export async function move(
  src: string[],
  destDirPath: string[],
  newName?: string,
): Promise<void> {
  const sameDir =
    src.length === destDirPath.length + 1 &&
    src.slice(0, -1).join('/') === destDirPath.join('/')
  if (sameDir && (newName ?? src[src.length - 1]) === src[src.length - 1]) return
  await copy(src, destDirPath, newName)
  await remove(src)
}
