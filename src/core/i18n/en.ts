import { en as apps } from './messages/apps'
import { en as files } from './messages/files'
import { en as settings } from './messages/settings'
import { en as shell } from './messages/shell'

/**
 * English (source) message table — merged from the per-domain tables
 * in `messages/`. Keys here define `MessageKey`; every domain's `zh`
 * fragment is typed `Record<keyof typeof en, string>`, so a missing or
 * misspelled translation is a compile-time error in that file.
 *
 * `{name}`-style placeholders are substituted by `t(key, vars)`.
 */
export const en = { ...shell, ...files, ...apps, ...settings }

export type MessageKey = keyof typeof en
export type Messages = Record<MessageKey, string>
