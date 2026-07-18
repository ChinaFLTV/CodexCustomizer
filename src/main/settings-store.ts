import Store from 'electron-store'
import { DEFAULT_SETTINGS } from '../shared/defaults'
import type { AppSettings } from '../shared/types'

const store = new Store<AppSettings>({
  name: 'codex-customizer-settings',
  defaults: DEFAULT_SETTINGS
})

export function getSettings(): AppSettings {
  const raw = store.store
  return {
    ...DEFAULT_SETTINGS,
    ...raw,
    customThemes: Array.isArray(raw.customThemes) ? raw.customThemes : [],
    globalCustomCss:
      typeof raw.globalCustomCss === 'string'
        ? raw.globalCustomCss
        : DEFAULT_SETTINGS.globalCustomCss
  }
}

export function setSettings( partial: Partial<AppSettings>): AppSettings {
  const next = { ...getSettings(), ...partial }
  store.store = next
  return next
}

export function getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
  return getSettings()[key]
}
