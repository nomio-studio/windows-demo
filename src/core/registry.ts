import type { AppDefinition } from './types'

const registry = new Map<string, AppDefinition>()

/** Install an app so the shell can launch it. Idempotent by app id. */
export function registerApp(app: AppDefinition): void {
  registry.set(app.id, app)
}

export function getApp(id: string): AppDefinition {
  const app = registry.get(id)
  if (!app) throw new Error(`Unknown app: ${id}`)
  return app
}

/** All apps that should appear in the start-menu app list. */
export function listApps(): AppDefinition[] {
  return [...registry.values()].filter((a) => !a.hidden)
}
