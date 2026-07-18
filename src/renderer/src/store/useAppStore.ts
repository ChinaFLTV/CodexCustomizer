import { create } from 'zustand'
import type {
  AppSettings,
  AppThemeMode,
  CodexRuntimeState,
  LocaleCode,
  ThemePreset
} from '@shared/types'
import { DEFAULT_SETTINGS } from '@shared/defaults'

export type PageId = 'studio' | 'editor' | 'control' | 'settings' | 'about'

export interface ToastItem {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface AppState {
  ready: boolean
  page: PageId
  settings: AppSettings
  themes: ThemePreset[]
  selectedPresetId: string | null
  codex: CodexRuntimeState
  toasts: ToastItem[]
  busy: boolean
  setPage: (page: PageId) => void
  setReady: (ready: boolean) => void
  setSettings: (settings: AppSettings) => void
  setThemes: (themes: ThemePreset[]) => void
  setSelectedPresetId: (id: string | null) => void
  setCodex: (state: CodexRuntimeState) => void
  setBusy: (busy: boolean) => void
  pushToast: (toast: Omit<ToastItem, 'id'>) => void
  dismissToast: (id: string) => void
}

const initialCodex: CodexRuntimeState = {
  status: 'stopped',
  pid: null,
  debuggingPort: null,
  executablePath: null,
  lastError: null,
  activePresetId: null,
  injectedAt: null
}

export const useAppStore = create<AppState>((set) => ({
  ready: false,
  page: 'studio',
  settings: DEFAULT_SETTINGS,
  themes: [],
  selectedPresetId: DEFAULT_SETTINGS.lastPresetId,
  codex: initialCodex,
  toasts: [],
  busy: false,
  setPage: (page) => set({ page }),
  setReady: (ready) => set({ ready }),
  setSettings: (settings) => set({ settings }),
  setThemes: (themes) => set({ themes }),
  setSelectedPresetId: (selectedPresetId) => set({ selectedPresetId }),
  setCodex: (codex) => set({ codex }),
  setBusy: (busy) => set({ busy }),
  pushToast: (toast) =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        { ...toast, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }
      ].slice(-4)
    })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
}))

export function resolvedAppTheme(mode: AppThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

export async function hydrateApp(): Promise<void> {
  const api = window.codexCustomizer
  const [settings, themes, codex] = await Promise.all([
    api.getSettings(),
    api.listThemes(),
    api.getCodexStatus()
  ])
  useAppStore.getState().setSettings(settings)
  useAppStore.getState().setThemes(themes)
  useAppStore.getState().setCodex(codex)
  useAppStore
    .getState()
    .setSelectedPresetId(settings.lastPresetId || themes[0]?.id || null)
  useAppStore.getState().setReady(true)
}

export async function updateSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
  const next = await window.codexCustomizer.setSettings(partial)
  useAppStore.getState().setSettings(next)
  return next
}

export async function changeLocale(locale: LocaleCode): Promise<void> {
  await updateSettings({ locale })
}

export async function changeAppTheme(appTheme: AppThemeMode): Promise<void> {
  await updateSettings({ appTheme })
}
