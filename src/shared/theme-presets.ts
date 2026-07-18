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
  },
  {
    // QQ 2007 / Windows XP Luna Blue — dense classic chrome (not modern white SaaS)
    id: 'codex-2007',
    nameKey: 'presets.codex2007.name',
    descriptionKey: 'presets.codex2007.description',
    preview: {
      primary: '#0A5ABF',
      secondary: '#5EB5F7',
      background: '#5BA3D9'
    },
    tokens: {
      accent: '#0A5ABF',
      accentSecondary: '#3C9AF0',
      // Desktop Luna wash — NOT clinical white
      bgBase: '#6BAFDF',
      // XP content surface: soft blue-gray paper (QQ chat pane)
      bgElevated: '#E8F1F9',
      bgGlass: 'rgba(232, 241, 249, 0.96)',
      textPrimary: '#0A1E33',
      textSecondary: 'rgba(10, 40, 70, 0.72)',
      border: 'rgba(5, 84, 168, 0.55)',
      success: '#2E9B4A',
      warning: '#D4880F',
      danger: '#C73B3B',
      fontFamily:
        'Tahoma, "MS Sans Serif", "Segoe UI", "Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", "SimSun", system-ui, sans-serif',
      radius: 2,
      blur: 0,
      saturation: 1.2
    },
    customCss: `
/* ============================================================
   Codex 2007 v3 — QQ2007 / XP Luna dense chrome
   Target: thick blue window frame, silver-blue panes, hard bevels,
   tight list rows, QQ-style message boxes — NOT modern white SaaS.
   ============================================================ */

/* ---------- Global light + kill glass ---------- */
html.codex-customizer,
html.codex-customizer.electron-dark,
html.codex-customizer.electron-opaque {
  color-scheme: light !important;
}

html.codex-customizer *,
html.codex-customizer *::before,
html.codex-customizer *::after {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Flatten modern mega-radii globally */
html.codex-customizer .rounded-full { border-radius: 3px !important; }
html.codex-customizer .rounded-3xl,
html.codex-customizer .rounded-2xl,
html.codex-customizer .rounded-xl,
html.codex-customizer .rounded-lg,
html.codex-customizer .rounded-md {
  border-radius: 2px !important;
}
/* Keep true circular avatars / dots only if size is equal */
html.codex-customizer img.rounded-full,
html.codex-customizer [class*="avatar"].rounded-full {
  border-radius: 2px !important;
}

/* ---------- Desktop wallpaper + XP window frame ---------- */
html.codex-customizer,
html.codex-customizer body,
html.codex-customizer.electron-dark body,
html.codex-customizer.electron-opaque body {
  background-color: #4A9AD4 !important;
  background-image:
    linear-gradient(180deg,
      #2E7FC4 0%,
      #4A9AD4 22%,
      #6BAFDF 55%,
      #8EC4EC 82%,
      #A8D4F2 100%) !important;
  background-attachment: fixed !important;
  color: #0A1E33 !important;
  font-family: Tahoma, "MS Sans Serif", "Segoe UI", "Microsoft YaHei", "PingFang SC", "SimSun", system-ui, sans-serif !important;
  -webkit-font-smoothing: auto !important;
  font-size: 12px !important;
}

/* Outer XP window chrome — multi-ring Luna border like QQ main frame */
html.codex-customizer body {
  padding: 3px !important;
  box-sizing: border-box !important;
}
html.codex-customizer #root,
html.codex-customizer body > div:first-of-type {
  background: #D6E8F7 !important;
  border: 1px solid #003C82 !important;
  outline: 2px solid #0A5ABF !important;
  outline-offset: 0 !important;
  box-shadow:
    inset 0 0 0 1px #7EC0F0,
    inset 0 0 0 2px #3C9AF0,
    0 0 0 1px #0554A8,
    0 10px 32px rgba(0, 40, 90, 0.45) !important;
  border-radius: 0 !important;
  overflow: hidden !important;
}

/* ---------- Title bar — single tidy XP Luna row ---------- */
html.codex-customizer header.app-header-tint,
html.codex-customizer.electron-dark header.app-header-tint,
html.codex-customizer.electron-opaque header.app-header-tint,
html.codex-customizer main.main-surface > header.app-header-tint,
html.codex-customizer main.main-surface > header.app-header-tint.app-header-tint,
html.codex-customizer .app-header-tint {
  background-image: linear-gradient(180deg,
    #6EC1FA 0%,
    #3BA0EF 28%,
    #1A7FDC 62%,
    #0B5FBF 88%,
    #084EA0 100%) !important;
  background-color: #0B5FBF !important;
  border: none !important;
  border-bottom: 1px solid #003C82 !important;
  color: #FFFFFF !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.5),
    inset 0 -1px 0 rgba(0,30,80,0.3) !important;
  /* fixed single row — no multi-line chaos */
  height: 36px !important;
  min-height: 36px !important;
  max-height: 36px !important;
  padding: 0 10px 0 78px !important; /* traffic-light safe zone + room for right toggle */
  margin: 0 !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 4px !important;
  z-index: 200 !important;
  box-sizing: border-box !important;
  /* visible so rightmost 显示/隐藏侧边栏 is not clipped */
  overflow: visible !important;
}
html.codex-customizer header.app-header-tint::after {
  content: none !important;
  display: none !important;
}
/* Kill measure-clone / invisible twin controls that render a second button row */
html.codex-customizer header.app-header-tint .invisible,
html.codex-customizer header.app-header-tint [class*="invisible"],
html.codex-customizer header.app-header-tint [aria-hidden="true"].fixed,
html.codex-customizer header.app-header-tint .fixed[class*="pointer-events-none"][class*="invisible"],
html.codex-customizer header.app-header-tint > .fixed {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
  width: 0 !important;
  height: 0 !important;
  min-width: 0 !important;
  max-width: 0 !important;
  overflow: hidden !important;
  opacity: 0 !important;
  position: absolute !important;
  left: -9999px !important;
}
/* Every direct column: one row, vertically centered, no extra left pad */
html.codex-customizer header.app-header-tint > * {
  background: transparent !important;
  background-image: none !important;
  height: 100% !important;
  min-height: 0 !important;
  max-height: 36px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}
html.codex-customizer header.app-header-tint > * > * {
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
  max-height: 36px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
/* Title text white; controls handled below */
html.codex-customizer header.app-header-tint,
html.codex-customizer header.app-header-tint .truncate,
html.codex-customizer header.app-header-tint span:not(button span) {
  color: #FFFFFF !important;
  -webkit-text-fill-color: #FFFFFF !important;
  text-shadow: 0 1px 0 rgba(0, 40, 90, 0.35) !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  line-height: 22px !important;
}
/* Uniform XP toolbar buttons — one size, one baseline */
html.codex-customizer header.app-header-tint button,
html.codex-customizer header.app-header-tint [class*="border"][class*="cursor"] {
  background: linear-gradient(180deg, #FFFFFF 0%, #E4F0FA 48%, #C8DFF3 100%) !important;
  border: 1px solid #0554A8 !important;
  border-radius: 2px !important;
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
  text-shadow: none !important;
  box-shadow:
    inset 0 1px 0 #FFFFFF,
    0 1px 0 rgba(0,40,90,0.12) !important;
  height: 22px !important;
  min-height: 22px !important;
  max-height: 22px !important;
  min-width: 22px !important;
  padding: 0 7px !important;
  margin: 0 1px !important;
  font-weight: 600 !important;
  font-size: 11px !important;
  line-height: 20px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 3px !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
}
html.codex-customizer header.app-header-tint button *,
html.codex-customizer header.app-header-tint button span,
html.codex-customizer header.app-header-tint [class*="border"][class*="cursor"] * {
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
  text-shadow: none !important;
  font-weight: 600 !important;
  font-size: 11px !important;
  line-height: 1 !important;
}
html.codex-customizer header.app-header-tint button svg,
html.codex-customizer header.app-header-tint button svg * {
  color: #0A4A8C !important;
  -webkit-text-fill-color: #0A4A8C !important;
  fill: currentColor !important;
  width: 14px !important;
  height: 14px !important;
  filter: none !important;
  opacity: 1 !important;
}
html.codex-customizer header.app-header-tint button:hover {
  background: linear-gradient(180deg, #F8FCFF 0%, #D0E8FC 100%) !important;
  border-color: #084EA0 !important;
}
/* Icon-only square tools (nav / sidebar toggles) */
html.codex-customizer header.app-header-tint button:not(:has(span:not(:empty))):not(:has([class*="truncate"])) {
  width: 22px !important;
  padding: 0 !important;
}
/* Center title block: truncate cleanly, don't push right tools */
html.codex-customizer header.app-header-tint [class*="grid-cols"] {
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
  min-width: 0 !important;
  gap: 6px !important;
}
html.codex-customizer header.app-header-tint [class*="truncate"] {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
/* Right cluster hugs the right edge in order */
html.codex-customizer header.app-header-tint > :last-child {
  margin-left: auto !important;
  flex-shrink: 0 !important;
  overflow: visible !important;
  min-width: 28px !important;
  width: auto !important;
  max-width: none !important;
}
/* Always show the right-sidebar toggle (never hide / clip it).
 * Do NOT match bare "显示" — that also hits unrelated buttons. */
html.codex-customizer header.app-header-tint button[aria-label*="显示/隐藏侧边栏"],
html.codex-customizer header.app-header-tint button[aria-label*="隐藏边栏"],
html.codex-customizer header.app-header-tint button[aria-label="显示侧边栏"],
html.codex-customizer header.app-header-tint button[aria-label="隐藏侧边栏"] {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
  left: auto !important;
  width: 22px !important;
  min-width: 22px !important;
  max-width: 28px !important;
  height: 22px !important;
  z-index: 220 !important;
  pointer-events: auto !important;
}
/* Keep 切换摘要 / 切换置顶摘要 as their own hit targets (no overlap with rail toggle) */
html.codex-customizer header.app-header-tint button[aria-label*="摘要"] {
  position: relative !important;
  z-index: 221 !important;
  pointer-events: auto !important;
  flex-shrink: 0 !important;
}

/* ---------- Fake menu/toolbar strip (under title) ---------- */
html.codex-customizer .app-shell-main-content-viewport,
html.codex-customizer .app-shell-main-content-frame {
  background: #DCEBFA !important;
}
html.codex-customizer .app-shell-main-content-frame {
  border: 1px solid #7BA7C9 !important;
  border-radius: 0 !important;
  box-shadow: inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #A8C6E0 !important;
  margin: 2px 3px 3px 0 !important;
}
/* Kill top fade gradient overlays that look modern */
html.codex-customizer .app-shell-main-content-top-fade,
html.codex-customizer [class*="from-token-main-surface"] {
  background: transparent !important;
  opacity: 0 !important;
  display: none !important;
}

/* ---------- Left sidebar = QQ contact / tree pane ---------- */
html.codex-customizer aside.app-shell-left-panel,
html.codex-customizer.electron-dark aside.app-shell-left-panel,
html.codex-customizer.electron-opaque aside.app-shell-left-panel,
html.codex-customizer .app-shell-left-panel {
  background-image: linear-gradient(180deg, #C5DFF5 0%, #DCEBFA 12%, #E8F3FC 40%, #D6E8F7 100%) !important;
  background-color: #DCEBFA !important;
  border-right: 1px solid #5A90B8 !important;
  box-shadow:
    inset -1px 0 0 #FFFFFF,
    inset 1px 0 0 rgba(255,255,255,0.5) !important;
  color: #0A1E33 !important;
  border-radius: 0 !important;
  /* clear fixed 36px caption only (fake menu bar removed) */
  padding-top: 8px !important;
  margin-top: 0 !important;
  height: auto !important;
  max-height: none !important;
}
/* Top of sidebar acts as mini toolbar */
html.codex-customizer aside.app-shell-left-panel > div:first-child,
html.codex-customizer .app-shell-left-panel > div:first-child {
  background: linear-gradient(180deg, #EAF3FC 0%, #C8DFF3 100%) !important;
  border-bottom: 1px solid #7BA7C9 !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
  min-height: 28px !important;
}
html.codex-customizer aside.app-shell-left-panel *,
html.codex-customizer .app-shell-left-panel * {
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
}
html.codex-customizer aside.app-shell-left-panel svg,
html.codex-customizer .app-shell-left-panel svg {
  color: #0A5ABF !important;
  -webkit-text-fill-color: #0A5ABF !important;
}
/* Dense list rows — QQ friend-list spacing */
html.codex-customizer aside.app-shell-left-panel button,
html.codex-customizer aside.app-shell-left-panel a,
html.codex-customizer .app-shell-left-panel button,
html.codex-customizer .app-shell-left-panel a {
  border-radius: 0 !important;
  min-height: 22px !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  font-size: 12px !important;
  gap: 4px !important;
}
/* Section headers like XP group boxes */
html.codex-customizer aside.app-shell-left-panel [class*="section-toggle"],
html.codex-customizer aside.app-shell-left-panel button.group\\/section-toggle,
html.codex-customizer .app-shell-left-panel .text-token-input-placeholder-foreground,
html.codex-customizer aside.app-shell-left-panel .font-semibold,
html.codex-customizer aside.app-shell-left-panel [class*="font-semibold"] {
  color: #084EA0 !important;
  -webkit-text-fill-color: #084EA0 !important;
  font-weight: 700 !important;
  font-size: 11px !important;
  letter-spacing: 0.02em !important;
  text-transform: none !important;
  background: linear-gradient(180deg, #EAF3FC 0%, #C5DFF5 100%) !important;
  border: 1px solid #9BC0DC !important;
  border-left: 3px solid #0A5ABF !important;
  border-radius: 0 !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
  margin: 4px 4px 2px !important;
  padding: 3px 6px !important;
}
/* Selected row — solid classic QQ selection blue */
html.codex-customizer aside.app-shell-left-panel [aria-current="page"],
html.codex-customizer aside.app-shell-left-panel [aria-selected="true"],
html.codex-customizer aside.app-shell-left-panel button[aria-current="page"],
html.codex-customizer aside.app-shell-left-panel a[aria-current="page"] {
  background: linear-gradient(180deg, #5EB5F7 0%, #2A8EE8 45%, #0A5ABF 100%) !important;
  color: #FFFFFF !important;
  border: 1px solid #0554A8 !important;
  border-radius: 0 !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.35),
    inset 0 -1px 0 rgba(0,40,90,0.2) !important;
  margin: 0 2px !important;
}
html.codex-customizer aside.app-shell-left-panel [aria-current="page"] *,
html.codex-customizer aside.app-shell-left-panel [aria-selected="true"] *,
html.codex-customizer aside.app-shell-left-panel button[aria-current="page"] * {
  color: #FFFFFF !important;
  -webkit-text-fill-color: #FFFFFF !important;
  text-shadow: 0 1px 0 rgba(0,40,90,0.25) !important;
}
html.codex-customizer aside.app-shell-left-panel [aria-current="page"] svg,
html.codex-customizer aside.app-shell-left-panel [aria-selected="true"] svg {
  color: #FFFFFF !important;
  -webkit-text-fill-color: #FFFFFF !important;
}
html.codex-customizer aside.app-shell-left-panel button:hover:not([aria-current="page"]),
html.codex-customizer aside.app-shell-left-panel a:hover:not([aria-current="page"]) {
  background: #C5DFF5 !important;
  border-radius: 0 !important;
  color: #0A1E33 !important;
  box-shadow: none !important;
}
html.codex-customizer aside.app-shell-left-panel .text-token-description-foreground,
html.codex-customizer aside .opacity-50,
html.codex-customizer aside .sidebar-foreground-muted {
  color: #5A7A96 !important;
  -webkit-text-fill-color: #5A7A96 !important;
  opacity: 1 !important;
  font-size: 11px !important;
}
/* Resize handle like XP sash */
html.codex-customizer .sidebar-resize-handle-line,
html.codex-customizer [class*="sidebar-resize"] {
  background: linear-gradient(90deg, #9BC0DC, #7BA7C9) !important;
  width: 3px !important;
}

/* ---------- Main surface — QQ chat pane (NOT pure white) ---------- */
html.codex-customizer main.main-surface,
html.codex-customizer.electron-dark main.main-surface,
html.codex-customizer.electron-opaque main.main-surface {
  background-image: linear-gradient(180deg, #E8F1F9 0%, #F0F6FC 30%, #E4EEF7 100%) !important;
  background-color: #E8F1F9 !important;
  border: 1px solid #5A90B8 !important;
  border-radius: 0 !important;
  box-shadow:
    inset 1px 1px 0 #FFFFFF,
    inset -1px -1px 0 #A8C6E0 !important;
  color: #0A1E33 !important;
  margin: 0 2px 2px 0 !important;
}
html.codex-customizer main.main-surface,
html.codex-customizer main.main-surface .text-token-foreground,
html.codex-customizer main.main-surface [class*="_markdownText"],
html.codex-customizer main.main-surface [class*="_paragraph"],
html.codex-customizer main.main-surface p,
html.codex-customizer main.main-surface li,
html.codex-customizer main.main-surface span {
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
}
/* Thread scroll area — subtle grid/paper like classic chat */
html.codex-customizer .thread-scroll-container,
html.codex-customizer [container-name="thread-content"] {
  background-color: #EAF2F9 !important;
  background-image:
    linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 48px),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 23px,
      rgba(120, 160, 200, 0.06) 23px,
      rgba(120, 160, 200, 0.06) 24px
    ) !important;
  /* keep horizontal clip but content must not be pre-shifted */
  overflow-x: hidden !important;
}
html.codex-customizer .bg-token-main-surface-primary,
html.codex-customizer [class*="bg-token-main-surface-primary"] {
  background-color: #EAF2F9 !important;
}
html.codex-customizer [class*="bg-token-main-surface-primary/"] {
  background-color: rgba(234, 242, 249, 0.9) !important;
}

/* Inner sticky sub-headers — XP toolbar silver */
html.codex-customizer main.main-surface header.sticky,
html.codex-customizer main .sticky.top-0,
html.codex-customizer main header:not(.app-header-tint) {
  background: linear-gradient(180deg, #F4F9FD 0%, #D4E6F5 55%, #C0D8EE 100%) !important;
  border-bottom: 1px solid #7BA7C9 !important;
  color: #0A1E33 !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
  border-radius: 0 !important;
  min-height: 26px !important;
}
html.codex-customizer main.main-surface header.sticky *,
html.codex-customizer main .sticky.top-0 *,
html.codex-customizer main header:not(.app-header-tint) * {
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
  text-shadow: none !important;
  font-weight: 600 !important;
  font-size: 12px !important;
}

/* No fake XP menu bar (文件/编辑/查看…) — pure decoration, zero function */
html.codex-customizer body::before {
  content: none !important;
  display: none !important;
}
/* Caption only = 36px (decorative menu strip removed) */
html.codex-customizer,
html.codex-customizer.electron-dark,
html.codex-customizer.electron-opaque {
  --toolbar-height: 36px !important;
  --height-toolbar: 36px !important;
  --spacing-token-safe-header-top: 36px !important;
  --spacing-token-safe-header-left: 78px !important;
  --thread-content-top-inset: 44px !important;
  --thread-floating-content-top-inset: 44px !important;
  --app-shell-main-content-frame-top-offset: 0px !important;
}
html.codex-customizer .app-shell-main-content-frame {
  border-top: 1px solid #7BA7C9 !important;
  box-shadow:
    inset 0 1px 0 #FFFFFF,
    inset 1px 0 0 #FFFFFF,
    inset -1px 0 0 #A8C6E0,
    inset 0 -1px 0 #A8C6E0 !important;
}

/* ---------- Right inspector rail ---------- */
/*
 * Cap outer rail so chat is not starved (native inline width can be ~727px).
 * Use max-width only — do NOT force width, so the native col-resize sash still works.
 * Do NOT rewrite inner justify/max-w/mx-auto — native centers the tool menu.
 *
 * CRITICAL: never set width:100% on ALL absolute children. That matched the
 * role=separator resize handle (absolute top-0 bottom-0 left-0 w-4) and the
 * decorative w-px edge, stretching them across the whole rail so the sash
 * line appeared in the middle of the empty right pane.
 */
html.codex-customizer main.main-surface aside.ml-auto,
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"],
html.codex-customizer main.main-surface aside[class*="z-[41]"],
html.codex-customizer main.main-surface aside.shrink-0:not(.app-shell-left-panel) {
  background: linear-gradient(180deg, #DCEBFA 0%, #EEF5FC 35%, #E8F1F9 100%) !important;
  border-left: 1px solid #5A90B8 !important;
  border-radius: 0 !important;
  z-index: 30 !important;
  box-shadow: inset 1px 0 0 #FFFFFF !important;
  /* visible so the left-edge sash (-translate-x-2) is not clipped */
  overflow: visible !important;
  flex: 0 0 auto !important;
  max-width: min(420px, 40vw) !important;
  min-width: 240px !important;
}
/* Content shell only (absolute inset-0) — NOT separator / w-px / sash */
html.codex-customizer main.main-surface aside.ml-auto > .absolute.inset-0,
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] > .absolute.inset-0,
html.codex-customizer main.main-surface aside.ml-auto > [class*="absolute"][class*="inset-0"]:not([class*="inset-y-0"]),
html.codex-customizer main.main-surface aside.ml-auto > [class*="absolute"][class*="overflow-hidden"] {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}
/* Sliding content layer (JS may size to 727px) — exclude sash + edge line */
html.codex-customizer main.main-surface aside.ml-auto [class*="absolute"][class*="top-0"][class*="bottom-0"][class*="left-0"]:not([role="separator"]):not([class*="cursor-col-resize"]):not([class*="w-px"]):not([class*="sidebar-resize"]) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  right: 0 !important;
  left: 0 !important;
}
/* Resize sash: keep native thin hit strip at the LEFT edge of the rail */
html.codex-customizer main.main-surface aside.ml-auto > [role="separator"],
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] > [role="separator"],
html.codex-customizer main.main-surface aside.ml-auto > [class*="cursor-col-resize"],
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] > [class*="cursor-col-resize"] {
  width: 1rem !important; /* Tailwind w-4 */
  min-width: 1rem !important;
  max-width: 1rem !important;
  left: 0 !important;
  right: auto !important;
  top: 0 !important;
  bottom: 0 !important;
  transform: translateX(-0.5rem) !important; /* -translate-x-2 */
  z-index: 40 !important;
  box-sizing: border-box !important;
  pointer-events: auto !important;
  cursor: col-resize !important;
  background: transparent !important;
}
/* Decorative 1px left edge — must stay 1px (was blown to full rail width) */
html.codex-customizer main.main-surface aside.ml-auto > [class*="w-px"],
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] > [class*="w-px"],
html.codex-customizer main.main-surface aside.ml-auto > [class*="absolute"][class*="inset-y-0"][class*="left-0"][class*="w-px"] {
  width: 1px !important;
  min-width: 1px !important;
  max-width: 1px !important;
  left: 0 !important;
  right: auto !important;
  transform: none !important;
  pointer-events: none !important;
}
/* Sash visual line: only the 1px handle line, centered in the 16px hit area */
html.codex-customizer main.main-surface aside .sidebar-resize-handle-line,
html.codex-customizer main.main-surface aside [class*="sidebar-resize-handle-line"] {
  width: 3px !important;
  min-width: 3px !important;
  max-width: 3px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
html.codex-customizer main.main-surface aside.ml-auto button,
html.codex-customizer main.main-surface aside.ml-auto a {
  border-radius: 2px !important;
  min-height: 32px !important;
  font-size: 12px !important;
}
/* Tool rows: XP chip look, keep native w-full of the centered max-w-xl column */
html.codex-customizer main.main-surface aside.ml-auto ul[class*="max-w"] button,
html.codex-customizer main.main-surface aside.ml-auto li button {
  background: linear-gradient(180deg, #FFFFFF 0%, #E4F0FA 55%, #D0E4F5 100%) !important;
  border: 1px solid #7BA7C9 !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
}
html.codex-customizer main.main-surface aside.ml-auto ul[class*="max-w"] button:hover {
  background: linear-gradient(180deg, #F5FAFF 0%, #D0E8FC 100%) !important;
  border-color: #0A5ABF !important;
}

/*
 * Floating 置顶摘要 / 环境信息 (origin-top-right)
 * Native auto-shows this when the tools rail is closed. We suppress that unless
 * the user explicitly opens it via the left header button (切换置顶摘要).
 * Class html.cc-summary-open is managed by the CDP injection helper.
 */
html.codex-customizer [class*="origin-top-right"] {
  pointer-events: none !important;
  position: fixed !important;
  top: 44px !important; /* below 36px caption */
  right: 12px !important;
  left: auto !important;
  width: min(260px, 26vw) !important;
  max-width: min(260px, 26vw) !important;
  z-index: 45 !important;
  margin: 0 !important;
  padding: 0 !important;
  /* Default hide: rightmost rail toggle must not leave this open */
  opacity: 0 !important;
  visibility: hidden !important;
  transform: translateX(12px) scale(0.96) !important;
}
/* Show only when user pinned it AND tools rail is not open */
html.codex-customizer.cc-summary-open:not(:has(aside[data-app-shell-focus-area="right-panel"])) [class*="origin-top-right"] {
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
  pointer-events: none !important; /* container; children re-enable below */
}
html.codex-customizer.cc-summary-open:not(:has(aside[data-app-shell-focus-area="right-panel"])) [class*="origin-top-right"] > * {
  pointer-events: auto !important;
  width: 100% !important;
  max-width: 100% !important;
}
html.codex-customizer [class*="origin-top-right"] .relative.flex.max-h-full.min-h-0.flex-col,
html.codex-customizer [class*="origin-top-right"] [class*="rounded-3xl"],
html.codex-customizer [class*="origin-top-right"] [class*="bg-token-dropdown"],
html.codex-customizer [class*="origin-top-right"] [class*="elevation"] {
  background: linear-gradient(180deg, #F4F9FD 0%, #E8F1F9 55%, #DCEBFA 100%) !important;
  border: 1px solid #5A90B8 !important;
  border-radius: 0 !important;
  box-shadow:
    inset 1px 1px 0 #FFFFFF,
    0 6px 16px rgba(10, 50, 100, 0.28) !important;
  z-index: 45 !important;
  max-width: 100% !important;
  width: 100% !important;
  max-height: min(70vh, 520px) !important;
  overflow: auto !important;
}
/* Gutter only when floating summary is actually visible */
html.codex-customizer.cc-summary-open:not(:has(aside[data-app-shell-focus-area="right-panel"])) main.main-surface .thread-scroll-container {
  padding-right: min(276px, 28vw) !important;
  box-sizing: border-box !important;
}

/* ---------- Cards / fog / elevated panels — XP group boxes ---------- */
html.codex-customizer .bg-token-bg-fog,
html.codex-customizer [class*="bg-token-bg-fog"],
html.codex-customizer [class*="bg-token-dropdown-background"],
html.codex-customizer [class*="bg-token-dropdown-background/"],
html.codex-customizer [class*="elevation"],
html.codex-customizer [class*="rounded-lg"].bg-token-dropdown-background,
html.codex-customizer [class*="rounded-2xl"][class*="bg-token"] {
  background: linear-gradient(180deg, #F4F9FD 0%, #E8F1F9 55%, #DCEBFA 100%) !important;
  border: 1px solid #7BA7C9 !important;
  border-radius: 0 !important;
  box-shadow:
    inset 1px 1px 0 #FFFFFF,
    inset -1px -1px 0 #B8D0E4 !important;
  color: #0A1E33 !important;
}
html.codex-customizer [class*="dropdown-background"] > div,
html.codex-customizer .flex.flex-col [class*="border-t"] {
  border-color: #B8D0E4 !important;
}

/* Inline code — aqua XP chips */
html.codex-customizer code,
html.codex-customizer kbd,
html.codex-customizer [class*="inline-markdown"],
html.codex-customizer .inline-markdown,
html.codex-customizer p code,
html.codex-customizer li code {
  background: linear-gradient(180deg, #EAF5FE 0%, #C8DFF3 100%) !important;
  border: 1px solid #7BA7C9 !important;
  color: #084EA0 !important;
  -webkit-text-fill-color: #084EA0 !important;
  border-radius: 0 !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
  font-family: Consolas, "Courier New", monospace !important;
  font-size: 11px !important;
  padding: 0 3px !important;
}

/* ---------- Buttons — classic 3D XP ---------- */
html.codex-customizer button.bg-token-foreground,
html.codex-customizer [data-variant="primary"],
html.codex-customizer button[class*="button-primary"] {
  background: linear-gradient(180deg, #6EC1FA 0%, #2A8EE8 48%, #0A5ABF 100%) !important;
  color: #FFFFFF !important;
  -webkit-text-fill-color: #FFFFFF !important;
  border: 1px solid #003C82 !important;
  border-radius: 2px !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.55),
    inset 0 -1px 0 rgba(0,40,90,0.25),
    0 1px 1px rgba(0,40,90,0.2) !important;
  text-shadow: 0 1px 0 rgba(0,40,90,0.3) !important;
  font-weight: 600 !important;
  min-height: 22px !important;
}
html.codex-customizer button.border-token-border,
html.codex-customizer [class*="border-token-border"].border,
html.codex-customizer button[class*="h-token-button"] {
  background: linear-gradient(180deg, #FFFFFF 0%, #E4F0FA 48%, #C8DFF3 100%) !important;
  border: 1px solid #5A90B8 !important;
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
  border-radius: 2px !important;
  box-shadow:
    inset 0 1px 0 #FFFFFF,
    inset 0 -1px 0 rgba(0,40,90,0.08) !important;
  font-weight: 600 !important;
  min-height: 22px !important;
}
html.codex-customizer button.border-token-border:hover,
html.codex-customizer button[class*="h-token-button"]:hover {
  background: linear-gradient(180deg, #F8FCFF 0%, #D0E8FC 100%) !important;
  border-color: #0A5ABF !important;
}
html.codex-customizer button.rounded-full.bg-token-foreground,
html.codex-customizer [class*="composer"] button[class*="rounded-full"],
html.codex-customizer button.size-token-button-composer,
html.codex-customizer [class*="size-token-button-composer"] {
  background: linear-gradient(180deg, #6EC1FA 0%, #0A5ABF 100%) !important;
  border: 1px solid #003C82 !important;
  border-radius: 2px !important;
  color: #FFF !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.45) !important;
}

/* ---------- Composer — compact QQ/XP input card (detailed layout later) ---------- */
html.codex-customizer .composer-surface-chrome::before,
html.codex-customizer .composer-surface-chrome::after {
  display: none !important;
  content: none !important;
}
html.codex-customizer .composer-surface-chrome button,
html.codex-customizer [data-codex-composer-root] button {
  border-radius: 2px !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
}

/* Full-access / validation banners — aqua XP notices */
html.codex-customizer [class*="bg-token-input-validation-error"],
html.codex-customizer [class*="validation-error-background"],
html.codex-customizer [class*="text-token-error-foreground"] {
  background: linear-gradient(180deg, #E8F6FF 0%, #C8DFF3 100%) !important;
  border: 1px solid #7BA7C9 !important;
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
  border-radius: 0 !important;
}
html.codex-customizer [class*="bg-token-input-validation-error"] *,
html.codex-customizer [class*="text-token-error-foreground"] * {
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
}
html.codex-customizer [class*="bg-token-input-validation-error"] svg {
  color: #0A5ABF !important;
}

/* ---------- Typography ---------- */
html.codex-customizer .text-token-text-secondary,
html.codex-customizer .text-token-description-foreground,
html.codex-customizer [class*="text-token-text-secondary"],
html.codex-customizer [class*="text-token-description"],
html.codex-customizer [class*="text-token-muted"] {
  color: #3A5A78 !important;
  -webkit-text-fill-color: #3A5A78 !important;
  /* Do NOT force opacity:1 — that un-hides native .opacity-0 controls
     (e.g. 滚动到底部) and turns them into stray XP rectangles. */
}
/* Honor intentional hide utilities even if other rules paint the element */
html.codex-customizer .opacity-0,
html.codex-customizer [class~="opacity-0"] {
  opacity: 0 !important;
  pointer-events: none !important;
}
/* Scroll-to-bottom: native pill floats above composer; hide the broken empty shell.
 * When Codex shows it (no opacity-0), keep a compact circular control. */
html.codex-customizer button[aria-label="滚动到底部"],
html.codex-customizer button[aria-label*="滚动到底"],
html.codex-customizer button[aria-label*="Scroll to bottom"],
html.codex-customizer button[aria-label*="scroll to bottom"] {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  min-height: 28px !important;
  max-width: 28px !important;
  max-height: 28px !important;
  padding: 0 !important;
  border-radius: 999px !important;
  box-sizing: border-box !important;
}
html.codex-customizer button[aria-label="滚动到底部"].opacity-0,
html.codex-customizer button[aria-label*="滚动到底"].opacity-0,
html.codex-customizer button[aria-label*="Scroll to bottom"].opacity-0,
html.codex-customizer button[aria-label*="scroll to bottom"].opacity-0,
html.codex-customizer button[aria-label="滚动到底部"].pointer-events-none,
html.codex-customizer button[aria-label*="滚动到底"].pointer-events-none {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}
html.codex-customizer a:not([role="button"]),
html.codex-customizer main.main-surface a {
  color: #0066CC !important;
  text-decoration: underline !important;
}
html.codex-customizer [class*="dropdownLabelValue"],
html.codex-customizer [class*="_dropdownLabelValue"] {
  color: #D4880F !important;
  -webkit-text-fill-color: #D4880F !important;
  font-weight: 700 !important;
}

/* Hover list */
html.codex-customizer .bg-token-list-hover-background,
html.codex-customizer [class*="bg-token-list-hover"],
html.codex-customizer [class*="hover:bg-token-list"] {
  background: #C5DFF5 !important;
}

/* Dialogs / menus — XP balloon panels */
html.codex-customizer [role="dialog"],
html.codex-customizer [role="menu"],
html.codex-customizer [data-radix-popper-content-wrapper] > * {
  background: linear-gradient(180deg, #F8FCFF 0%, #E8F1F9 100%) !important;
  border: 1px solid #0554A8 !important;
  border-radius: 0 !important;
  box-shadow:
    inset 1px 1px 0 #FFFFFF,
    2px 2px 0 rgba(0, 40, 90, 0.15),
    0 8px 20px rgba(10, 50, 100, 0.28) !important;
  color: #0A1E33 !important;
  font-size: 12px !important;
}

/* Inputs */
html.codex-customizer textarea,
html.codex-customizer input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
html.codex-customizer [contenteditable="true"] {
  background: #FFFFFF !important;
  color: #0A1E33 !important;
  border: 1px solid #7BA7C9 !important;
  border-radius: 0 !important;
  caret-color: #0A5ABF !important;
  box-shadow: inset 1px 1px 0 #D0E0F0 !important;
}

/* Scrollbars — classic thick XP grips */
html.codex-customizer ::-webkit-scrollbar {
  width: 16px !important;
  height: 16px !important;
}
html.codex-customizer ::-webkit-scrollbar-track {
  background: linear-gradient(90deg, #C8DDF0, #EAF3FC) !important;
  border-left: 1px solid #8EB4D4 !important;
}
html.codex-customizer ::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #B8D8F4 0%, #6BAFDF 40%, #3C9AF0 70%, #2A7FC8 100%) !important;
  border: 1px solid #0554A8 !important;
  border-radius: 0 !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.5) !important;
}
html.codex-customizer ::-webkit-scrollbar-button {
  background: linear-gradient(180deg, #EAF5FE, #A8C8E8) !important;
  border: 1px solid #7BA7C9 !important;
  height: 16px !important;
  width: 16px !important;
  border-radius: 0 !important;
}
html.codex-customizer ::-webkit-scrollbar-corner {
  background: #C8DDF0 !important;
}

/* Diff semantic */
html.codex-customizer [class*="git-decoration-added"] { color: #2E9B4A !important; }
html.codex-customizer [class*="git-decoration-deleted"] { color: #C73B3B !important; }

/* Bottom status bar — XP status strip */
html.codex-customizer [data-thread-scroll-footer],
html.codex-customizer footer,
html.codex-customizer [class*="thread-scroll-footer"] {
  background: linear-gradient(180deg, #EAF3FC 0%, #C5DFF5 55%, #A8C8E8 100%) !important;
  border-top: 1px solid #5A90B8 !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
  color: #0A1E33 !important;
  min-height: 22px !important;
  font-size: 11px !important;
  border-radius: 0 !important;
}

/* Settings nav selected */
html.codex-customizer button[data-settings-panel-slug][aria-current="page"] {
  background: linear-gradient(180deg, #5EB5F7 0%, #0A5ABF 100%) !important;
  color: #FFF !important;
  border: 1px solid #003C82 !important;
  border-radius: 0 !important;
}

/* Switch tracks */
html.codex-customizer [role="switch"][data-state="checked"] > span.relative,
html.codex-customizer [role="switch"][aria-checked="true"] > span.relative {
  background: linear-gradient(180deg, #5EB5F7, #0A5ABF) !important;
  border-radius: 2px !important;
}
html.codex-customizer [role="switch"] span.rounded-full {
  border-radius: 2px !important;
}

/* Tighten modern huge paddings a notch for density */
html.codex-customizer main.main-surface .gap-4 { gap: 0.5rem !important; }
html.codex-customizer main.main-surface .gap-6 { gap: 0.65rem !important; }
html.codex-customizer main.main-surface .p-6 { padding: 0.75rem !important; }
html.codex-customizer main.main-surface .p-4 { padding: 0.5rem !important; }
html.codex-customizer main.main-surface .py-6 { padding-top: 0.65rem !important; padding-bottom: 0.65rem !important; }
html.codex-customizer main.main-surface .px-6 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }

/* Shadow-sm/elevation modern soft shadows → hard XP offsets */
html.codex-customizer .shadow-sm,
html.codex-customizer .shadow,
html.codex-customizer .shadow-md,
html.codex-customizer .shadow-lg {
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.6),
    1px 1px 0 rgba(10, 50, 100, 0.12) !important;
}

/* ---------- Chat message cards (user + AI) ---------- */
/*
 * User bubbles: bg-token-foreground/5 + max-w-[77%] + break-words
 * AI turns: often plain text-size-chat / markdown with NO bubble — must add card.
 * Escape carefully: [class*="max-w-[77%]"] is invalid CSS (] closes attribute).
 */
/* USER message bubbles */
html.codex-customizer .thread-scroll-container [class*="bg-token-foreground/"],
html.codex-customizer .thread-scroll-container [class*="bg-token-foreground\\/"],
html.codex-customizer .thread-scroll-container [class*="break-words"][class*="max-w-"],
html.codex-customizer .thread-scroll-container [class*="max-w-\\[77"],
html.codex-customizer .thread-scroll-container [class*="max-w-[77"],
html.codex-customizer main.main-surface [class*="bg-token-foreground/"] {
  background-image: linear-gradient(180deg, #FFFFFF 0%, #F4F9FD 100%) !important;
  background-color: #FFFFFF !important;
  border: 1px solid #6BA3D0 !important;
  border-radius: 2px !important;
  box-shadow:
    inset 0 1px 0 #FFFFFF,
    1px 1px 0 rgba(10, 50, 100, 0.12) !important;
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
  padding: 8px 12px !important;
}

/* AI / assistant response cards — same 77% cap as user bubbles, left-aligned */
html.codex-customizer .thread-scroll-container [data-message-author-role="assistant"],
html.codex-customizer .thread-scroll-container [data-message-author-role="assistant"] > div,
html.codex-customizer .thread-scroll-container [data-turn-role="assistant"],
html.codex-customizer .thread-scroll-container article,
html.codex-customizer .thread-scroll-container [class*="_markdownContent"],
html.codex-customizer .thread-scroll-container [class*="markdown-content"],
html.codex-customizer .thread-scroll-container .text-size-chat.relative.w-full.min-w-0,
html.codex-customizer .thread-scroll-container [class*="text-size-chat"][class*="relative"][class*="w-full"][class*="min-w-0"] {
  max-width: 77% !important;
  width: fit-content !important;
  min-width: min(240px, 100%) !important;
  margin-left: 0 !important;
  margin-right: auto !important;
  background-image: linear-gradient(180deg, #FFFFFF 0%, #F7FBFF 100%) !important;
  background-color: #FFFFFF !important;
  border: 1px solid #7BA7C9 !important;
  border-radius: 2px !important;
  box-shadow:
    inset 0 1px 0 #FFFFFF,
    1px 1px 0 rgba(10, 50, 100, 0.1) !important;
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
  padding: 10px 14px !important;
  margin-top: 6px !important;
  margin-bottom: 10px !important;
  box-sizing: border-box !important;
}

/* Avoid double-card: text inside an already-carded user bubble */
html.codex-customizer .thread-scroll-container [class*="bg-token-foreground/"] .text-size-chat,
html.codex-customizer .thread-scroll-container [class*="bg-token-foreground/"] [class*="_markdown"],
html.codex-customizer .thread-scroll-container [class*="break-words"] .text-size-chat,
html.codex-customizer .thread-scroll-container [class*="break-words"] [class*="_markdownContent"] {
  background: transparent !important;
  background-image: none !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* Nested resource/file cards inside AI reply keep their own XP group-box look */
html.codex-customizer .thread-scroll-container [class*="bg-token-bg-fog"],
html.codex-customizer .thread-scroll-container [class*="bg-token-dropdown"],
html.codex-customizer .thread-scroll-container [class*="elevation"] {
  background: linear-gradient(180deg, #F8FCFF 0%, #EAF3FC 100%) !important;
  border: 1px solid #7BA7C9 !important;
  border-radius: 2px !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
}

/* Paragraphs/lists inside message cards inherit dark text, no extra frames */
html.codex-customizer .thread-scroll-container [class*="bg-token-foreground/"] p,
html.codex-customizer .thread-scroll-container [class*="_markdownContent"] p,
html.codex-customizer .thread-scroll-container [class*="text-size-chat"] p,
html.codex-customizer .thread-scroll-container article p,
html.codex-customizer .thread-scroll-container article li {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  margin-top: 0.35em !important;
  margin-bottom: 0.35em !important;
  padding: 0 !important;
}

/* Outer XP desktop margin stronger */
html.codex-customizer body {
  padding: 4px !important;
  background-color: #2E7FC4 !important;
}
html.codex-customizer #root,
html.codex-customizer body > div:first-of-type {
  border: 2px solid #003C82 !important;
  outline: 1px solid #7EC0F0 !important;
  box-shadow:
    inset 0 0 0 1px #3C9AF0,
    0 0 0 1px #0554A8,
    0 12px 36px rgba(0, 30, 70, 0.5) !important;
}

/* ============================================================
   v5 polish — full-width input dock, kill residual radii,
   settings top chrome cleanup
   ============================================================ */

/* --- Design tokens: XP hard edges; do NOT fight thread layout math --- */
html.codex-customizer,
html.codex-customizer.electron-dark,
html.codex-customizer.electron-opaque {
  --radius-token-row: 0px !important;
  --radius-token-button: 2px !important;
  --radius-token-composer-single-line: 0px !important;
  --radius-token-composer-multi-line: 0px !important;
  --composer-border-radius: 0px !important;
  --composer-attachment-border-radius: 0px !important;
  --radius-3xl: 0px !important;
  --radius-2xl: 0px !important;
  --radius-xl: 0px !important;
  --radius-lg: 0px !important;
  --radius-md: 0px !important;
  --radius-sm: 0px !important;
  --radius-xs: 0px !important;
  /* Thread messages can stay readable; composer dock uses full parent width via rules below */
  --thread-content-max-width: min(920px, 100%) !important;
  --composer-adjacent-max-width: 100% !important;
  --home-composer-inline-inset: 0.5rem !important;
  --thread-resource-card-row-padding-x: 0.75rem !important;
  /* Codex shifts thread body with translateX(-shift) for wide blocks; zero it */
  --thread-wide-block-inline-shift: 0px !important;
}

/* Nuke residual rounded utilities (incl. arbitrary rounded-[var(--radius-*)]) */
html.codex-customizer [class*="rounded"],
html.codex-customizer [class*="rounded-"] {
  border-radius: 0 !important;
}
html.codex-customizer button[class*="rounded"],
html.codex-customizer [role="switch"] span {
  border-radius: 2px !important;
}
/* keep tiny 2px for true chips; 0 for panels/rows */
html.codex-customizer [class*="folder-row"],
html.codex-customizer [class*="radius-token-row"],
html.codex-customizer [class*="h-[var(--height-token-row)]"],
html.codex-customizer aside.app-shell-left-panel [class*="rounded"],
html.codex-customizer main.main-surface [class*="rounded-3xl"],
html.codex-customizer main.main-surface [class*="rounded-2xl"],
html.codex-customizer main.main-surface [class*="rounded-xl"],
html.codex-customizer main.main-surface [class*="rounded-lg"] {
  border-radius: 0 !important;
}

/* Kill Codex wide-block horizontal shift that clips thread content under overflow-x-hidden */
html.codex-customizer .thread-scroll-container,
html.codex-customizer .thread-scroll-container * {
  --thread-wide-block-inline-shift: 0px !important;
}
html.codex-customizer .thread-scroll-container .flex.min-h-full.shrink-0,
html.codex-customizer .thread-scroll-container [style*="thread-wide-block-inline-shift"],
html.codex-customizer .thread-scroll-container [style*="translateX"] {
  transform: none !important;
}

/* ============================================================
   Composer dock v5 — single clean QQ input card
   Structure (native):
     [data-codex-composer-root].min-w-0          ← ONE outer card
       banner (Full access)                     ← optional top strip
       .composer-surface-chrome                 ← no second frame
         footer grid: row1=input, row2=toolbar
   ============================================================ */

/* Dock tray under chat — quiet, not a second "window" */
html.codex-customizer .sticky.bottom-0,
html.codex-customizer main.main-surface .sticky.bottom-0 {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 8px 12px 12px !important;
  background: linear-gradient(180deg, #D6E8F7 0%, #C8DFF3 100%) !important;
  border-top: 1px solid #7BA7C9 !important;
  border-radius: 0 !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.65) !important;
  box-sizing: border-box !important;
  overflow: visible !important;
  height: auto !important;
  max-height: none !important;
  transform: none !important;
}

/* Full-bleed column */
html.codex-customizer .sticky.bottom-0 [class*="max-w-(--"],
html.codex-customizer .sticky.bottom-0 .mx-auto[class*="max-w"],
html.codex-customizer .sticky.bottom-0 [data-pip-obstacle],
html.codex-customizer .sticky.bottom-0 [data-thread-find-composer] {
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  box-sizing: border-box !important;
}
html.codex-customizer .sticky.bottom-0 > div,
html.codex-customizer .sticky.bottom-0 .flex.flex-col,
html.codex-customizer .sticky.bottom-0 .flex.flex-col.gap-2 {
  width: 100% !important;
  max-width: none !important;
  gap: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  overflow: visible !important;
  height: auto !important;
}

/* ===== THE card: only data-codex-composer-root ===== */
html.codex-customizer .sticky.bottom-0 [data-codex-composer-root],
html.codex-customizer [data-codex-composer-root] {
  display: flex !important;
  flex-direction: column !important;
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  gap: 0 !important;
  border: 1px solid #0554A8 !important;
  border-radius: 0 !important;
  background: #FFFFFF !important;
  box-shadow:
    inset 1px 1px 0 #FFFFFF,
    0 1px 2px rgba(10, 50, 100, 0.14) !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
  height: auto !important;
  min-height: 0 !important;
}

/* Banner portal wrappers — collapse chrome, no extra frame */
html.codex-customizer .sticky.bottom-0 [data-above-composer-portal],
html.codex-customizer .sticky.bottom-0 [class*="home-composer-inline-inset"],
html.codex-customizer .sticky.bottom-0 [class*="px-[var(--home-composer"],
html.codex-customizer .sticky.bottom-0 .order-2,
html.codex-customizer .sticky.bottom-0 [class*="empty:hidden"] {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  gap: 0 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  overflow: visible !important;
  height: auto !important;
  min-height: 0 !important;
}

/* Full access strip: icon + title + Hide (one row). Long blurb hidden. */
html.codex-customizer .sticky.bottom-0 [class*="validation-error"],
html.codex-customizer .sticky.bottom-0 [class*="bg-token-input-validation"],
html.codex-customizer .sticky.bottom-0 [class*="rounded-t"][class*="validation"],
html.codex-customizer .sticky.bottom-0 [class*="validation-error-background"] {
  display: block !important;
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  min-height: 30px !important;
  height: 30px !important;
  max-height: 30px !important;
  border: none !important;
  border-bottom: 1px solid #9BC0DC !important;
  border-radius: 0 !important;
  background: linear-gradient(180deg, #E8F3FC 0%, #D4E8F8 100%) !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
  transform: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
html.codex-customizer .sticky.bottom-0 [class*="validation-error"] > .flex,
html.codex-customizer .sticky.bottom-0 [class*="bg-token-input-validation"] > .flex,
html.codex-customizer .sticky.bottom-0 [class*="validation"] > .flex.items-center,
html.codex-customizer .sticky.bottom-0 [class*="validation"] .flex.items-center.gap-2 {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  width: 100% !important;
  height: 30px !important;
  min-height: 30px !important;
  max-height: 30px !important;
  gap: 8px !important;
  padding: 0 10px !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}
/* Hide only the multi-line description under the title */
html.codex-customizer .sticky.bottom-0 [class*="validation"] .leading-4,
html.codex-customizer .sticky.bottom-0 [class*="validation"] [class*="leading-4"],
html.codex-customizer .sticky.bottom-0 [class*="validation"] .mt-0\\.5 {
  display: none !important;
  height: 0 !important;
  overflow: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}
html.codex-customizer .sticky.bottom-0 [class*="validation"] .min-w-0.flex-1 {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  flex: 1 1 auto !important;
  min-width: 0 !important;
  min-height: 0 !important;
  height: 100% !important;
  max-height: 30px !important;
  overflow: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}
html.codex-customizer .sticky.bottom-0 [class*="validation"] .font-semibold,
html.codex-customizer .sticky.bottom-0 [class*="validation"] [class*="font-semibold"],
html.codex-customizer .sticky.bottom-0 [class*="validation"] .text-xs.font-semibold {
  display: inline !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  line-height: 30px !important;
  height: 30px !important;
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  margin: 0 !important;
  padding: 0 !important;
}
html.codex-customizer .sticky.bottom-0 [class*="validation"] button {
  height: 22px !important;
  min-height: 22px !important;
  max-height: 22px !important;
  margin-left: auto !important;
  padding: 0 10px !important;
  font-size: 11px !important;
  flex-shrink: 0 !important;
  white-space: nowrap !important;
  background: linear-gradient(180deg, #FFFFFF 0%, #E4F0FA 50%, #C8DFF3 100%) !important;
  border: 1px solid #5A90B8 !important;
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
  text-shadow: none !important;
}
html.codex-customizer .sticky.bottom-0 [class*="validation"] svg {
  width: 14px !important;
  height: 14px !important;
  flex-shrink: 0 !important;
  color: #0A5ABF !important;
}

/* ===== Inner chrome: NO second card ===== */
html.codex-customizer .composer-surface-chrome,
html.codex-customizer.electron-dark .composer-surface-chrome,
html.codex-customizer main.main-surface .composer-surface-chrome,
html.codex-customizer .sticky.bottom-0 .composer-surface-chrome,
html.codex-customizer [data-codex-composer-root] .composer-surface-chrome {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  background: #FFFFFF !important;
  background-image: none !important;
  box-shadow: none !important;
  overflow: hidden !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0 !important;
  box-sizing: border-box !important;
  transform: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
html.codex-customizer .composer-surface-chrome > div,
html.codex-customizer .composer-surface-chrome > div[class*="flex-1"],
html.codex-customizer .composer-surface-chrome > div[class*="min-h-0"],
html.codex-customizer .sticky.bottom-0 .flex.w-full.flex-col.gap-2,
html.codex-customizer .sticky.bottom-0 .flex.w-full.flex-col.gap-2 > .relative {
  margin: 0 !important;
  padding: 0 !important;
  gap: 0 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  overflow: visible !important;
  height: auto !important;
  min-height: 0 !important;
}

/* Empty attachments: gone */
html.codex-customizer .composer-surface-chrome [class*="_attachments"],
html.codex-customizer .composer-surface-chrome [class*="attachments"] {
  padding: 0 !important;
  margin: 0 !important;
  min-height: 0 !important;
}
html.codex-customizer .composer-surface-chrome [class*="_attachments"]:empty,
html.codex-customizer .composer-surface-chrome [class*="attachments"]:not(:has(*)) {
  display: none !important;
  height: 0 !important;
}

/* Footer grid: clean 2-row stack */
html.codex-customizer .composer-surface-chrome [class*="_footer"],
html.codex-customizer .composer-surface-chrome [class*="footer"] {
  display: grid !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  gap: 0 6px !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  align-items: center !important;
  box-sizing: border-box !important;
  overflow: visible !important;
}

/* Row 1 — text input */
html.codex-customizer .composer-surface-chrome [class*="_footer"] [class*="row-start-1"],
html.codex-customizer .composer-surface-chrome [class*="_footer"] [class*="col-span-full"] {
  grid-column: 1 / -1 !important;
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  min-height: 0 !important;
  height: auto !important;
  max-height: none !important;
  align-self: stretch !important;
}
html.codex-customizer .composer-surface-chrome .mb-1.flex-grow,
html.codex-customizer .composer-surface-chrome [class*="flex-grow"][class*="overflow"] {
  margin: 0 !important;
  padding: 8px 12px 6px !important;
  min-height: 0 !important;
  overflow: visible !important;
  background: transparent !important;
}
html.codex-customizer .composer-surface-chrome .ProseMirror,
html.codex-customizer .composer-surface-chrome [contenteditable="true"] {
  width: 100% !important;
  min-height: 20px !important;
  max-height: min(140px, 26vh) !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
  font-size: 13px !important;
  line-height: 1.45 !important;
  overflow: auto !important;
  box-sizing: border-box !important;
}
html.codex-customizer .composer-surface-chrome .ProseMirror p {
  margin: 0 !important;
}
html.codex-customizer .composer-surface-chrome .ProseMirror p.placeholder,
html.codex-customizer .composer-surface-chrome .ProseMirror .is-empty::before,
html.codex-customizer .composer-surface-chrome .ProseMirror p.is-empty::before {
  color: #8AA0B8 !important;
  -webkit-text-fill-color: #8AA0B8 !important;
  opacity: 1 !important;
}

/* Row 2 — toolbar strip */
html.codex-customizer .composer-surface-chrome [class*="_footer"] [class*="row-start-2"] {
  min-height: 34px !important;
  height: 34px !important;
  max-height: 34px !important;
  margin: 0 !important;
  padding: 0 8px !important;
  align-self: stretch !important;
  display: flex !important;
  align-items: center !important;
  background: linear-gradient(180deg, #EEF5FC 0%, #DCEBFA 55%, #CEE3F5 100%) !important;
  border-top: 1px solid #A8C6E0 !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
  box-sizing: border-box !important;
}
html.codex-customizer .composer-surface-chrome [class*="_footer"] [class*="col-start-1"][class*="row-start-2"],
html.codex-customizer .composer-surface-chrome [class*="_footer"] [class*="col-start-3"][class*="row-start-2"] {
  background: linear-gradient(180deg, #EEF5FC 0%, #DCEBFA 55%, #CEE3F5 100%) !important;
  border-top: 1px solid #A8C6E0 !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
}
/* continuous bar under text area */
html.codex-customizer .composer-surface-chrome [class*="_footer"] {
  background-image: linear-gradient(
    to bottom,
    #FFFFFF 0,
    #FFFFFF calc(100% - 34px),
    #EEF5FC calc(100% - 34px),
    #CEE3F5 100%
  ) !important;
}
html.codex-customizer .composer-surface-chrome [class*="flex"][class*="items-center"] {
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 5px !important;
  min-height: 0 !important;
  max-height: 26px !important;
  overflow: visible !important;
}

/* Buttons — compact silver chips */
html.codex-customizer .composer-surface-chrome button,
html.codex-customizer [data-codex-composer-root] .composer-surface-chrome button {
  display: inline-flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 3px !important;
  height: 24px !important;
  min-height: 24px !important;
  max-height: 24px !important;
  padding: 0 8px !important;
  margin: 0 !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  line-height: 1 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  flex-shrink: 0 !important;
  border-radius: 2px !important;
  box-sizing: border-box !important;
}
html.codex-customizer .composer-surface-chrome button[aria-label*="添加"],
html.codex-customizer .composer-surface-chrome button.size-token-button-composer,
html.codex-customizer .composer-surface-chrome [class*="size-token-button-composer"] {
  width: 24px !important;
  min-width: 24px !important;
  max-width: 24px !important;
  padding: 0 !important;
}
html.codex-customizer .composer-surface-chrome button span,
html.codex-customizer .composer-surface-chrome button [class*="dropdownLabel"],
html.codex-customizer .composer-surface-chrome button [class*="ModelPicker"] {
  display: inline-flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 2px !important;
  white-space: nowrap !important;
  line-height: 1 !important;
  max-height: 22px !important;
  overflow: hidden !important;
  font-size: 11px !important;
}
html.codex-customizer .composer-surface-chrome button svg {
  width: 12px !important;
  height: 12px !important;
  flex-shrink: 0 !important;
}
html.codex-customizer .composer-surface-chrome button.border-token-border,
html.codex-customizer .composer-surface-chrome button[class*="border-token-border"] {
  background: linear-gradient(180deg, #FFFFFF 0%, #EAF2F9 48%, #D4E6F5 100%) !important;
  border: 1px solid #7BA7C9 !important;
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
  text-shadow: none !important;
}
html.codex-customizer .composer-surface-chrome button.border-token-border:hover {
  background: linear-gradient(180deg, #F8FCFF 0%, #D0E8FC 100%) !important;
  border-color: #0A5ABF !important;
}
html.codex-customizer .composer-surface-chrome button.size-token-button-composer,
html.codex-customizer .composer-surface-chrome button.bg-token-foreground,
html.codex-customizer .composer-surface-chrome button[class*="bg-token-foreground"] {
  background: linear-gradient(180deg, #6EC1FA 0%, #0A5ABF 100%) !important;
  border: 1px solid #003C82 !important;
  color: #FFFFFF !important;
  -webkit-text-fill-color: #FFFFFF !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.45) !important;
}
html.codex-customizer .composer-surface-chrome button.size-token-button-composer svg {
  color: #FFFFFF !important;
}

/* Hide junk: scroll-to-bottom when off, random floating ChatGPT chips near dock */
html.codex-customizer .sticky.bottom-0 button[aria-label*="滚动到底"].opacity-0,
html.codex-customizer .sticky.bottom-0 button[aria-label*="滚动到底"].pointer-events-none {
  display: none !important;
}
html.codex-customizer .sticky.bottom-0 [class*="speech"],
html.codex-customizer .sticky.bottom-0 [class*="tooltip"]:not(button):not([role="button"]),
html.codex-customizer main.main-surface > [class*="fixed"][class*="bottom"]:has([class*="ChatGPT"]),
html.codex-customizer [class*="brand-pill"],
html.codex-customizer .sticky.bottom-0 [data-state="delayed-open"],
html.codex-customizer .sticky.bottom-0 [data-radix-popper-content-wrapper]:has([class*="tooltip"]) {
  /* leave real menus alone; only kill empty decorative overlays */
}

/* Title bar position fixed (paint rules live in Title bar block above) */
html.codex-customizer header.app-header-tint,
html.codex-customizer.electron-dark header.app-header-tint,
html.codex-customizer.electron-opaque header.app-header-tint,
html.codex-customizer main.main-surface > header.app-header-tint {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  z-index: 200 !important;
  isolation: isolate !important;
}

/* CRITICAL: restore natural flex layout — no margin-top / fixed vh heights */
html.codex-customizer aside.app-shell-left-panel,
html.codex-customizer .app-shell-left-panel,
html.codex-customizer.electron-dark aside.app-shell-left-panel,
html.codex-customizer.electron-opaque aside.app-shell-left-panel,
html.codex-customizer main.main-surface,
html.codex-customizer.electron-dark main.main-surface,
html.codex-customizer.electron-opaque main.main-surface {
  margin-top: 0 !important;
  height: auto !important;
  max-height: none !important;
  position: relative !important;
  z-index: auto !important;
}
html.codex-customizer main.main-surface {
  padding-top: 0 !important;
  overflow: hidden !important;
}

/* Right inspector aside sizing handled in Right inspector rail block above */

/* --- Settings page chrome --- */
/* Solid paper under settings content (not raw desktop blue wash) */
html.codex-customizer:has([data-settings-panel-slug]) main.main-surface,
html.codex-customizer:has(button[data-settings-panel-slug]) main.main-surface {
  background-image: linear-gradient(180deg, #D6E8F7 0%, #E8F1F9 40%, #DCEBFA 100%) !important;
  background-color: #E8F1F9 !important;
  border: 1px solid #5A90B8 !important;
  box-shadow: inset 1px 1px 0 #FFFFFF !important;
}
/* Settings left nav — clean XP list */
html.codex-customizer:has([data-settings-panel-slug]) aside.app-shell-left-panel,
html.codex-customizer aside.app-shell-left-panel:has([data-settings-panel-slug]),
html.codex-customizer aside.app-shell-left-panel:has(button[data-settings-panel-slug]) {
  background: linear-gradient(180deg, #C5DFF5 0%, #DCEBFA 30%, #E8F3FC 100%) !important;
  border-right: 1px solid #5A90B8 !important;
  box-shadow: inset -1px 0 0 #FFFFFF !important;
}
/* Settings top toolbar row (返回应用 / 搜索) */
html.codex-customizer aside.app-shell-left-panel:has(button[data-settings-panel-slug]) > div:first-child,
html.codex-customizer:has([data-settings-panel-slug]) aside.app-shell-left-panel > div:first-child {
  background: linear-gradient(180deg, #EAF3FC 0%, #C8DFF3 100%) !important;
  border-bottom: 1px solid #7BA7C9 !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
  padding: 6px 8px !important;
  margin: 0 !important;
  border-radius: 0 !important;
}
/* Settings search input strip */
html.codex-customizer aside.app-shell-left-panel input,
html.codex-customizer aside.app-shell-left-panel [placeholder*="设置"],
html.codex-customizer aside.app-shell-left-panel [placeholder*="Search"],
html.codex-customizer aside.app-shell-left-panel [placeholder*="搜索"] {
  background: #FFFFFF !important;
  border: 1px solid #7BA7C9 !important;
  border-radius: 0 !important;
  box-shadow: inset 1px 1px 0 #D0E0F0 !important;
  min-height: 24px !important;
  font-size: 12px !important;
}
/* Settings nav rows dense + square */
html.codex-customizer button[data-settings-panel-slug] {
  border-radius: 0 !important;
  min-height: 26px !important;
  margin: 0 4px 1px !important;
  padding: 4px 8px !important;
  font-size: 12px !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  color: #0A1E33 !important;
  -webkit-text-fill-color: #0A1E33 !important;
}
html.codex-customizer button[data-settings-panel-slug]:hover {
  background: #C5DFF5 !important;
  border-color: #9BC0DC !important;
}
html.codex-customizer button[data-settings-panel-slug][aria-current="page"] {
  background: linear-gradient(180deg, #5EB5F7 0%, #0A5ABF 100%) !important;
  color: #FFFFFF !important;
  -webkit-text-fill-color: #FFFFFF !important;
  border: 1px solid #003C82 !important;
  border-radius: 0 !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.35) !important;
}
html.codex-customizer button[data-settings-panel-slug][aria-current="page"] * {
  color: #FFFFFF !important;
  -webkit-text-fill-color: #FFFFFF !important;
}
/* Settings content cards — hard XP group boxes */
html.codex-customizer:has([data-settings-panel-slug]) .bg-token-bg-fog,
html.codex-customizer:has([data-settings-panel-slug]) [class*="bg-token-bg-fog"],
html.codex-customizer:has([data-settings-panel-slug]) [class*="bg-token-dropdown"],
html.codex-customizer:has([data-settings-panel-slug]) main.main-surface > div > div {
  border-radius: 0 !important;
}
html.codex-customizer:has([data-settings-panel-slug]) main.main-surface .bg-token-bg-fog,
html.codex-customizer:has([data-settings-panel-slug]) main.main-surface [class*="rounded"] {
  background: linear-gradient(180deg, #FFFFFF 0%, #F4F9FD 100%) !important;
  border: 1px solid #7BA7C9 !important;
  border-radius: 0 !important;
  box-shadow:
    inset 1px 1px 0 #FFFFFF,
    1px 1px 0 rgba(10, 50, 100, 0.08) !important;
}
/* Settings page title (常规) */
html.codex-customizer:has([data-settings-panel-slug]) main.main-surface h1,
html.codex-customizer:has([data-settings-panel-slug]) main.main-surface h2 {
  color: #084EA0 !important;
  -webkit-text-fill-color: #084EA0 !important;
  font-weight: 700 !important;
  text-shadow: 0 1px 0 rgba(255,255,255,0.5) !important;
}
/* Back-to-app control */
html.codex-customizer aside.app-shell-left-panel button:has(svg),
html.codex-customizer aside.app-shell-left-panel a[href="#"] {
  border-radius: 0 !important;
}

/* Right rail rows square */
html.codex-customizer main.main-surface aside button,
html.codex-customizer main.main-surface aside [class*="rounded"] {
  border-radius: 0 !important;
}

/* Chat column keeps flex room when right rail opens */
html.codex-customizer main.main-surface .relative.isolate.flex.min-h-0.flex-1.overflow-hidden {
  min-width: 0 !important;
}
html.codex-customizer main.main-surface .app-shell-main-content-viewport {
  min-width: 0 !important;
  flex: 1 1 auto !important;
  max-width: none !important;
}
/* Message column follows chat width — no extra 300px gutter */
html.codex-customizer .thread-scroll-container [class*="max-w-(--thread-content-max-width)"],
html.codex-customizer .thread-scroll-container .mx-auto[class*="max-w"] {
  max-width: 100% !important;
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding-left: 14px !important;
  padding-right: 14px !important;
  box-sizing: border-box !important;
}

/* ============================================================
   FINAL: AI + user message cards must win over all earlier rules
   ============================================================ */
html.codex-customizer .thread-scroll-container [class*="bg-token-foreground/"],
html.codex-customizer .thread-scroll-container [class*="break-words"][class*="overflow-hidden"],
html.codex-customizer .thread-scroll-container [class*="break-words"][class*="px-3"],
html.codex-customizer .thread-scroll-container [class*="break-words"][class*="py-2"] {
  background-image: linear-gradient(180deg, #FFFFFF 0%, #F4F9FD 100%) !important;
  background-color: #FFFFFF !important;
  border: 1px solid #6BA3D0 !important;
  border-radius: 2px !important;
  box-shadow:
    inset 0 1px 0 #FFFFFF,
    1px 1px 2px rgba(10, 50, 100, 0.12) !important;
  padding: 8px 12px !important;
}

/* AI turn cards — match USER bubble width control (max-w 77%), left-aligned */
html.codex-customizer .thread-scroll-container [data-message-author-role="assistant"],
html.codex-customizer .thread-scroll-container [data-message-author-role="system"],
html.codex-customizer .thread-scroll-container .text-size-chat.relative.w-full.min-w-0,
html.codex-customizer .thread-scroll-container div.text-size-chat.relative.w-full.min-w-0,
html.codex-customizer .thread-scroll-container [class*="_markdownContent"],
html.codex-customizer .thread-scroll-container article {
  /* same ratio as native user bubble max-w-[77%] */
  max-width: 77% !important;
  width: fit-content !important;
  min-width: min(280px, 100%) !important;
  margin-left: 0 !important;
  margin-right: auto !important;
  background-image: linear-gradient(180deg, #FFFFFF 0%, #F7FBFF 100%) !important;
  background-color: #FFFFFF !important;
  border: 1px solid #7BA7C9 !important;
  border-radius: 2px !important;
  box-shadow:
    inset 0 1px 0 #FFFFFF,
    1px 1px 2px rgba(10, 50, 100, 0.1) !important;
  padding: 10px 14px !important;
  margin-top: 8px !important;
  margin-bottom: 10px !important;
  box-sizing: border-box !important;
}
/* User bubbles already have max-w-[77%]; reinforce alignment (right-ish chat feel optional) */
html.codex-customizer .thread-scroll-container [class*="bg-token-foreground/"],
html.codex-customizer .thread-scroll-container [class*="break-words"][class*="max-w-"] {
  max-width: 77% !important;
}

/* Keep nested bits flat inside cards */
html.codex-customizer .thread-scroll-container [class*="bg-token-foreground/"] .text-size-chat,
html.codex-customizer .thread-scroll-container [class*="bg-token-foreground/"] [class*="_markdown"],
html.codex-customizer .thread-scroll-container [class*="break-words"] .text-size-chat,
html.codex-customizer .thread-scroll-container [class*="break-words"] [class*="_markdown"],
html.codex-customizer .thread-scroll-container [class*="_markdownContent"] [class*="_markdownContent"],
html.codex-customizer .thread-scroll-container article article,
html.codex-customizer .thread-scroll-container .text-size-chat .text-size-chat {
  background: transparent !important;
  background-image: none !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* Diff / file resource cards inside AI reply — secondary XP group box */
html.codex-customizer .thread-scroll-container [class*="bg-token-bg-fog"],
html.codex-customizer .thread-scroll-container [class*="bg-token-dropdown-background"] {
  background: linear-gradient(180deg, #F8FCFF 0%, #EAF3FC 100%) !important;
  border: 1px solid #7BA7C9 !important;
  border-radius: 2px !important;
  box-shadow: inset 0 1px 0 #FFFFFF !important;
}
`


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
