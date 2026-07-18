import type { ThemeTokens } from '../shared/types'

const ROOT = 'codex-customizer'

function isLight(bg: string): boolean {
  const hex = bg.trim()
  if (!hex.startsWith('#')) return false
  let r: number, g: number, b: number
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16)
    g = parseInt(hex.slice(3, 5), 16)
    b = parseInt(hex.slice(5, 7), 16)
  } else if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else return false
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55
}

function solidElevated(tokens: ThemeTokens): string {
  const e = tokens.bgElevated.trim()
  // Keep explicit solid colors (hex / rgb / rgba / hsl) — don't wash them into bgBase
  if (
    e.startsWith('#') ||
    /^rgba?\(/i.test(e) ||
    /^hsla?\(/i.test(e) ||
    /^color\(/i.test(e)
  ) {
    return e
  }
  return `color-mix(in srgb, ${tokens.bgBase} 82%, ${tokens.accent} 10%)`
}

/** Opaque elevated for electron-opaque body path */
function opaqueElevated(tokens: ThemeTokens): string {
  const e = solidElevated(tokens)
  if (e.startsWith('#')) return e
  return `color-mix(in srgb, ${tokens.bgBase} 88%, ${tokens.accent} 12%)`
}

export interface ThemePalette {
  light: boolean
  base: string
  elevated: string
  elevatedOpaque: string
  surfaceUnder: string
  fg: string
  muted: string
  tertiary: string
  border: string
  borderHeavy: string
  accent: string
  accent2: string
  hover: string
  fog: string
  inputBg: string
  codeBg: string
  codeFg: string
  danger: string
  warning: string
  success: string
  link: string
  focus: string
  panel: string
  card: string
  knob: string
  trackOff: string
  onAccent: string
  mention: string
  info: string
}

/**
 * Build a clearly theme-tinted text stack so switching presets is obvious.
 * Primary must NOT look like pure white — CDP showed 10% accent is invisible.
 * Secondary/tertiary pull more accent hue for descriptions/meta.
 */
function buildTextStack(
  rawFg: string,
  rawMuted: string,
  accent: string,
  light: boolean
): { fg: string; secondary: string; tertiary: string } {
  const m = rawMuted.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i
  )
  let secondaryBase: string
  let tertiaryBase: string
  if (m) {
    const a = m[4] != null ? Math.max(parseFloat(m[4]), 0.88) : 0.9
    secondaryBase = `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${a})`
    tertiaryBase = `rgba(${m[1]}, ${m[2]}, ${m[3]}, 0.72)`
  } else {
    secondaryBase = rawMuted || `color-mix(in srgb, ${rawFg} 78%, transparent)`
    tertiaryBase = `color-mix(in srgb, ${rawFg} 60%, transparent)`
  }

  // Light themes: keep more of original fg for contrast on pale surfaces
  if (light) {
    return {
      fg: `color-mix(in srgb, ${rawFg} 88%, ${accent} 12%)`,
      secondary: `color-mix(in srgb, ${secondaryBase} 78%, ${accent} 22%)`,
      tertiary: `color-mix(in srgb, ${tertiaryBase} 72%, ${accent} 28%)`
    }
  }

  // Dark themes: strong accent wash so body copy is obviously themed
  // (was 10% — looked pure white in screenshots / CDP srgb≈1 0.91 0.88)
  return {
    fg: `color-mix(in srgb, ${rawFg} 68%, ${accent} 32%)`,
    secondary: `color-mix(in srgb, ${secondaryBase} 62%, ${accent} 38%)`,
    tertiary: `color-mix(in srgb, ${tertiaryBase} 58%, ${accent} 42%)`
  }
}

export function buildPalette(tokens: ThemeTokens): ThemePalette {
  const light = isLight(tokens.bgBase)
  const elevated = solidElevated(tokens)
  const elevatedOpaque = opaqueElevated(tokens)
  const base = tokens.bgBase
  const accent = tokens.accent
  const { fg, secondary, tertiary } = buildTextStack(
    tokens.textPrimary,
    tokens.textSecondary,
    accent,
    light
  )

  return {
    light,
    base,
    elevated,
    elevatedOpaque,
    surfaceUnder: base,
    fg,
    muted: secondary,
    tertiary,
    border: tokens.border,
    borderHeavy: `color-mix(in srgb, ${tokens.border} 65%, ${fg} 18%)`,
    accent,
    accent2: tokens.accentSecondary,
    hover: `color-mix(in srgb, ${accent} 16%, transparent)`,
    fog: `color-mix(in srgb, ${fg} 5%, transparent)`,
    inputBg: `color-mix(in srgb, ${elevatedOpaque} 90%, ${accent} 5%)`,
    codeBg: `color-mix(in srgb, ${accent} 16%, ${elevatedOpaque})`,
    codeFg: fg,
    danger: tokens.danger,
    warning: tokens.warning,
    success: tokens.success,
    link: accent,
    focus: `color-mix(in srgb, ${accent} 72%, transparent)`,
    panel: elevatedOpaque,
    card: `color-mix(in srgb, ${elevatedOpaque} 94%, ${accent} 6%)`,
    knob: light ? '#ffffff' : fg,
    trackOff: `color-mix(in srgb, ${fg} 12%, transparent)`,
    onAccent: light ? '#0a0a0a' : '#ffffff',
    mention: accent,
    info: tokens.accentSecondary
  }
}

/**
 * Full CSS variable map — applied via setProperty(..., 'important')
 * so it beats native electron theme stylesheets.
 */
export function buildTokenMap(tokens: ThemeTokens): Record<string, string> {
  const p = buildPalette(tokens)
  const map: Record<string, string> = {
    // App tokens
    '--cc-accent': p.accent,
    '--cc-accent-secondary': p.accent2,
    '--cc-bg-base': p.base,
    '--cc-bg-elevated': tokens.bgElevated,
    '--cc-bg-glass': tokens.bgGlass,
    '--cc-text-primary': p.fg,
    '--cc-text-secondary': p.muted,
    '--cc-text-tertiary': p.tertiary,
    '--cc-border': p.border,
    '--cc-success': p.success,
    '--cc-warning': p.warning,
    '--cc-danger': p.danger,
    '--cc-icon': p.muted,
    '--cc-icon-active': p.accent,

    // Codex surfaces (critical for settings cards)
    '--color-background-surface': p.elevatedOpaque,
    '--color-background-surface-under': p.surfaceUnder,
    '--color-background-elevated-primary': p.elevatedOpaque,
    '--color-background-elevated-primary-opaque': p.elevatedOpaque,
    '--startup-background': p.base,

    // Design tokens
    '--color-token-foreground': p.fg,
    '--color-token-main-surface-primary': p.base,
    '--color-token-main-surface-secondary': p.elevatedOpaque,
    '--color-token-bg-primary': p.base,
    '--color-token-bg-secondary': `color-mix(in srgb, ${p.base} 92%, transparent)`,
    '--color-token-bg-fog': p.fog,
    '--color-token-bg-subtle': `color-mix(in srgb, ${p.fg} 5%, ${p.elevatedOpaque})`,
    '--color-token-text-primary': p.fg,
    '--color-token-text-secondary': p.muted,
    '--color-token-text-tertiary': p.tertiary,
    '--color-token-border': p.border,
    '--color-token-border-heavy': p.borderHeavy,
    '--color-token-input-border': p.border,
    '--color-token-list-hover-background': p.hover,
    '--color-token-list-active-selection-foreground': p.fg,
    '--color-token-input-background': p.inputBg,
    '--color-token-input-foreground': p.fg,
    '--color-token-input-placeholder-foreground': p.tertiary,
    '--color-token-text-link-foreground': p.link,
    '--color-token-focus-border': p.focus,
    '--color-token-focus': p.focus,
    '--color-token-description-foreground': p.muted,
    '--color-token-conversation-body': `color-mix(in srgb, ${p.fg} 88%, transparent)`,
    '--color-token-dropdown-background': p.elevatedOpaque,
    '--color-token-text-code-block-background': p.codeBg,
    '--color-token-sidebar-surface': p.elevatedOpaque,
    '--color-token-surface-primary': p.elevatedOpaque,
    '--color-token-button-primary-background': p.accent,
    '--color-token-button-primary-foreground': p.onAccent,
    '--color-token-button-secondary-background': `color-mix(in srgb, ${p.fg} 8%, transparent)`,
    '--color-token-button-tertiary-foreground': p.muted,
    '--color-token-muted-foreground': p.muted,
    '--color-token-composer-surface': p.inputBg,
    '--color-token-error-foreground': p.danger,
    '--color-token-editor-warning-foreground': p.warning,
    // Callouts scheme A: theme surface + semantic accent (not solid danger red blocks)
    '--color-token-input-validation-error-background': `color-mix(in srgb, ${p.accent} 14%, ${p.elevatedOpaque})`,
    '--color-token-input-validation-error-foreground': p.fg,
    '--color-token-input-validation-error-border': `color-mix(in srgb, ${p.danger} 45%, ${p.border})`,
    '--color-token-input-validation-warning-background': `color-mix(in srgb, ${p.accent} 12%, ${p.elevatedOpaque})`,
    '--color-token-input-validation-warning-foreground': p.fg,
    '--color-token-input-validation-warning-border': `color-mix(in srgb, ${p.warning} 40%, ${p.border})`,
    '--color-token-input-validation-info-background': `color-mix(in srgb, ${p.accent} 12%, ${p.elevatedOpaque})`,
    '--color-token-input-validation-info-foreground': p.fg,
    '--color-token-input-validation-info-border': `color-mix(in srgb, ${p.info} 40%, ${p.border})`,
    // Scheme A+ paint tokens (fully themed: accent strip/icon, not danger red)
    '--cc-callout-error-bg': `color-mix(in srgb, ${p.accent} 14%, ${p.elevatedOpaque})`,
    '--cc-callout-error-fg': p.fg,
    '--cc-callout-error-fg-secondary': p.muted,
    '--cc-callout-error-accent': p.accent,
    '--cc-callout-warning-bg': `color-mix(in srgb, ${p.accent} 12%, ${p.elevatedOpaque})`,
    '--cc-callout-warning-fg': p.fg,
    '--cc-callout-warning-fg-secondary': p.muted,
    '--cc-callout-warning-accent': p.accent,
    '--cc-callout-elevation': `0 0 0 0.5px color-mix(in srgb, ${p.accent} 28%, transparent)`,
    '--color-token-charts-blue': p.accent,
    '--color-token-charts-green': p.success,
    '--color-token-charts-red': p.danger,
    '--color-token-charts-orange': p.warning,
    '--color-token-charts-purple': p.accent2,
    '--color-token-charts-yellow': p.warning,
    '--color-token-git-decoration-added-resource-foreground': p.success,
    '--color-token-git-decoration-deleted-resource-foreground': p.danger,
    '--color-token-git-decoration-modified-resource-foreground': p.warning,
    '--inline-mention-color': p.mention,
    '--inline-mention-base-color': `color-mix(in srgb, ${p.mention} 80%, ${p.fg} 20%)`,

    // Gray scale remap (settings switches / hard-coded bg-[color:var(--gray-N)])
    '--gray-0': p.knob,
    '--gray-50': `color-mix(in srgb, ${p.fg} 96%, ${p.base})`,
    '--gray-100': `color-mix(in srgb, ${p.fg} 90%, ${p.base})`,
    '--gray-300': `color-mix(in srgb, ${p.fg} 55%, ${p.base})`,
    '--gray-500': `color-mix(in srgb, ${p.fg} 35%, ${p.base})`,
    '--gray-550': `color-mix(in srgb, ${p.fg} 28%, ${p.base})`,
    '--gray-600': `color-mix(in srgb, ${p.elevatedOpaque} 70%, ${p.base})`,
    '--gray-700': `color-mix(in srgb, ${p.elevatedOpaque} 85%, ${p.base})`,
    '--gray-750': p.elevatedOpaque,
    '--gray-800': p.elevatedOpaque,
    '--gray-900': p.base,
    '--gray-1000': `color-mix(in srgb, ${p.base} 92%, #000)`,

    // VS Code workbench — settings / panels / menus
    '--vscode-foreground': p.fg,
    '--vscode-descriptionForeground': p.muted,
    '--vscode-disabledForeground': `color-mix(in srgb, ${p.muted} 70%, transparent)`,
    '--vscode-icon-foreground': p.muted,
    '--vscode-sideBar-background': p.base,
    '--vscode-sideBar-foreground': p.fg,
    '--vscode-sideBar-border': p.border,
    '--vscode-sideBarTitle-background': p.base,
    '--vscode-sideBarTitle-foreground': p.fg,
    '--vscode-sideBarSectionHeader-background': p.panel,
    '--vscode-sideBarSectionHeader-foreground': p.fg,
    '--vscode-sideBarSectionHeader-border': p.border,
    '--vscode-sideBarStickyScroll-background': p.fog,
    '--vscode-editor-background': p.base,
    '--vscode-editor-foreground': p.fg,
    '--vscode-editorPane-background': p.base,
    '--vscode-editorGutter-background': p.base,
    '--vscode-editorWidget-background': p.panel,
    '--vscode-editorHoverWidget-background': p.panel,
    '--vscode-editorSuggestWidget-background': p.panel,
    '--vscode-editorStickyScroll-background': p.fog,
    '--vscode-editorStickyScrollHover-background': p.panel,
    '--vscode-input-background': p.inputBg,
    '--vscode-input-foreground': p.fg,
    '--vscode-input-border': p.border,
    '--vscode-input-placeholderForeground': `color-mix(in srgb, ${p.muted} 88%, transparent)`,
    '--vscode-dropdown-background': p.panel,
    '--vscode-dropdown-foreground': p.fg,
    '--vscode-dropdown-border': p.border,
    '--vscode-checkbox-background': p.panel,
    '--vscode-checkbox-foreground': p.fg,
    '--vscode-checkbox-border': p.border,
    '--vscode-button-background': p.accent,
    '--vscode-button-foreground': p.onAccent,
    '--vscode-button-border': p.border,
    '--vscode-button-secondaryBackground': `color-mix(in srgb, ${p.fg} 8%, transparent)`,
    '--vscode-button-secondaryForeground': p.muted,
    '--vscode-banner-foreground': p.fg,
    '--vscode-breadcrumb-foreground': p.muted,
    '--vscode-breadcrumb-focusForeground': p.muted,
    '--vscode-breadcrumb-activeSelectionForeground': p.fg,
    '--vscode-commandCenter-foreground': p.fg,
    '--vscode-commandCenter-inactiveForeground': p.muted,
    '--vscode-notifications-foreground': p.fg,
    '--vscode-notificationLink-foreground': p.link,
    '--vscode-keybindingLabel-foreground': p.muted,
    '--vscode-editorLineNumber-foreground': p.tertiary,
    '--vscode-editorLineNumber-activeForeground': p.fg,
    '--vscode-editorCursor-foreground': p.accent,
    '--vscode-editorPlaceholder-foreground': p.tertiary,
    '--vscode-editor-placeholder.foreground': p.tertiary,
    '--vscode-editorGhostText-foreground': p.tertiary,
    '--vscode-editorCodeLens-foreground': p.tertiary,
    '--vscode-editorHint-foreground': p.info,
    '--vscode-editorInfo-foreground': p.info,
    '--vscode-editorLightBulb-foreground': p.info,
    '--vscode-editorLink-activeForeground': p.link,
    '--vscode-terminalCommandGuide-foreground': p.info,
    '--vscode-problemsInfoIcon-foreground': p.info,
    '--vscode-notificationsInfoIcon-foreground': p.info,
    '--vscode-activityBarBadge-foreground': p.onAccent,
    '--vscode-extensionButton-foreground': p.onAccent,
    '--vscode-charts-yellow': p.warning,
    '--vscode-charts-lines': p.muted,
    '--vscode-charts-foreground': p.fg,
    '--vscode-gitDecoration-addedResourceForeground': p.success,
    '--vscode-gitDecoration-deletedResourceForeground': p.danger,
    '--vscode-gitDecoration-modifiedResourceForeground': p.warning,
    '--vscode-gitDecoration-untrackedResourceForeground': p.success,
    '--vscode-gitDecoration-ignoredResourceForeground': p.tertiary,
    '--vscode-gitDecoration-conflictingResourceForeground': p.warning,
    '--vscode-gitDecoration-renamedResourceForeground': p.warning,
    '--vscode-gitDecoration-stageModifiedResourceForeground': p.warning,
    '--vscode-gitDecoration-stageDeletedResourceForeground': p.danger,
    '--vscode-gitDecoration-submoduleResourceForeground': p.info,
    '--vscode-list-hoverBackground': p.hover,
    '--vscode-list-activeSelectionBackground': `color-mix(in srgb, ${p.accent} 22%, transparent)`,
    '--vscode-list-activeSelectionForeground': p.fg,
    '--vscode-list-inactiveSelectionBackground': `color-mix(in srgb, ${p.accent} 12%, transparent)`,
    '--vscode-list-highlightForeground': p.accent,
    '--vscode-listFilterWidget-background': p.panel,
    '--vscode-menu-background': p.panel,
    '--vscode-menu-foreground': p.fg,
    '--vscode-menu-border': p.border,
    '--vscode-quickInput-background': p.panel,
    '--vscode-quickInput-foreground': p.fg,
    '--vscode-quickInputTitle-background': p.panel,
    '--vscode-notifications-background': p.panel,
    '--vscode-notificationCenterHeader-background': p.fog,
    '--vscode-panel-background': p.panel,
    '--vscode-panel-border': p.border,
    '--vscode-panelSectionHeader-background': p.panel,
    '--vscode-panelStickyScroll-background': p.panel,
    '--vscode-settings-headerForeground': p.fg,
    '--vscode-settings-headerBorder': p.border,
    '--vscode-settings-dropdownBackground': p.panel,
    '--vscode-settings-dropdownForeground': p.fg,
    '--vscode-settings-dropdownBorder': p.border,
    '--vscode-settings-dropdownListBorder': p.border,
    '--vscode-settings-textInputBackground': p.inputBg,
    '--vscode-settings-textInputForeground': p.fg,
    '--vscode-settings-textInputBorder': p.border,
    '--vscode-settings-numberInputBackground': p.inputBg,
    '--vscode-settings-numberInputForeground': p.fg,
    '--vscode-settings-numberInputBorder': p.border,
    '--vscode-settings-checkboxBackground': p.panel,
    '--vscode-settings-checkboxForeground': p.fg,
    '--vscode-settings-checkboxBorder': p.border,
    '--vscode-settings-focusedRowBorder': p.focus,
    '--vscode-settings-sashBorder': p.border,
    '--vscode-settings-settingsHeaderHoverForeground': p.fg,
    '--vscode-textLink-foreground': p.link,
    '--vscode-textLink-activeForeground': p.accent2,
    '--vscode-textBlockQuote-background': p.fog,
    '--vscode-textCodeBlock-background': p.codeBg,
    '--vscode-textPreformat-background': p.fog,
    '--vscode-textPreformat-foreground': p.fg,
    '--vscode-widget-border': p.border,
    '--vscode-widget-background': p.panel,
    '--vscode-focusBorder': p.focus,
    '--vscode-titleBar-activeBackground': p.base,
    '--vscode-titleBar-activeForeground': p.fg,
    '--vscode-titleBar-inactiveBackground': p.base,
    '--vscode-titleBar-inactiveForeground': p.muted,
    '--vscode-titleBar-border': p.border,
    '--vscode-activityBar-background': p.base,
    '--vscode-activityBar-foreground': p.fg,
    '--vscode-activityBar-inactiveForeground': p.muted,
    '--vscode-activityBar-border': p.border,
    '--vscode-statusBar-background': p.base,
    '--vscode-statusBar-foreground': p.fg,
    '--vscode-statusBar-border': p.border,
    '--vscode-tab-activeBackground': p.panel,
    '--vscode-tab-activeForeground': p.fg,
    '--vscode-tab-inactiveBackground': p.base,
    '--vscode-tab-inactiveForeground': p.muted,
    '--vscode-tab-border': p.border,
    '--vscode-tab-activeBorder': p.accent,
    '--vscode-tab-activeBorderTop': p.accent,
    '--vscode-badge-background': p.fog,
    '--vscode-badge-foreground': p.fg,
    '--vscode-breadcrumb-background': p.fog,
    '--vscode-breadcrumbPicker-background': p.panel,
    '--vscode-commandCenter-background': p.panel,
    '--vscode-debugToolBar-background': p.panel,
    '--vscode-dropdown-listBackground': p.panel,
    '--vscode-editorGroupHeader-tabsBackground': p.base,
    '--vscode-peekViewEditor-background': p.panel,
    '--vscode-peekViewResult-background': p.panel,
    '--vscode-peekViewTitle-background': p.panel,
    '--vscode-terminal-background': p.base,
    '--vscode-terminal-foreground': p.fg,
    '--vscode-terminal-border': p.border,
    '--vscode-multiDiffEditor-background': p.base,
    '--vscode-inlineChat-background': p.panel,
    '--vscode-inlineChatInput-background': p.inputBg,
    '--vscode-keybindingLabel-background': p.fog,
    '--vscode-progressBar-background': p.accent,
    '--vscode-scrollbarSlider-background': `color-mix(in srgb, ${p.accent} 22%, transparent)`,
    '--vscode-scrollbarSlider-hoverBackground': `color-mix(in srgb, ${p.accent} 35%, transparent)`,
    '--vscode-scrollbarSlider-activeBackground': `color-mix(in srgb, ${p.accent} 45%, transparent)`,
    '--vscode-errorForeground': p.danger,
    '--vscode-editorError-foreground': p.danger,
    '--vscode-editorWarning-foreground': p.warning,
    '--vscode-inputValidation-errorBackground': `color-mix(in srgb, ${p.accent} 14%, ${p.elevatedOpaque})`,
    '--vscode-inputValidation-errorForeground': p.fg,
    '--vscode-inputValidation-errorBorder': `color-mix(in srgb, ${p.danger} 45%, ${p.border})`,
    '--vscode-inputValidation-warningBackground': `color-mix(in srgb, ${p.accent} 12%, ${p.elevatedOpaque})`,
    '--vscode-inputValidation-warningForeground': p.fg,
    '--vscode-inputValidation-warningBorder': `color-mix(in srgb, ${p.warning} 40%, ${p.border})`,
    '--vscode-inputValidation-infoBackground': `color-mix(in srgb, ${p.accent} 12%, ${p.elevatedOpaque})`,
    '--vscode-inputValidation-infoForeground': p.fg,
    '--vscode-inputValidation-infoBorder': `color-mix(in srgb, ${p.info} 40%, ${p.border})`,
    '--vscode-notificationsErrorIcon-foreground': p.danger,
    '--vscode-notificationsWarningIcon-foreground': p.warning,
    '--vscode-charts-green': p.success,
    '--vscode-charts-blue': p.accent,
    '--vscode-charts-purple': p.accent2,
    '--vscode-charts-orange': p.warning,
    '--vscode-charts-red': p.danger,

    // Diffs
    '--diffs-addition-color-override': p.success,
    '--diffs-deletion-color-override': p.danger,

    // ===== Critical native palette (NOT color-token-*) — CDP verified =====
    // Native JS writes these on <html> without !important and can overwrite
    // our inline map — also emit in stylesheet with !important (see buildThemeCss).
    '--color-text': p.fg,
    '--color-text-foreground': p.fg,
    '--color-text-foreground-secondary': p.muted,
    '--color-text-foreground-tertiary': p.tertiary,
    '--color-text-accent': p.accent,
    '--color-text-on-accent': p.onAccent,
    '--color-text-button-primary': p.onAccent,
    '--color-text-button-secondary': p.muted,
    '--color-text-button-tertiary': p.tertiary,
    '--color-text-primary': p.fg,
    '--color-text-secondary': p.muted,
    '--color-text-tertiary': p.tertiary,
    '--color-text-error': p.danger,
    '--color-text-success': p.success,
    '--color-text-warning': p.warning,
    '--text-primary': p.fg,
    '--text-secondary': p.muted,
    '--text-status-error': p.danger,
    '--shimmer-text-secondary': p.muted,
    // Workbench / alternate namespaces seen in app CSS
    '--oai-wb-text-primary': p.fg,
    '--oai-wb-text-secondary': p.muted,
    '--oai-wb-text-tertiary': p.tertiary,

    '--color-icon-primary': p.fg,
    '--color-icon-secondary': p.muted,
    '--color-icon-tertiary': p.tertiary,
    '--color-icon-accent': p.accent,
    '--color-token-icon-foreground': p.muted,
    '--color-token-button-foreground': p.onAccent,
    '--color-token-disabled-foreground': `color-mix(in srgb, ${p.muted} 70%, transparent)`,
    '--color-token-text-preformat-foreground': p.fg,
    '--color-token-text-link-active-foreground': p.accent2,

    '--color-background-button-primary': p.accent,
    '--color-background-button-primary-hover': `color-mix(in srgb, ${p.accent} 85%, ${p.fg})`,
    '--color-background-button-primary-active': `color-mix(in srgb, ${p.accent} 75%, #000)`,
    '--color-background-button-primary-inactive': `color-mix(in srgb, ${p.accent} 40%, transparent)`,
    '--color-background-button-secondary': `color-mix(in srgb, ${p.fg} 8%, transparent)`,
    '--color-background-button-secondary-hover': `color-mix(in srgb, ${p.fg} 12%, transparent)`,
    '--color-background-button-secondary-active': `color-mix(in srgb, ${p.fg} 16%, transparent)`,
    '--color-background-button-secondary-inactive': `color-mix(in srgb, ${p.fg} 5%, transparent)`,
    '--color-background-button-tertiary': `color-mix(in srgb, ${p.fg} 4%, transparent)`,
    '--color-background-button-tertiary-hover': `color-mix(in srgb, ${p.fg} 8%, transparent)`,
    '--color-background-button-tertiary-active': `color-mix(in srgb, ${p.fg} 12%, transparent)`,
    '--color-background-editor-opaque': p.elevatedOpaque,
    '--color-editor-added': `color-mix(in srgb, ${p.success} 23%, transparent)`,
    '--color-editor-deleted': `color-mix(in srgb, ${p.danger} 23%, transparent)`,

    // Editor / shell foreground aliases
    '--color-token-editor-foreground': p.fg,
    '--color-token-editor-background': p.base,
    '--color-token-sidebar-foreground': p.fg,
    '--color-token-panel-foreground': p.fg,
    '--color-token-titlebar-foreground': p.fg,
    '--color-token-tab-active-foreground': p.fg,
    '--color-token-tab-inactive-foreground': p.muted,
    '--color-token-breadcrumb-foreground': p.muted,
    '--color-token-list-hover-foreground': p.fg,
    '--color-token-list-inactive-selection-foreground': p.fg,
    '--color-token-menu-foreground': p.fg,
    '--color-token-button-secondary-foreground': p.muted,
    '--color-token-badge-foreground': p.fg,
    '--color-token-terminal-foreground': p.fg,
    '--color-token-terminal-ansi-white': p.fg,
    '--color-token-terminal-ansi-bright-white': p.fg,
    '--color-token-terminal-ansi-black': p.tertiary,
    '--color-token-terminal-ansi-red': p.danger,
    '--color-token-terminal-ansi-green': p.success,
    '--color-token-terminal-ansi-yellow': p.warning,
    '--color-token-terminal-ansi-blue': p.accent,
    '--color-token-terminal-ansi-magenta': p.accent2,
    '--color-token-terminal-ansi-cyan': p.info,
    '--color-token-text-code-foreground': p.fg,

    // More VS Code leftovers still pure white
    '--vscode-editorWidget-foreground': p.fg,
    '--vscode-editorHoverWidget-foreground': p.fg,
    '--vscode-editorActionList-foreground': p.fg,
    '--vscode-editorActionList-focusForeground': p.fg,
    '--vscode-editorWhitespace-foreground': p.tertiary,
    '--vscode-list-focusHighlightForeground': p.accent,
    '--vscode-list-deemphasizedForeground': p.muted,
    '--vscode-list-activeSelectionIconForeground': p.fg,
    '--vscode-quickInputList-focusForeground': p.fg,
    '--vscode-quickInputList-focusIconForeground': p.fg,
    '--vscode-pickerGroup-foreground': p.muted,
    '--vscode-inputOption-activeForeground': p.fg,
    '--vscode-radio-activeForeground': p.fg,
    '--vscode-menu-selectionForeground': p.onAccent,
    '--vscode-textSeparator-foreground': p.border,
    '--vscode-terminal-ansiWhite': p.fg,
    '--vscode-terminal-ansiBrightWhite': p.fg,
    '--vscode-terminal-ansiBlack': p.tertiary,
    '--vscode-terminal-ansiBrightBlack': p.muted,
    '--vscode-terminal-ansiRed': p.danger,
    '--vscode-terminal-ansiBrightRed': p.danger,
    '--vscode-terminal-ansiGreen': p.success,
    '--vscode-terminal-ansiBrightGreen': p.success,
    '--vscode-terminal-ansiYellow': p.warning,
    '--vscode-terminal-ansiBrightYellow': p.warning,
    '--vscode-terminal-ansiBlue': p.accent,
    '--vscode-terminal-ansiBrightBlue': p.accent,
    '--vscode-terminal-ansiMagenta': p.accent2,
    '--vscode-terminal-ansiBrightMagenta': p.accent2,
    '--vscode-terminal-ansiCyan': p.info,
    '--vscode-terminal-ansiBrightCyan': p.info,
    '--vscode-debugConsole-sourceForeground': p.fg,
    '--vscode-debugView-stateLabelForeground': p.fg,
    '--vscode-editorMultiCursor-primary.foreground': p.fg,
    '--vscode-editorMultiCursor-secondary.foreground': p.muted
  }
  return map
}

export function buildThemeCss(tokens: ThemeTokens, extraCss = ''): string {
  const p = buildPalette(tokens)
  const map = buildTokenMap(tokens)
  const varBlock = Object.entries(map)
    .map(([k, v]) => `  ${k}: ${v} !important;`)
    .join('\n')

  return `
/* ===== Codex Customizer — settings-complete theme ===== */
html.${ROOT},
html.${ROOT}.electron-dark,
html.${ROOT}.electron-opaque,
html.${ROOT} body,
html.${ROOT}[data-codex-window-type="electron"],
html.${ROOT}[data-codex-window-type="electron"].electron-opaque,
html.${ROOT}[data-codex-window-type="electron"].electron-opaque body {
${varBlock}
  color-scheme: ${p.light ? 'light' : 'dark'} !important;
}

/* Root canvas */
html.${ROOT},
html.${ROOT} body {
  font-family: ${tokens.fontFamily} !important;
  background-color: ${p.base} !important;
  color: var(--cc-text-primary) !important;
  -webkit-font-smoothing: antialiased;
}

html.${ROOT} body {
  background-image:
    radial-gradient(900px 520px at 6% -12%, color-mix(in srgb, ${p.accent} 14%, transparent), transparent 58%),
    radial-gradient(720px 420px at 100% 0%, color-mix(in srgb, ${p.accent2} 10%, transparent), transparent 52%) !important;
  background-attachment: fixed !important;
}

/* Shell */
html.${ROOT} aside.app-shell-left-panel,
html.${ROOT} .app-shell-left-panel {
  background: color-mix(in srgb, ${p.base} 88%, ${p.accent} 6%) !important;
  border-color: ${p.border} !important;
  color: var(--cc-text-primary) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.${ROOT} main.main-surface {
  background: ${p.base} !important;
  border-color: ${p.border} !important;
  color: var(--cc-text-primary) !important;
}

/* Keep header specificity low so preset customCss can fully repaint caption chrome */
html.${ROOT} header.app-header-tint {
  background: color-mix(in srgb, ${p.base} 94%, transparent) !important;
  border-bottom-color: ${p.border} !important;
  backdrop-filter: none !important;
  color: var(--cc-text-primary) !important;
}
html.${ROOT} main.main-surface > header:not(.app-header-tint) {
  background: color-mix(in srgb, ${p.base} 94%, transparent) !important;
  border-bottom-color: ${p.border} !important;
  color: var(--cc-text-primary) !important;
}

html.${ROOT} .composer-surface-chrome {
  background: ${p.inputBg} !important;
  border-color: ${p.border} !important;
  box-shadow: 0 6px 20px color-mix(in srgb, ${p.base} 40%, transparent) !important;
  backdrop-filter: none !important;
}
html.${ROOT} .composer-surface-chrome::before,
html.${ROOT} .composer-surface-chrome::after {
  content: none !important;
  display: none !important;
}

/* ===== Settings page (general / appearance / git / …) ===== */

/* Selected settings nav row */
html.${ROOT} button[data-settings-panel-slug],
html.${ROOT} [data-settings-panel-slug] {
  color: var(--cc-text-primary) !important;
}
html.${ROOT} button[data-settings-panel-slug][aria-current="page"],
html.${ROOT} button[data-settings-panel-slug].bg-token-list-hover-background,
html.${ROOT} button[data-settings-panel-slug]:has(.bg-token-list-hover-background) {
  background: ${p.hover} !important;
  color: var(--cc-text-primary) !important;
}

/* Settings section cards — fog / elevated panels */
html.${ROOT} .bg-token-bg-fog,
html.${ROOT} [class*="bg-token-bg-fog"] {
  background-color: ${p.card} !important;
  border-color: ${p.border} !important;
}

html.${ROOT} .bg-token-input-background,
html.${ROOT} [class*="bg-token-input-background"] {
  background-color: ${p.inputBg} !important;
}

html.${ROOT} [class*="bg-token-foreground/"] {
  background-color: color-mix(in srgb, ${p.fg} 8%, transparent) !important;
}

/* Switch track + thumb (settings toggles) */
html.${ROOT} [role="switch"] {
  color: var(--cc-text-primary) !important;
}
html.${ROOT} [role="switch"] > span.relative {
  background-color: ${p.trackOff} !important;
}
html.${ROOT} [role="switch"][data-state="checked"] > span.relative,
html.${ROOT} [role="switch"][aria-checked="true"] > span.relative {
  background-color: ${p.accent} !important;
}
/* Thumb knobs (gray-0 remap + direct paint) */
html.${ROOT} [role="switch"] span.shadow-sm.rounded-full,
html.${ROOT} [role="switch"] span.rounded-full.border {
  background-color: ${p.knob} !important;
  border-color: color-mix(in srgb, ${p.base} 25%, transparent) !important;
}

/* Dropdown / select chips on settings */
html.${ROOT} button.border-token-border,
html.${ROOT} [class*="border-token-border"].border {
  border-color: ${p.border} !important;
  background-color: color-mix(in srgb, ${p.fg} 4%, transparent) !important;
  color: var(--cc-text-primary) !important;
}

/* ===== Typography — force theme text across the app ===== */

/* Shell inherits primary so unmarked nodes follow theme */
html.${ROOT} body,
html.${ROOT} #root,
html.${ROOT} main.main-surface,
html.${ROOT} aside.app-shell-left-panel,
html.${ROOT} .app-shell-left-panel,
html.${ROOT} header.app-header-tint,
html.${ROOT} nav,
html.${ROOT} [role="dialog"],
html.${ROOT} [role="menu"] {
  color: var(--cc-text-primary) !important;
}

html.${ROOT} h1,
html.${ROOT} h2,
html.${ROOT} h3,
html.${ROOT} h4,
html.${ROOT} h5,
html.${ROOT} h6,
html.${ROOT} [class*="_heading"] {
  color: var(--cc-text-primary) !important;
}

/* Primary body text + common utilities
   (exclude charts-red / error so semantic chips keep danger color) */
html.${ROOT} .text-token-foreground,
html.${ROOT} .text-token-text-primary,
html.${ROOT} .text-token-input-foreground,
html.${ROOT} .text-token-list-active-selection-foreground,
html.${ROOT} [class*="text-token-foreground"]:not([class*="error"]):not([class*="charts-red"]),
html.${ROOT} [class*="text-token-text-primary"],
html.${ROOT} .text-fade-truncate,
html.${ROOT} .font-openai-sans,
html.${ROOT} .font-semibold:not([class*="charts-red"]):not([class*="error"]),
html.${ROOT} .text-base:not([class*="charts-red"]):not([class*="error"]),
html.${ROOT} .text-sm:not([class*="charts-red"]):not([class*="error"]),
html.${ROOT} .text-md,
html.${ROOT} .text-size-chat,
html.${ROOT} .text-size-chat-sm {
  color: var(--cc-text-primary) !important;
}

/* Neutral Tailwind leftovers → theme primary */
html.${ROOT} .text-white,
html.${ROOT} [class*="text-white"],
html.${ROOT} .text-black,
html.${ROOT} [class*="text-neutral-"],
html.${ROOT} [class*="text-zinc-"],
html.${ROOT} [class*="text-gray-"],
html.${ROOT} [class*="text-slate-"] {
  color: var(--cc-text-primary) !important;
}

/* Secondary / descriptions — accent-tinted, no opacity washout */
html.${ROOT} .text-token-text-secondary,
html.${ROOT} .text-token-description-foreground,
html.${ROOT} .text-token-button-tertiary-foreground,
html.${ROOT} .text-token-muted-foreground,
html.${ROOT} .text-token-conversation-body,
html.${ROOT} [class*="text-token-text-secondary"],
html.${ROOT} [class*="text-token-description"],
html.${ROOT} [class*="text-token-muted"],
html.${ROOT} [class*="text-token-conversation"] {
  color: var(--cc-text-secondary) !important;
  opacity: 1 !important;
}

html.${ROOT} .text-token-text-tertiary,
html.${ROOT} .text-token-input-placeholder-foreground,
html.${ROOT} [class*="text-token-text-tertiary"],
html.${ROOT} [class*="text-token-input-placeholder"] {
  color: var(--cc-text-tertiary) !important;
  opacity: 1 !important;
}

/* opacity stacked on token text — restore contrast */
html.${ROOT} [class*="text-token"].opacity-50,
html.${ROOT} [class*="text-token"].opacity-60,
html.${ROOT} [class*="text-token"].opacity-70,
html.${ROOT} [class*="text-token"].opacity-75,
html.${ROOT} .text-token-description-foreground.opacity-50,
html.${ROOT} .text-token-text-secondary.opacity-50,
html.${ROOT} .text-token-text-tertiary.opacity-50,
html.${ROOT} .text-token-input-placeholder-foreground.opacity-75 {
  opacity: 1 !important;
  color: var(--cc-text-secondary) !important;
}

/* Markdown + chat body — native uses var(--text-primary) on _markdownContent */
html.${ROOT} [class*="_markdownContent"],
html.${ROOT} [class*="_markdownText"],
html.${ROOT} [class*="_paragraph"],
html.${ROOT} article,
html.${ROOT} [data-message-author-role],
html.${ROOT} .ProseMirror,
html.${ROOT} [role="main"] p,
html.${ROOT} main.main-surface p,
html.${ROOT} main.main-surface li {
  color: var(--cc-text-primary) !important;
  -webkit-text-fill-color: var(--cc-text-primary) !important;
}

html.${ROOT} [class*="_markdownText"] strong,
html.${ROOT} [class*="_paragraph"] strong,
html.${ROOT} main.main-surface strong,
html.${ROOT} main.main-surface b {
  color: var(--cc-text-primary) !important;
  -webkit-text-fill-color: var(--cc-text-primary) !important;
}

/* Message bubbles that use token-foreground wash (class: bg-token-foreground/5) */
html.${ROOT} [class*="bg-token-foreground"] {
  color: var(--cc-text-primary) !important;
}

/* Settings nav + smaller helper copy */
html.${ROOT} button[data-settings-panel-slug] {
  color: var(--cc-text-primary) !important;
}
html.${ROOT} main.main-surface .text-sm:not([class*="font-semibold"]):not([class*="font-bold"]):not([class*="git-decoration"]),
html.${ROOT} main.main-surface .text-xs:not([class*="font-semibold"]):not([class*="git-decoration"]):not([class*="charts"]) {
  color: var(--cc-text-secondary) !important;
}

/* Inline code chips */
html.${ROOT} [class*="_inlineMarkdown"],
html.${ROOT} .inline-markdown,
html.${ROOT} p code,
html.${ROOT} li code,
html.${ROOT} span code,
html.${ROOT} [class*="markdown"] code {
  color: var(--cc-text-primary) !important;
  background-color: ${p.codeBg} !important;
  border-radius: 6px;
}

/* Code blocks */
html.${ROOT} pre,
html.${ROOT} pre code,
html.${ROOT} code.whitespace-pre\\!,
html.${ROOT} [class*="code-block"],
html.${ROOT} [class*="CodeBlock"] {
  color: var(--cc-text-primary) !important;
  background-color: ${p.codeBg} !important;
}

/* File path / content links */
html.${ROOT} a:not([role="button"]),
html.${ROOT} [class*="text-token-text-link"],
html.${ROOT} .text-token-text-link-foreground,
html.${ROOT} main.main-surface a {
  color: ${p.link} !important;
}
html.${ROOT} a:not([role="button"]):hover,
html.${ROOT} main.main-surface a:hover {
  color: ${p.accent2} !important;
}

/* Keybinding chips */
html.${ROOT} kbd,
html.${ROOT} [class*="keybinding"],
html.${ROOT} [class*="Keybinding"] {
  color: var(--cc-text-secondary) !important;
}
/* Don't force ALL tabular-nums (diff counts need semantic colors) */
html.${ROOT} kbd.tabular-nums,
html.${ROOT} [class*="keybinding"] .tabular-nums {
  color: var(--cc-text-secondary) !important;
}

/* Semantic colors (keep intentional) */
html.${ROOT} .text-token-error-foreground,
html.${ROOT} [class*="text-token-error"],
html.${ROOT} [class*="text-token-charts-red"],
html.${ROOT} [class*="text-token-git-decoration-deleted"] {
  color: ${p.danger} !important;
  -webkit-text-fill-color: ${p.danger} !important;
}
html.${ROOT} .text-token-editor-warning-foreground,
html.${ROOT} [class*="text-token-editor-warning"],
html.${ROOT} [class*="text-token-charts-orange"],
html.${ROOT} [class*="text-token-charts-yellow"] {
  color: ${p.warning} !important;
  -webkit-text-fill-color: ${p.warning} !important;
}
html.${ROOT} [class*="text-token-charts-green"],
html.${ROOT} [class*="text-token-git-decoration-added"] {
  color: ${p.success} !important;
  -webkit-text-fill-color: ${p.success} !important;
}
html.${ROOT} [class*="text-token-charts-blue"] {
  color: ${p.accent} !important;
}
html.${ROOT} [class*="text-token-git-decoration-modified"] {
  color: ${p.warning} !important;
}

/* ===== Validation callouts — scheme A: theme surface + semantic accent =====
   Full access / settings tips blend into Forest (etc.), not solid red/gold blocks.
   Semantic cue: left border + icon color (danger/warning), body uses theme fg.
*/
html.${ROOT} [class*="bg-token-input-validation-error-background"],
html.${ROOT} [class*="validation-error-background"],
html.${ROOT} [class*="bg-token-input-validation-error"]:not([class*="absolute"]) {
  background-color: color-mix(in srgb, ${p.accent} 14%, ${p.elevatedOpaque}) !important;
  opacity: 1 !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
html.${ROOT} [class*="bg-token-input-validation-warning-background"],
html.${ROOT} [class*="validation-warning-background"] {
  background-color: color-mix(in srgb, ${p.accent} 12%, ${p.elevatedOpaque}) !important;
  opacity: 1 !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
html.${ROOT} [class*="bg-token-input-validation-info-background"],
html.${ROOT} [class*="validation-info-background"] {
  background-color: color-mix(in srgb, ${p.accent} 12%, ${p.elevatedOpaque}) !important;
  opacity: 1 !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Error card shell: theme surface only.
   Full access banner is ATTACHED to composer (native -mb-8 + rounded-t-3xl).
   No left accent bar / outer ring — both look like broken UI on the tuck. */
html.${ROOT} [class*="bg-token-input-validation-error"]:not([class*="absolute"]),
html.${ROOT} [class*="text-token-error-foreground"],
html.${ROOT} :has(> [class*="bg-token-input-validation-error-background"]),
html.${ROOT} :has(> [class*="validation-error-background"]) {
  color: var(--cc-text-primary) !important;
  -webkit-text-fill-color: var(--cc-text-primary) !important;
  border-color: transparent !important;
  border-width: 0 !important;
  box-shadow: none !important;
  opacity: 1 !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
/* Keep native tuck under composer */
html.${ROOT} [class*="bg-token-input-validation-error"][class*="-mb-"],
html.${ROOT} [class*="bg-token-input-validation-error"].-mb-8 {
  margin-bottom: -2rem !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  z-index: 0 !important;
  box-shadow: none !important;
}
/* Title / primary lines */
html.${ROOT} [class*="bg-token-input-validation-error"] .font-semibold,
html.${ROOT} [class*="bg-token-input-validation-error"] .text-xs.font-semibold,
html.${ROOT} [class*="text-token-error-foreground"] .font-semibold,
html.${ROOT} :has(> [class*="bg-token-input-validation-error-background"]) .font-semibold {
  color: var(--cc-text-primary) !important;
  -webkit-text-fill-color: var(--cc-text-primary) !important;
  opacity: 1 !important;
}
/* Body copy → secondary */
html.${ROOT} [class*="bg-token-input-validation-error"] .leading-4,
html.${ROOT} [class*="bg-token-input-validation-error"] [class*="mt-0"],
html.${ROOT} [class*="bg-token-input-validation-error"] .text-xs:not(.font-semibold),
html.${ROOT} [class*="text-token-error-foreground"] .leading-4,
html.${ROOT} [class*="text-token-error-foreground"] [class*="mt-0"],
html.${ROOT} :has(> [class*="bg-token-input-validation-error-background"]) .leading-4,
html.${ROOT} :has(> [class*="bg-token-input-validation-error-background"]) [class*="mt-0"] {
  color: var(--cc-text-secondary) !important;
  -webkit-text-fill-color: var(--cc-text-secondary) !important;
  opacity: 1 !important;
}
/* Icon → accent (fully themed) */
html.${ROOT} [class*="bg-token-input-validation-error"] > .flex > svg,
html.${ROOT} [class*="bg-token-input-validation-error"] svg.icon-sm,
html.${ROOT} [class*="text-token-error-foreground"] > .flex > svg,
html.${ROOT} [class*="bg-token-input-validation-error"] svg {
  color: ${p.accent} !important;
  -webkit-text-fill-color: ${p.accent} !important;
  fill: currentColor;
}
html.${ROOT} [class*="bg-token-input-validation-error"] svg path,
html.${ROOT} [class*="text-token-error-foreground"] svg path {
  fill: currentColor !important;
}
/* Hide button: themed chip */
html.${ROOT} [class*="bg-token-input-validation-error"] button,
html.${ROOT} :has(> [class*="bg-token-input-validation-error-background"]) button,
html.${ROOT} button[class*="text-token-charts-red"],
html.${ROOT} button[class*="bg-token-charts-red"] {
  color: var(--cc-text-secondary) !important;
  -webkit-text-fill-color: var(--cc-text-secondary) !important;
  background-color: color-mix(in srgb, ${p.fg} 8%, transparent) !important;
  border-color: ${p.border} !important;
  opacity: 1 !important;
}
html.${ROOT} button[class*="bg-token-charts-red"]:hover,
html.${ROOT} [class*="bg-token-input-validation-error"] button:hover {
  background-color: color-mix(in srgb, ${p.accent} 16%, transparent) !important;
  color: var(--cc-text-primary) !important;
  -webkit-text-fill-color: var(--cc-text-primary) !important;
}

/* Warning tips — theme surface, light elevation only (no thick left bar) */
html.${ROOT} :has(> [class*="bg-token-input-validation-warning-background"]),
html.${ROOT} :has(> [class*="validation-warning-background"]),
html.${ROOT} [class*="border-token-editor-warning-foreground"] {
  border-color: ${p.border} !important;
  box-shadow: 0 0 0 0.5px color-mix(in srgb, ${p.accent} 22%, transparent) !important;
  opacity: 1 !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  color: var(--cc-text-primary) !important;
  -webkit-text-fill-color: var(--cc-text-primary) !important;
}
html.${ROOT} :has(> [class*="bg-token-input-validation-warning-background"]) .font-semibold,
html.${ROOT} [class*="border-token-editor-warning-foreground"] .font-semibold {
  color: var(--cc-text-primary) !important;
  -webkit-text-fill-color: var(--cc-text-primary) !important;
}
html.${ROOT} :has(> [class*="bg-token-input-validation-warning-background"]) .leading-4,
html.${ROOT} :has(> [class*="bg-token-input-validation-warning-background"]) [class*="text-pretty"],
html.${ROOT} :has(> [class*="bg-token-input-validation-warning-background"]) .text-xs:not(.font-semibold),
html.${ROOT} [class*="border-token-editor-warning-foreground"] .text-pretty,
html.${ROOT} [class*="border-token-editor-warning-foreground"] [class*="text-pretty"] {
  color: var(--cc-text-secondary) !important;
  -webkit-text-fill-color: var(--cc-text-secondary) !important;
  opacity: 1 !important;
}
html.${ROOT} :has(> [class*="bg-token-input-validation-warning-background"]) svg,
html.${ROOT} [class*="border-token-editor-warning-foreground"] svg {
  color: ${p.accent} !important;
  -webkit-text-fill-color: ${p.accent} !important;
  fill: currentColor;
}
html.${ROOT} :has(> [class*="bg-token-input-validation-warning-background"]) svg path,
html.${ROOT} [class*="border-token-editor-warning-foreground"] svg path {
  fill: currentColor !important;
}

/* Info callouts — theme surface + light elevation (no thick left bar) */
html.${ROOT} :has(> [class*="bg-token-input-validation-info-background"]),
html.${ROOT} :has(> [class*="validation-info-background"]) {
  color: var(--cc-text-primary) !important;
  border-color: ${p.border} !important;
  box-shadow: 0 0 0 0.5px color-mix(in srgb, ${p.accent} 22%, transparent) !important;
  opacity: 1 !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
html.${ROOT} :has(> [class*="bg-token-input-validation-info-background"]) > *:not([class*="validation-info-background"]),
html.${ROOT} :has(> [class*="bg-token-input-validation-info-background"]) svg {
  color: var(--cc-text-primary) !important;
  -webkit-text-fill-color: var(--cc-text-primary) !important;
  fill: currentColor;
}
html.${ROOT} [class*="bg-token-input-validation-info"]:not([class*="absolute"]) {
  background-color: color-mix(in srgb, ${p.accent} 12%, ${p.elevatedOpaque}) !important;
  color: var(--cc-text-primary) !important;
  opacity: 1 !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Mentions */
html.${ROOT} [class*="inline-mention"],
html.${ROOT} [style*="--inline-mention"] {
  color: ${p.mention} !important;
}

/* VS Code font tokens */
html.${ROOT} [class*="text-[var(--vscode-foreground)]"] {
  color: var(--cc-text-primary) !important;
}

/* Disabled */
html.${ROOT} :disabled,
html.${ROOT} [aria-disabled="true"] {
  color: var(--cc-text-tertiary) !important;
}

/* Section labels */
html.${ROOT} .text-token-input-placeholder-foreground.font-medium,
html.${ROOT} [class*="section-toggle"],
html.${ROOT} [class*="ModelPicker"] {
  color: var(--cc-text-secondary) !important;
  opacity: 1 !important;
}

/* Placeholders */
html.${ROOT} [data-placeholder]::before,
html.${ROOT} .ProseMirror p.is-editor-empty::before,
html.${ROOT} textarea::placeholder,
html.${ROOT} input::placeholder {
  color: var(--cc-text-tertiary) !important;
  opacity: 1 !important;
}

/* Dropdown labels (e.g. 完全访问) */
html.${ROOT} [class*="dropdownLabelValue"],
html.${ROOT} [class*="_dropdownLabelValue"] {
  color: ${p.accent} !important;
}

/* Banner body copy under titles (global) */
html.${ROOT} .text-xs.leading-4,
html.${ROOT} [class*="mt-0"].leading-4 {
  color: var(--cc-text-secondary) !important;
}

/* Callouts beat globals: title primary, body secondary, icon accent */
html.${ROOT} [class*="bg-token-input-validation-error"] .text-xs.font-semibold,
html.${ROOT} [class*="bg-token-input-validation-error"] .font-semibold,
html.${ROOT} [class*="text-token-error-foreground"] .font-semibold,
html.${ROOT} :has(> [class*="validation-error-background"]) .font-semibold {
  color: var(--cc-text-primary) !important;
  -webkit-text-fill-color: var(--cc-text-primary) !important;
  opacity: 1 !important;
}
html.${ROOT} [class*="bg-token-input-validation-error"] .text-xs.leading-4,
html.${ROOT} [class*="bg-token-input-validation-error"] [class*="mt-0"].leading-4,
html.${ROOT} [class*="bg-token-input-validation-error"] [class*="mt-0"],
html.${ROOT} [class*="bg-token-input-validation-error"] .text-xs:not(.font-semibold),
html.${ROOT} [class*="text-token-error-foreground"] .leading-4,
html.${ROOT} [class*="text-token-error-foreground"] [class*="mt-0"],
html.${ROOT} :has(> [class*="validation-error-background"]) .leading-4 {
  color: var(--cc-text-secondary) !important;
  -webkit-text-fill-color: var(--cc-text-secondary) !important;
  opacity: 1 !important;
}
html.${ROOT} [class*="bg-token-input-validation-error"] svg,
html.${ROOT} [class*="text-token-error-foreground"] svg {
  color: ${p.accent} !important;
  -webkit-text-fill-color: ${p.accent} !important;
}
html.${ROOT} :has(> [class*="validation-warning-background"]) .font-semibold,
html.${ROOT} :has(> [class*="bg-token-input-validation-warning-background"]) .font-semibold {
  color: var(--cc-text-primary) !important;
  -webkit-text-fill-color: var(--cc-text-primary) !important;
}
html.${ROOT} :has(> [class*="validation-warning-background"]) .leading-4,
html.${ROOT} :has(> [class*="validation-warning-background"]) [class*="text-pretty"],
html.${ROOT} :has(> [class*="bg-token-input-validation-warning-background"]) .text-xs:not(.font-semibold),
html.${ROOT} :has(> [class*="bg-token-input-validation-warning-background"]) [class*="text-pretty"],
html.${ROOT} [class*="border-token-editor-warning-foreground"] .text-xs,
html.${ROOT} [class*="border-token-editor-warning-foreground"] [class*="text-pretty"] {
  color: var(--cc-text-secondary) !important;
  -webkit-text-fill-color: var(--cc-text-secondary) !important;
  opacity: 1 !important;
}
html.${ROOT} :has(> [class*="bg-token-input-validation-warning-background"]) svg,
html.${ROOT} [class*="border-token-editor-warning-foreground"] svg {
  color: ${p.accent} !important;
  -webkit-text-fill-color: ${p.accent} !important;
  fill: currentColor;
}
html.${ROOT} :has(> [class*="validation-info-background"]) .font-semibold,
html.${ROOT} :has(> [class*="bg-token-input-validation-info-background"]) .font-semibold {
  color: var(--cc-text-primary) !important;
  -webkit-text-fill-color: var(--cc-text-primary) !important;
}

/* ===== Syntax highlight / code language blocks (hardcoded white) ===== */
html.${ROOT} code[class*="language-"],
html.${ROOT} pre[class*="language-"],
html.${ROOT} .hljs,
html.${ROOT} :is(.dark, .electron-dark) code[class*="language-"],
html.${ROOT} :is(.dark, .electron-dark) pre[class*="language-"] {
  color: var(--cc-text-primary) !important;
}
html.${ROOT} .hljs-comment,
html.${ROOT} .hljs-meta,
html.${ROOT} .hljs-quote {
  color: var(--cc-text-tertiary) !important;
}
html.${ROOT} .hljs-keyword,
html.${ROOT} .hljs-selector-tag,
html.${ROOT} .hljs-title,
html.${ROOT} .hljs-section,
html.${ROOT} .hljs-doctag,
html.${ROOT} .hljs-name,
html.${ROOT} .hljs-strong {
  color: ${p.accent} !important;
}
html.${ROOT} .hljs-string,
html.${ROOT} .hljs-attr,
html.${ROOT} .hljs-symbol,
html.${ROOT} .hljs-bullet,
html.${ROOT} .hljs-addition,
html.${ROOT} .hljs-template-tag,
html.${ROOT} .hljs-template-variable {
  color: ${p.success} !important;
}
html.${ROOT} .hljs-number,
html.${ROOT} .hljs-literal,
html.${ROOT} .hljs-type,
html.${ROOT} .hljs-built_in,
html.${ROOT} .hljs-builtin-name {
  color: ${p.warning} !important;
}
html.${ROOT} .hljs-variable,
html.${ROOT} .hljs-params,
html.${ROOT} .hljs-class .hljs-title {
  color: var(--cc-text-primary) !important;
}
html.${ROOT} .hljs-deletion {
  color: ${p.danger} !important;
}

/* Native color-text-* utilities (if present as classes) */
html.${ROOT} [class*="text-foreground"],
html.${ROOT} [class*="text-primary"]:not([class*="button"]) {
  color: var(--cc-text-primary) !important;
}
html.${ROOT} [class*="text-secondary"]:not([class*="button"]),
html.${ROOT} [class*="text-muted"] {
  color: var(--cc-text-secondary) !important;
}
html.${ROOT} [class*="text-tertiary"] {
  color: var(--cc-text-tertiary) !important;
}
html.${ROOT} [class*="text-accent"]:not([class*="on-accent"]) {
  color: ${p.accent} !important;
}

/* Pair webkit fill with color so fills can't stay pure white */
html.${ROOT} body,
html.${ROOT} main.main-surface,
html.${ROOT} aside.app-shell-left-panel,
html.${ROOT} .text-token-foreground,
html.${ROOT} .text-token-text-primary,
html.${ROOT} [class*="_markdownText"],
html.${ROOT} [class*="_paragraph"] {
  -webkit-text-fill-color: currentColor;
}

/* Icons in settings nav */
html.${ROOT} button[data-settings-panel-slug] svg,
html.${ROOT} nav svg.icon-xs,
html.${ROOT} nav svg.icon-2xs,
html.${ROOT} svg.icon-xs,
html.${ROOT} svg.icon-2xs,
html.${ROOT} svg[class*="icon-"],
html.${ROOT} button svg,
html.${ROOT} a svg,
html.${ROOT} aside svg,
html.${ROOT} header svg {
  color: var(--cc-text-secondary) !important;
}
html.${ROOT} button[data-settings-panel-slug][aria-current="page"] svg,
html.${ROOT} button:hover svg,
html.${ROOT} [aria-current="page"] svg {
  color: ${p.accent} !important;
}
html.${ROOT} svg.icon-xs path[fill="currentColor"],
html.${ROOT} svg.icon-2xs path[fill="currentColor"],
html.${ROOT} button svg path[fill="currentColor"],
html.${ROOT} svg[class*="icon-"] path[fill="currentColor"] {
  fill: currentColor !important;
}
html.${ROOT} button svg path[stroke]:not([stroke="none"]),
html.${ROOT} svg[class*="icon-"] path[stroke]:not([stroke="none"]) {
  stroke: currentColor !important;
}

/* Sidebar selection */
html.${ROOT} aside.app-shell-left-panel [aria-current="page"],
html.${ROOT} aside.app-shell-left-panel [aria-selected="true"] {
  background: ${p.hover} !important;
  color: var(--cc-text-primary) !important;
  box-shadow: inset 2px 0 0 ${p.accent} !important;
}
html.${ROOT} aside.app-shell-left-panel button:hover,
html.${ROOT} aside.app-shell-left-panel a:hover {
  background: ${p.hover} !important;
  color: var(--cc-text-primary) !important;
}

/* Primary buttons */
html.${ROOT} button.bg-token-foreground,
html.${ROOT} button[class~="bg-token-foreground"],
html.${ROOT} [data-variant="primary"] {
  background: linear-gradient(135deg, ${p.accent}, ${p.accent2}) !important;
  color: ${p.onAccent} !important;
  border-color: transparent !important;
}

/* Forms */
html.${ROOT} textarea,
html.${ROOT} input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]),
html.${ROOT} [contenteditable="true"] {
  color: var(--cc-text-primary) !important;
  caret-color: var(--cc-accent) !important;
}
html.${ROOT} input[type="checkbox"],
html.${ROOT} input[type="radio"] {
  accent-color: ${p.accent};
}

/* Dialogs / menus */
html.${ROOT} [role="dialog"],
html.${ROOT} [role="menu"],
html.${ROOT} [data-radix-popper-content-wrapper] > * {
  background-color: ${p.panel} !important;
  border-color: ${p.border} !important;
  color: var(--cc-text-primary) !important;
}

/* Right rail */
html.${ROOT} main.main-surface aside,
html.${ROOT} [class*="right-rail"],
html.${ROOT} [class*="inspector"] {
  background-color: color-mix(in srgb, ${p.base} 96%, transparent) !important;
  border-color: ${p.border} !important;
  color: var(--cc-text-primary) !important;
}

/* Scrollbars */
html.${ROOT} ::-webkit-scrollbar { width: 8px; height: 8px; }
html.${ROOT} ::-webkit-scrollbar-track { background: transparent; }
html.${ROOT} ::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, ${p.accent} 30%, transparent);
  border-radius: 999px;
}

html.${ROOT} ::selection {
  background: color-mix(in srgb, ${p.accent} 35%, transparent);
  color: var(--cc-text-primary);
}

${extraCss ? `\n/* --- user / preset extra --- */\n${extraCss}\n` : ''}
`.trim()
}

export const ROOT_CLASS = ROOT
export const STYLE_TAG_ID = 'codex-customizer-injected-style'
