import type { ThemePreset } from './types'

/**
 * Built-in Codex theme combinations.
 * Tokens are mapped to CSS custom properties during CDP injection.
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'aurora-glass',
    nameKey: 'presets.auroraGlass.name',
    descriptionKey: 'presets.auroraGlass.description',
    preview: {
      primary: '#7C9CFF',
      secondary: '#C084FC',
      background: '#0B1020'
    },
    tokens: {
      accent: '#7C9CFF',
      accentSecondary: '#C084FC',
      bgBase: '#0B1020',
      bgElevated: 'rgba(22, 28, 48, 0.82)',
      bgGlass: 'rgba(255, 255, 255, 0.06)',
      textPrimary: '#F4F7FF',
      textSecondary: 'rgba(224, 230, 255, 0.72)',
      border: 'rgba(255, 255, 255, 0.12)',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#F87171',
      fontFamily:
        '"SF Pro Display", "Segoe UI", "PingFang SC", "Hiragino Sans", system-ui, sans-serif',
      radius: 16,
      blur: 24,
      saturation: 1.15
    }
  },
  {
    id: 'midnight-ember',
    nameKey: 'presets.midnightEmber.name',
    descriptionKey: 'presets.midnightEmber.description',
    preview: {
      primary: '#FF7A59',
      secondary: '#FFB347',
      background: '#120C0A'
    },
    tokens: {
      accent: '#FF7A59',
      accentSecondary: '#FFB347',
      bgBase: '#120C0A',
      bgElevated: 'rgba(36, 22, 18, 0.88)',
      bgGlass: 'rgba(255, 140, 90, 0.08)',
      textPrimary: '#FFF5F0',
      textSecondary: 'rgba(255, 220, 200, 0.7)',
      border: 'rgba(255, 160, 120, 0.16)',
      success: '#4ADE80',
      warning: '#FACC15',
      danger: '#FB7185',
      fontFamily:
        '"SF Pro Display", "Segoe UI", "PingFang SC", system-ui, sans-serif',
      radius: 14,
      blur: 20,
      saturation: 1.1
    }
  },
  {
    id: 'sakura-mist',
    nameKey: 'presets.sakuraMist.name',
    descriptionKey: 'presets.sakuraMist.description',
    preview: {
      primary: '#F472B6',
      secondary: '#A78BFA',
      background: '#1A1218'
    },
    tokens: {
      accent: '#F472B6',
      accentSecondary: '#A78BFA',
      bgBase: '#1A1218',
      bgElevated: 'rgba(42, 28, 38, 0.85)',
      bgGlass: 'rgba(244, 114, 182, 0.08)',
      textPrimary: '#FFF0F7',
      textSecondary: 'rgba(255, 214, 236, 0.72)',
      border: 'rgba(244, 114, 182, 0.18)',
      success: '#6EE7B7',
      warning: '#FCD34D',
      danger: '#FB7185',
      fontFamily:
        '"SF Pro Display", "Hiragino Sans", "PingFang SC", system-ui, sans-serif',
      radius: 18,
      blur: 28,
      saturation: 1.2
    }
  },
  {
    id: 'arctic-dawn',
    nameKey: 'presets.arcticDawn.name',
    descriptionKey: 'presets.arcticDawn.description',
    preview: {
      primary: '#38BDF8',
      secondary: '#67E8F9',
      background: '#F4F8FC'
    },
    tokens: {
      accent: '#0284C7',
      accentSecondary: '#0891B2',
      bgBase: '#F4F8FC',
      bgElevated: 'rgba(255, 255, 255, 0.78)',
      bgGlass: 'rgba(255, 255, 255, 0.55)',
      textPrimary: '#0F172A',
      textSecondary: 'rgba(15, 23, 42, 0.62)',
      border: 'rgba(15, 23, 42, 0.1)',
      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626',
      fontFamily:
        '"SF Pro Display", "Segoe UI", "PingFang SC", system-ui, sans-serif',
      radius: 16,
      blur: 22,
      saturation: 1.05
    }
  },
  {
    id: 'forest-haze',
    nameKey: 'presets.forestHaze.name',
    descriptionKey: 'presets.forestHaze.description',
    preview: {
      primary: '#4ADE80',
      secondary: '#34D399',
      background: '#0C1410'
    },
    tokens: {
      accent: '#4ADE80',
      accentSecondary: '#34D399',
      bgBase: '#0C1410',
      bgElevated: 'rgba(18, 32, 24, 0.88)',
      bgGlass: 'rgba(74, 222, 128, 0.07)',
      textPrimary: '#ECFDF5',
      textSecondary: 'rgba(209, 250, 229, 0.7)',
      border: 'rgba(74, 222, 128, 0.14)',
      success: '#86EFAC',
      warning: '#FBBF24',
      danger: '#F87171',
      fontFamily:
        '"SF Pro Display", "Segoe UI", "PingFang SC", system-ui, sans-serif',
      radius: 14,
      blur: 22,
      saturation: 1.12
    }
  },
  {
    id: 'noir-gold',
    nameKey: 'presets.noirGold.name',
    descriptionKey: 'presets.noirGold.description',
    preview: {
      primary: '#E8C547',
      secondary: '#C9A227',
      background: '#0A0A0B'
    },
    tokens: {
      accent: '#E8C547',
      accentSecondary: '#C9A227',
      bgBase: '#0A0A0B',
      bgElevated: 'rgba(22, 20, 16, 0.9)',
      bgGlass: 'rgba(232, 197, 71, 0.06)',
      textPrimary: '#FAF6E8',
      textSecondary: 'rgba(245, 230, 180, 0.68)',
      border: 'rgba(232, 197, 71, 0.16)',
      success: '#86EFAC',
      warning: '#FBBF24',
      danger: '#F87171',
      fontFamily:
        '"SF Pro Display", "Segoe UI", "PingFang SC", "Noto Serif SC", system-ui, sans-serif',
      radius: 12,
      blur: 18,
      saturation: 1.08
    }
  },
  {
    id: 'lavender-cloud',
    nameKey: 'presets.lavenderCloud.name',
    descriptionKey: 'presets.lavenderCloud.description',
    preview: {
      primary: '#A78BFA',
      secondary: '#C4B5FD',
      background: '#F7F4FF'
    },
    tokens: {
      accent: '#7C3AED',
      accentSecondary: '#8B5CF6',
      bgBase: '#F7F4FF',
      bgElevated: 'rgba(255, 255, 255, 0.72)',
      bgGlass: 'rgba(255, 255, 255, 0.5)',
      textPrimary: '#1E1B2E',
      textSecondary: 'rgba(30, 27, 46, 0.62)',
      border: 'rgba(124, 58, 237, 0.12)',
      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626',
      fontFamily:
        '"SF Pro Display", "Segoe UI", "PingFang SC", system-ui, sans-serif',
      radius: 20,
      blur: 26,
      saturation: 1.1
    }
  },
  {
    id: 'ocean-depth',
    nameKey: 'presets.oceanDepth.name',
    descriptionKey: 'presets.oceanDepth.description',
    preview: {
      primary: '#22D3EE',
      secondary: '#3B82F6',
      background: '#061018'
    },
    tokens: {
      accent: '#22D3EE',
      accentSecondary: '#3B82F6',
      bgBase: '#061018',
      bgElevated: 'rgba(10, 28, 42, 0.88)',
      bgGlass: 'rgba(34, 211, 238, 0.07)',
      textPrimary: '#E0F7FF',
      textSecondary: 'rgba(186, 230, 253, 0.7)',
      border: 'rgba(34, 211, 238, 0.14)',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#F87171',
      fontFamily:
        '"SF Pro Display", "Segoe UI", "PingFang SC", system-ui, sans-serif',
      radius: 14,
      blur: 24,
      saturation: 1.15
    }
  }
]

export function getBuiltinPresetById(id: string): ThemePreset | undefined {
  const p = THEME_PRESETS.find((preset) => preset.id === id)
  return p ? { ...p, source: 'builtin' } : undefined
}

/** @deprecated use getBuiltinPresetById — kept for compatibility */
export function getPresetById(id: string): ThemePreset | undefined {
  return getBuiltinPresetById(id)
}

export const DEFAULT_PRESET_ID = 'aurora-glass'

export function displayThemeName(
  preset: ThemePreset,
  t: (key: string) => string
): string {
  if (preset.name && preset.name.trim()) return preset.name
  if (preset.nameKey) {
    const translated = t(preset.nameKey)
    if (translated && translated !== preset.nameKey) return translated
  }
  return preset.id
}

export function displayThemeDescription(
  preset: ThemePreset,
  t: (key: string) => string
): string {
  if (preset.description && preset.description.trim()) return preset.description
  if (preset.descriptionKey) {
    const translated = t(preset.descriptionKey)
    if (translated && translated !== preset.descriptionKey) return translated
  }
  return ''
}
