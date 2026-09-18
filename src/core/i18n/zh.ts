import type { Messages } from './en'
import { zh as apps } from './messages/apps'
import { zh as files } from './messages/files'
import { zh as settings } from './messages/settings'
import { zh as shell } from './messages/shell'

/**
 * 简体中文 (zh-CN) message table — merged from the per-domain tables
 * in `messages/`. Each fragment is `Record<keyof typeof en, string>`
 * for its domain, and the merged table is `Messages`, so a missing or
 * misspelled key is a compile-time error twice over.
 */
export const zh: Messages = { ...shell, ...files, ...apps, ...settings }
