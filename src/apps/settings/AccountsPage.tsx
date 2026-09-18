import { useState } from 'react'
import { useT } from '../../core/i18n'
import type { MessageKey } from '../../core/i18n/en'
import { useSystemStore } from '../../core/store/system'
import { AvatarIcon } from '../../components/icons'
import { PageHead, Row, SubNav, ToggleRow } from './shared'

type AcctPage = 'info' | 'sync'

const PAGES: readonly { id: AcctPage; name: MessageKey }[] = [
  { id: 'info', name: 'set.sub.yourinfo' },
  { id: 'sync', name: 'set.sub.sync' },
]

/** Accounts > Your info | Sync your settings. */
export default function AccountsPage() {
  const [page, setPage] = useState<AcctPage>('info')
  const t = useT()
  return (
    <div className="flex h-full">
      <SubNav
        items={PAGES.map((p) => ({ id: p.id, label: t(p.name) }))}
        active={page}
        onPick={setPage}
      />
      <div key={page} className="anim-fade min-w-0 flex-1 overflow-y-auto p-6">
        <div className="max-w-[540px]">
          {page === 'info' && <YourInfo />}
          {page === 'sync' && <Sync />}
        </div>
      </div>
    </div>
  )
}

function YourInfo() {
  const t = useT()
  const setPhase = useSystemStore((s) => s.setPhase)
  return (
    <>
      <PageHead title={t('set.acct.info')} sub={t('set.acct.info.sub')} />
      <div className="flex items-center gap-4 border border-[#e0e0e0] p-4">
        <AvatarIcon className="size-16 shrink-0 text-[#0078d7]" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium">{t('lock.user')}</p>
          <p className="text-[12.5px] text-[#777]">{t('set.acct.local')}</p>
          <p className="text-[12.5px] text-[#777]">{t('set.acct.admin')}</p>
        </div>
      </div>
      <Row title={t('set.acct.signout')} desc={t('set.acct.signout.desc')}>
        <button
          className="shrink-0 border border-[#adadad] px-3 py-1 text-[12.5px] hover:bg-[#e5f1fb]"
          onClick={() => setPhase('lock')}
        >
          {t('set.acct.signout.btn')}
        </button>
      </Row>
      <Row title={t('set.acct.ms')} desc={t('set.acct.ms.desc')}>
        <button
          className="shrink-0 border border-[#adadad] px-3 py-1 text-[12.5px] hover:bg-[#e5f1fb]"
          onClick={() => window.open('https://account.microsoft.com', '_blank')}
        >
          {t('set.acct.ms.btn')}
        </button>
      </Row>
    </>
  )
}

function Sync() {
  const t = useT()
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  const syncOn = !!quick.sync
  return (
    <>
      <PageHead title={t('set.acct.sync')} sub={t('set.acct.sync.sub')} />
      <ToggleRow
        title={t('set.acct.sync.master')}
        desc={t('set.acct.sync.master.desc')}
        on={syncOn}
        onToggle={() => toggleQuick('sync')}
      />
      {syncOn && (
        <div className="mt-2 space-y-0">
          <ToggleRow
            title={t('set.acct.sync.theme')}
            on={!!quick.syncTheme}
            onToggle={() => toggleQuick('syncTheme')}
          />
          <ToggleRow
            title={t('set.acct.sync.passwords')}
            on={!!quick.syncPasswords}
            onToggle={() => toggleQuick('syncPasswords')}
          />
          <ToggleRow
            title={t('set.acct.sync.language')}
            on={!!quick.syncLanguage}
            onToggle={() => toggleQuick('syncLanguage')}
          />
          <ToggleRow
            title={t('set.acct.sync.ease')}
            on={!!quick.syncEase}
            onToggle={() => toggleQuick('syncEase')}
          />
        </div>
      )}
    </>
  )
}
