import type { ThemePack, ThemePreset, ThemeTokens } from './types'

export const THEME_PACK_FORMAT = 'codex-customizer-theme' as const
export const THEME_PACK_VERSION = 1 as const

const TOKEN_KEYS: (keyof ThemeTokens)[] = [
  'accent',
  'accentSecondary',
  'bgBase',
  'bgElevated',
  'bgGlass',
  'textPrimary',
  'textSecondary',
  'border',
  'success',
  'warning',
  'danger',
  'fontFamily',
  'radius',
  'blur',
  'saturation'
]

export function isThemeTokens(value: unknown): value is ThemeTokens {
  if (!value || typeof value !== 'object') return false
  const t = value as Record<string, unknown>
  for (const key of TOKEN_KEYS) {
    if (!(key in t)) return false
    const v = t[key]
    if (key === 'radius' || key === 'blur' || key === 'saturation') {
      if (typeof v !== 'number' || Number.isNaN(v)) return false
    } else if (typeof v !== 'string' || !v.trim()) {
      return false
    }
  }
  return true
}

export function sanitizePreset(raw: unknown, source: ThemePreset['source'] = 'imported'): ThemePreset | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>

  if (!isThemeTokens(o.tokens)) return null

  const preview =
    o.preview && typeof o.preview === 'object'
      ? (o.preview as Record<string, unknown>)
      : {}

  const idBase =
    typeof o.id === 'string' && o.id.trim()
      ? o.id.trim().replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 64)
      : `imported-${Date.now()}`

  const name =
    (typeof o.name === 'string' && o.name.trim()) ||
    (typeof o.nameKey === 'string' && o.nameKey.trim()) ||
    'Imported Theme'

  const description =
    (typeof o.description === 'string' && o.description) ||
    (typeof o.descriptionKey === 'string' && o.descriptionKey) ||
    ''

  return {
    id: idBase,
    nameKey: '',
    descriptionKey: '',
    name,
    description,
    source,
    preview: {
      primary:
        typeof preview.primary === 'string'
          ? preview.primary
          : o.tokens.accent,
      secondary:
        typeof preview.secondary === 'string'
          ? preview.secondary
          : o.tokens.accentSecondary,
      background:
        typeof preview.background === 'string'
          ? preview.background
          : o.tokens.bgBase,
      ...(typeof preview.image === 'string' && preview.image.trim()
        ? { image: preview.image.trim() }
        : {})
    },
    tokens: { ...o.tokens },
    customCss: typeof o.customCss === 'string' ? o.customCss : '',
    updatedAt: new Date().toISOString()
  }
}

export function parseThemePack(raw: unknown): {
  ok: true
  pack: ThemePack
} | {
  ok: false
  message: string
} {
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw)
    } catch {
      return { ok: false, message: 'Invalid JSON' }
    }
  }

  if (!raw || typeof raw !== 'object') {
    return { ok: false, message: 'Invalid theme pack' }
  }

  const o = raw as Record<string, unknown>

  // Full pack
  if (o.format === THEME_PACK_FORMAT || Array.isArray(o.themes)) {
    const list = Array.isArray(o.themes) ? o.themes : []
    const themes = list
      .map((t) => sanitizePreset(t, 'imported'))
      .filter((t): t is ThemePreset => Boolean(t))
    if (themes.length === 0) {
      return { ok: false, message: 'No valid themes found in pack' }
    }
    return {
      ok: true,
      pack: {
        format: THEME_PACK_FORMAT,
        version: THEME_PACK_VERSION,
        exportedAt:
          typeof o.exportedAt === 'string' ? o.exportedAt : new Date().toISOString(),
        appVersion: typeof o.appVersion === 'string' ? o.appVersion : undefined,
        themes,
        globalCss: typeof o.globalCss === 'string' ? o.globalCss : undefined
      }
    }
  }

  // Single theme object
  const single = sanitizePreset(o, 'imported')
  if (single) {
    return {
      ok: true,
      pack: {
        format: THEME_PACK_FORMAT,
        version: THEME_PACK_VERSION,
        exportedAt: new Date().toISOString(),
        themes: [single]
      }
    }
  }

  // Bare array of themes
  if (Array.isArray(raw)) {
    const themes = raw
      .map((t) => sanitizePreset(t, 'imported'))
      .filter((t): t is ThemePreset => Boolean(t))
    if (themes.length === 0) {
      return { ok: false, message: 'No valid themes in array' }
    }
    return {
      ok: true,
      pack: {
        format: THEME_PACK_FORMAT,
        version: THEME_PACK_VERSION,
        exportedAt: new Date().toISOString(),
        themes
      }
    }
  }

  return { ok: false, message: 'Unrecognized theme file format' }
}

export function buildThemePack(
  themes: ThemePreset[],
  options?: { globalCss?: string; appVersion?: string }
): ThemePack {
  const portable = themes.map((t) => ({
    id: t.id,
    name: t.name || t.nameKey || t.id,
    description: t.description || t.descriptionKey || '',
    nameKey: '',
    descriptionKey: '',
    source: t.source === 'builtin' ? ('imported' as const) : t.source || 'custom',
    preview: { ...t.preview },
    tokens: { ...t.tokens },
    customCss: t.customCss || '',
    updatedAt: t.updatedAt || new Date().toISOString()
  }))

  return {
    format: THEME_PACK_FORMAT,
    version: THEME_PACK_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: options?.appVersion,
    themes: portable,
    globalCss: options?.globalCss
  }
}

export function uniqueThemeId(base: string, existing: Set<string>): string {
  let id = base || `theme-${Date.now()}`
  if (!existing.has(id)) return id
  let n = 2
  while (existing.has(`${id}-${n}`)) n += 1
  return `${id}-${n}`
}

export function cloneTheme(
  source: ThemePreset,
  overrides: Partial<ThemePreset> & { name: string }
): ThemePreset {
  return {
    ...source,
    ...overrides,
    id: overrides.id || `custom-${Date.now().toString(36)}`,
    nameKey: '',
    descriptionKey: '',
    name: overrides.name,
    description: overrides.description ?? source.description ?? source.descriptionKey ?? '',
    source: overrides.source || 'custom',
    preview: { ...(overrides.preview || source.preview) },
    tokens: { ...(overrides.tokens || source.tokens) },
    customCss: overrides.customCss ?? source.customCss ?? '',
    updatedAt: new Date().toISOString()
  }
}
