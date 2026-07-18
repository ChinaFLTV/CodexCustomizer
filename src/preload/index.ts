import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { IPC } from '../shared/types'
import type {
  AppSettings,
  CodexRuntimeState,
  DetectPathResult,
  InjectResult,
  ThemeExportResult,
  ThemeImportResult,
  ThemePreset,
  ThemeSavePayload
} from '../shared/types'

export interface CodexCustomizerAPI {
  getSettings: () => Promise<AppSettings>
  setSettings: (partial: Partial<AppSettings>) => Promise<AppSettings>
  detectCodex: () => Promise<DetectPathResult>
  startCodex: (payload?: { path?: string; presetId?: string }) => Promise<CodexRuntimeState>
  stopCodex: () => Promise<CodexRuntimeState>
  getCodexStatus: () => Promise<CodexRuntimeState>
  onCodexStatus: (cb: (state: CodexRuntimeState) => void) => () => void
  listThemes: () => Promise<ThemePreset[]>
  applyTheme: (presetId: string) => Promise<InjectResult>
  previewTheme: (presetId: string) => Promise<InjectResult>
  resetTheme: () => Promise<InjectResult>
  saveTheme: (payload: ThemeSavePayload) => Promise<ThemePreset>
  deleteTheme: (id: string) => Promise<{ ok: boolean; message: string }>
  duplicateTheme: (id: string, name?: string) => Promise<ThemePreset>
  exportThemes: (payload?: {
    themeIds?: string[] | null
    includeGlobalCss?: boolean
  }) => Promise<ThemeExportResult>
  importThemes: (payload?: {
    replaceGlobalCss?: boolean
  }) => Promise<ThemeImportResult>
  getGlobalCss: () => Promise<string>
  setGlobalCss: (css: string) => Promise<string>
  pickCodexPath: () => Promise<string | null>
  windowMinimize: () => Promise<void>
  windowMaximize: () => Promise<void>
  windowClose: () => Promise<void>
  windowIsMaximized: () => Promise<boolean>
  platform: NodeJS.Platform
}

const api: CodexCustomizerAPI = {
  getSettings: () => ipcRenderer.invoke(IPC.GET_SETTINGS),
  setSettings: (partial) => ipcRenderer.invoke(IPC.SET_SETTINGS, partial),
  detectCodex: () => ipcRenderer.invoke(IPC.CODEX_DETECT),
  startCodex: (payload) => ipcRenderer.invoke(IPC.CODEX_START, payload),
  stopCodex: () => ipcRenderer.invoke(IPC.CODEX_STOP),
  getCodexStatus: () => ipcRenderer.invoke(IPC.CODEX_STATUS),
  onCodexStatus: (cb) => {
    const listener = (_event: IpcRendererEvent, state: CodexRuntimeState) => cb(state)
    ipcRenderer.on(IPC.CODEX_STATUS_EVENT, listener)
    return () => ipcRenderer.removeListener(IPC.CODEX_STATUS_EVENT, listener)
  },
  listThemes: () => ipcRenderer.invoke(IPC.THEME_LIST),
  applyTheme: (presetId) => ipcRenderer.invoke(IPC.THEME_APPLY, presetId),
  previewTheme: (presetId) => ipcRenderer.invoke(IPC.THEME_PREVIEW, presetId),
  resetTheme: () => ipcRenderer.invoke(IPC.THEME_RESET),
  saveTheme: (payload) => ipcRenderer.invoke(IPC.THEME_SAVE, payload),
  deleteTheme: (id) => ipcRenderer.invoke(IPC.THEME_DELETE, id),
  duplicateTheme: (id, name) => ipcRenderer.invoke(IPC.THEME_DUPLICATE, id, name),
  exportThemes: (payload) => ipcRenderer.invoke(IPC.THEME_EXPORT, payload),
  importThemes: (payload) => ipcRenderer.invoke(IPC.THEME_IMPORT, payload),
  getGlobalCss: () => ipcRenderer.invoke(IPC.THEME_GET_GLOBAL_CSS),
  setGlobalCss: (css) => ipcRenderer.invoke(IPC.THEME_SET_GLOBAL_CSS, css),
  pickCodexPath: () => ipcRenderer.invoke(IPC.DIALOG_PICK_CODEX),
  windowMinimize: () => ipcRenderer.invoke('window:minimize'),
  windowMaximize: () => ipcRenderer.invoke('window:maximize'),
  windowClose: () => ipcRenderer.invoke('window:close'),
  windowIsMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  platform: process.platform
}

contextBridge.exposeInMainWorld('codexCustomizer', api)

declare global {
  interface Window {
    codexCustomizer: CodexCustomizerAPI
  }
}
