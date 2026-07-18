import { dialog, app } from 'electron'
import { readFile, writeFile } from 'fs/promises'
import { basename } from 'path'
import type { BrowserWindow } from 'electron'
import { getSettings, setSettings } from './settings-store'
import { THEME_PRESETS, getBuiltinPresetById } from '../shared/theme-presets'
import {
  buildThemePack,
  cloneTheme,
  parseThemePack,
  uniqueThemeId
} from '../shared/theme-io'
import type {
  ThemeExportResult,
  ThemeImportResult,
  ThemePreset,
  ThemeSavePayload
} from '../shared/types'

export function listAllThemes(): ThemePreset[] {
  const settings = getSettings()
  const builtins = THEME_PRESETS.map((p) => ({ ...p, source: 'builtin' as const }))
  const customs = (settings.customThemes || []).map((p) => ({
    ...p,
    source: p.source === 'imported' ? ('imported' as const) : ('custom' as const)
  }))
  return [...builtins, ...customs]
}

export function resolveTheme(id: string): ThemePreset | undefined {
  return listAllThemes().find((p) => p.id === id)
}

export function getGlobalCustomCss(): string {
  return getSettings().globalCustomCss || ''
}

export function setGlobalCustomCss(css: string): string {
  setSettings({ globalCustomCss: css ?? '' })
  return getGlobalCustomCss()
}

export function saveTheme(payload: ThemeSavePayload): ThemePreset {
  const settings = getSettings()
  const customs = [...(settings.customThemes || [])]
  const existingIds = new Set(listAllThemes().map((t) => t.id))

  let base: ThemePreset | undefined
  if (payload.baseId) {
    base = resolveTheme(payload.baseId)
  }
  if (!base && payload.id) {
    base = customs.find((t) => t.id === payload.id)
  }
  if (!base) {
    base = getBuiltinPresetById('aurora-glass') || THEME_PRESETS[0]
  }

  const now = new Date().toISOString()
  const isUpdate = Boolean(payload.id && customs.some((t) => t.id === payload.id))

  if (isUpdate && payload.id) {
    const idx = customs.findIndex((t) => t.id === payload.id)
    const prev = customs[idx]
    const next: ThemePreset = {
      ...prev,
      name: payload.name.trim() || prev.name || prev.id,
      description: payload.description ?? prev.description ?? '',
      nameKey: '',
      descriptionKey: '',
      source: prev.source === 'imported' ? 'imported' : 'custom',
      tokens: { ...payload.tokens },
      preview: payload.preview || {
        primary: payload.tokens.accent,
        secondary: payload.tokens.accentSecondary,
        background: payload.tokens.bgBase
      },
      customCss: payload.customCss ?? prev.customCss ?? '',
      updatedAt: now
    }
    customs[idx] = next
    setSettings({ customThemes: customs })
    return next
  }

  const id = uniqueThemeId(
    payload.id ||
      `custom-${payload.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '')
        .slice(0, 32) || Date.now().toString(36)}`,
    existingIds
  )

  const created = cloneTheme(base, {
    id,
    name: payload.name.trim() || id,
    description: payload.description || '',
    tokens: payload.tokens,
    preview: payload.preview || {
      primary: payload.tokens.accent,
      secondary: payload.tokens.accentSecondary,
      background: payload.tokens.bgBase
    },
    customCss: payload.customCss ?? base.customCss ?? '',
    source: 'custom',
    updatedAt: now
  })

  customs.push(created)
  setSettings({ customThemes: customs })
  return created
}

export function duplicateTheme(id: string, name?: string): ThemePreset {
  const source = resolveTheme(id)
  if (!source) {
    throw new Error(`Theme not found: ${id}`)
  }
  const settings = getSettings()
  const existingIds = new Set(listAllThemes().map((t) => t.id))
  const newId = uniqueThemeId(`${source.id}-copy`, existingIds)
  const display =
    name ||
    `${source.name || source.nameKey || source.id} (copy)`

  const created = cloneTheme(source, {
    id: newId,
    name: display,
    description: source.description || source.descriptionKey || '',
    source: 'custom'
  })

  setSettings({ customThemes: [...(settings.customThemes || []), created] })
  return created
}

export function deleteTheme(id: string): { ok: boolean; message: string } {
  if (getBuiltinPresetById(id)) {
    return { ok: false, message: 'Built-in themes cannot be deleted' }
  }
  const settings = getSettings()
  const customs = settings.customThemes || []
  if (!customs.some((t) => t.id === id)) {
    return { ok: false, message: 'Theme not found' }
  }
  setSettings({ customThemes: customs.filter((t) => t.id !== id) })
  if (settings.lastPresetId === id) {
    setSettings({ lastPresetId: THEME_PRESETS[0]?.id || null })
  }
  return { ok: true, message: 'Deleted' }
}

export async function exportThemes(
  win: BrowserWindow | null,
  themeIds: string[] | null,
  includeGlobalCss: boolean
): Promise<ThemeExportResult> {
  const all = listAllThemes()
  const selected =
    themeIds && themeIds.length > 0
      ? all.filter((t) => themeIds.includes(t.id))
      : all.filter((t) => t.source !== 'builtin')

  const themes = selected.length > 0 ? selected : all
  if (themes.length === 0) {
    return { ok: false, message: 'No themes to export' }
  }

  const pack = buildThemePack(themes, {
    globalCss: includeGlobalCss ? getGlobalCustomCss() : undefined,
    appVersion: app.getVersion()
  })

  const defaultName =
    themes.length === 1
      ? `${(themes[0].name || themes[0].id).replace(/[^\w.-]+/g, '_')}.codex-theme.json`
      : `codex-themes-${new Date().toISOString().slice(0, 10)}.codex-theme.json`

  const saveOpts = {
    title: 'Export theme pack',
    defaultPath: defaultName,
    filters: [
      { name: 'Codex Theme Pack', extensions: ['codex-theme.json', 'json'] },
      { name: 'JSON', extensions: ['json'] }
    ]
  }
  const result = win
    ? await dialog.showSaveDialog(win, saveOpts)
    : await dialog.showSaveDialog(saveOpts)

  if (result.canceled || !result.filePath) {
    return { ok: false, message: 'Cancelled' }
  }

  await writeFile(result.filePath, JSON.stringify(pack, null, 2), 'utf-8')
  return { ok: true, message: `Exported ${themes.length} theme(s)`, path: result.filePath }
}

export async function importThemes(
  win: BrowserWindow | null,
  options?: { replaceGlobalCss?: boolean }
): Promise<ThemeImportResult> {
  const openOpts = {
    title: 'Import theme pack',
    properties: ['openFile' as const],
    filters: [
      { name: 'Codex Theme Pack', extensions: ['codex-theme.json', 'json'] },
      { name: 'JSON', extensions: ['json'] }
    ]
  }
  const result = win
    ? await dialog.showOpenDialog(win, openOpts)
    : await dialog.showOpenDialog(openOpts)

  if (result.canceled || result.filePaths.length === 0) {
    return { ok: false, message: 'Cancelled', imported: 0, themes: [] }
  }

  const filePath = result.filePaths[0]
  let text: string
  try {
    text = await readFile(filePath, 'utf-8')
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'Failed to read file',
      imported: 0,
      themes: []
    }
  }

  const parsed = parseThemePack(text)
  if (!parsed.ok) {
    return { ok: false, message: parsed.message, imported: 0, themes: [] }
  }

  const settings = getSettings()
  const customs = [...(settings.customThemes || [])]
  const existingIds = new Set(listAllThemes().map((t) => t.id))
  const imported: ThemePreset[] = []

  for (const theme of parsed.pack.themes) {
    const id = uniqueThemeId(theme.id, existingIds)
    existingIds.add(id)
    const entry: ThemePreset = {
      ...theme,
      id,
      name: theme.name || basename(filePath, '.json'),
      source: 'imported',
      nameKey: '',
      descriptionKey: '',
      updatedAt: new Date().toISOString()
    }
    // Replace same-id custom theme if present
    const idx = customs.findIndex((t) => t.id === entry.id)
    if (idx >= 0) customs[idx] = entry
    else customs.push(entry)
    imported.push(entry)
  }

  const patch: Partial<ReturnType<typeof getSettings>> = { customThemes: customs }
  if (options?.replaceGlobalCss && typeof parsed.pack.globalCss === 'string') {
    patch.globalCustomCss = parsed.pack.globalCss
  }
  setSettings(patch)

  return {
    ok: true,
    message: `Imported ${imported.length} theme(s) from ${basename(filePath)}`,
    imported: imported.length,
    themes: imported
  }
}
