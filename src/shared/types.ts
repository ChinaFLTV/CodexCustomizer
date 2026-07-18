/** Supported application UI themes */
export type AppThemeMode = 'light' | 'dark' | 'system'

/** Supported locales */
export type LocaleCode = 'zh-CN' | 'en' | 'fr' | 'ja' | 'de'

/** CSS custom property map injected into Codex */
export interface ThemeTokens {
  accent: string
  accentSecondary: string
  bgBase: string
  bgElevated: string
  bgGlass: string
  textPrimary: string
  textSecondary: string
  border: string
  success: string
  warning: string
  danger: string
  fontFamily: string
  radius: number
  blur: number
  saturation: number
}

/** Origin of a theme preset */
export type ThemeSource = 'builtin' | 'custom' | 'imported'

/** A named theme preset that can be applied to Codex */
export interface ThemePreset {
  id: string
  /**
   * i18n key for display name (builtin themes).
   * Custom/imported themes may leave this empty and use `name` instead.
   */
  nameKey: string
  descriptionKey: string
  /** Direct display name (custom / imported themes) */
  name?: string
  /** Direct description (custom / imported themes) */
  description?: string
  source?: ThemeSource
  preview: {
    primary: string
    secondary: string
    background: string
  }
  tokens: ThemeTokens
  /** Extra raw CSS appended after token variables */
  customCss?: string
  updatedAt?: string
}

/** Runtime status of the Codex process / CDP link */
export type CodexStatus =
  | 'stopped'
  | 'starting'
  | 'running'
  | 'injecting'
  | 'connected'
  | 'error'

export interface CodexRuntimeState {
  status: CodexStatus
  pid: number | null
  debuggingPort: number | null
  executablePath: string | null
  lastError: string | null
  activePresetId: string | null
  injectedAt: string | null
}

export interface AppSettings {
  locale: LocaleCode
  appTheme: AppThemeMode
  codexPath: string | null
  debuggingPort: number
  autoInjectOnStart: boolean
  lastPresetId: string | null
  /** Global CSS overlay applied on top of every theme injection */
  globalCustomCss: string
  /** User-created / imported themes */
  customThemes: ThemePreset[]
  windowBounds: {
    width: number
    height: number
    x?: number
    y?: number
  }
}

export interface InjectResult {
  ok: boolean
  message: string
  presetId?: string
}

export interface DetectPathResult {
  path: string | null
  candidates: string[]
}

/** Portable theme pack file format */
export interface ThemePack {
  format: 'codex-customizer-theme'
  version: 1
  exportedAt: string
  appVersion?: string
  themes: ThemePreset[]
  globalCss?: string
}

export interface ThemeSavePayload {
  /** Existing id to update; omit to create */
  id?: string
  name: string
  description?: string
  tokens: ThemeTokens
  preview?: ThemePreset['preview']
  customCss?: string
  /** Clone from an existing preset id */
  baseId?: string
}

export interface ThemeImportResult {
  ok: boolean
  message: string
  imported: number
  themes: ThemePreset[]
}

export interface ThemeExportResult {
  ok: boolean
  message: string
  path?: string
}

/** IPC channel names — single source of truth */
export const IPC = {
  // Settings
  GET_SETTINGS: 'settings:get',
  SET_SETTINGS: 'settings:set',
  // Codex lifecycle
  CODEX_DETECT: 'codex:detect',
  CODEX_START: 'codex:start',
  CODEX_STOP: 'codex:stop',
  CODEX_STATUS: 'codex:status',
  CODEX_STATUS_EVENT: 'codex:status-event',
  // Themes
  THEME_LIST: 'theme:list',
  THEME_APPLY: 'theme:apply',
  THEME_PREVIEW: 'theme:preview',
  THEME_RESET: 'theme:reset',
  THEME_SAVE: 'theme:save',
  THEME_DELETE: 'theme:delete',
  THEME_DUPLICATE: 'theme:duplicate',
  THEME_EXPORT: 'theme:export',
  THEME_IMPORT: 'theme:import',
  THEME_GET_GLOBAL_CSS: 'theme:get-global-css',
  THEME_SET_GLOBAL_CSS: 'theme:set-global-css',
  // Dialogs
  DIALOG_PICK_CODEX: 'dialog:pick-codex'
} as const

export type IpcChannel = (typeof IPC)[keyof typeof IPC]
