import { useMemo, useState } from 'react'
import { useT } from '../../core/i18n'
import type { MessageKey } from '../../core/i18n/en'
import { listApps } from '../../core/registry'
import { useWindowsStore } from '../../core/store/windows'
import {
  DocFileIcon,
  EdgeIcon,
  FileIcon,
  FolderIcon,
  ImageFileIcon,
  MusicIcon,
  PhotosIcon,
} from '../../components/icons'
import type { IconType } from '../../core/types'
import { PageHead, SubNav } from './shared'

type AppsPage_ = 'installed' | 'defaults'

const PAGES: readonly { id: AppsPage_; name: MessageKey }[] = [
  { id: 'installed', name: 'set.sub.installed' },
  { id: 'defaults', name: 'set.sub.defaults' },
]

/** Apps > Installed apps | Default apps. */
export default function AppsPage() {
  const [page, setPage] = useState<AppsPage_>('installed')
  const t = useT()
  return (
    <div className="flex h-full">
      <SubNav
        items={PAGES.map((p) => ({ id: p.id, label: t(p.name) }))}
        active={page}
        onPick={setPage}
      />
      <div key={page} className="anim-fade min-w-0 flex-1 overflow-y-auto p-6">
        <div className="max-w-[560px]">
          {page === 'installed' && <Installed />}
          {page === 'defaults' && <Defaults />}
        </div>
      </div>
    </div>
  )
}

function Installed() {
  const t = useT()
  const openApp = useWindowsStore((s) => s.openApp)
  const [q, setQ] = useState('')
  const apps = useMemo(
    () =>
      listApps()
        .map((a) => ({ ...a, name: t(a.title) }))
        .filter(
          (a) => !q || a.name.toLowerCase().includes(q.trim().toLowerCase()),
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [q, t],
  )

  return (
    <>
      <PageHead title={t('set.apps.installed')} sub={t('set.apps.installed.sub')} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t('set.apps.search')}
        className="mb-4 h-8 w-full max-w-[300px] border border-[#adadad] px-2.5 text-[13px] outline-none focus:border-[#0078d7]"
      />
      {apps.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-[#888]">
          {t('set.apps.none')}
        </p>
      ) : (
        <div className="divide-y divide-[#eee] border border-[#e0e0e0]">
          {apps.map((a) => (
            <button
              key={a.id}
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-[#e5f3ff]"
              onClick={() => openApp(a.id)}
            >
              <a.icon className="size-6 shrink-0" />
              <span className="min-w-0 flex-1 truncate text-[13px]">
                {a.name}
              </span>
              <span className="shrink-0 text-[11.5px] text-[#888]">
                v{__APP_VERSION__}
              </span>
            </button>
          ))}
        </div>
      )}
      <p className="mt-2 text-[12px] text-[#777]">
        {t('set.apps.count', { n: apps.length })}
      </p>
    </>
  )
}

interface Assoc {
  label: MessageKey
  icon: IconType
  appKey: MessageKey
  appIcon: IconType
}

const ASSOCS: Assoc[] = [
  { label: 'set.def.text', icon: DocFileIcon, appKey: 'app.notepad', appIcon: DocFileIcon },
  { label: 'set.def.image', icon: ImageFileIcon, appKey: 'app.photos', appIcon: PhotosIcon },
  { label: 'set.def.web', icon: EdgeIcon, appKey: 'app.edge', appIcon: EdgeIcon },
  { label: 'set.def.folder', icon: FolderIcon, appKey: 'app.explorer', appIcon: FolderIcon },
  { label: 'set.def.music', icon: FileIcon, appKey: 'app.groove', appIcon: MusicIcon },
]

function Defaults() {
  const t = useT()
  return (
    <>
      <PageHead title={t('set.apps.defaults')} sub={t('set.apps.defaults.sub')} />
      <div className="divide-y divide-[#eee] border border-[#e0e0e0]">
        {ASSOCS.map((a) => (
          <div key={a.label} className="flex items-center gap-3 px-3 py-2.5">
            <a.icon className="size-5 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-[13px]">{t(a.label)}</span>
            </span>
            <a.appIcon className="size-4 shrink-0" />
            <span className="w-28 shrink-0 text-[12.5px] text-[#555]">
              {t(a.appKey)}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-[#777]">{t('set.apps.defaults.hint')}</p>
    </>
  )
}
