import { JUJINGYI_SUNSET_BG_DATA_URL } from './jujingyi-sunset-bg'
import { JJ_HEART_SVG, JJ_POLAROID_DATA_URL, JJ_SPARKLE_SVG } from './jujingyi-decor'

/**
 * 鞠婧祎 · 落日海风 v6
 * Full-bleed wallpaper + true frost via wallpaper-blur layers (Electron-safe).
 */
export function buildJujingyiSunsetCss(): string {
  const art = JUJINGYI_SUNSET_BG_DATA_URL
  const polaroid = JJ_POLAROID_DATA_URL
  const sparkle = JJ_SPARKLE_SVG
  const heart = JJ_HEART_SVG

  return `
/* ============================================================
   鞠婧祎 · 落日海风  v6 — true Gaussian frost (layer technique)
   ============================================================ */

html.codex-customizer,
html.codex-customizer.electron-dark,
html.codex-customizer.electron-opaque {
  color-scheme: light !important;
  --jj-rose: #E8929C;
  --jj-rose-mid: #F2B0B8;
  --jj-rose-deep: #D46A78;
  --jj-ink: #3C3236;
  --jj-ink-soft: #7A6A6F;
  --jj-line: rgba(220, 140, 150, 0.18);
  /* Translucent glass — low alpha so backdrop blur can show the art */
  --jj-glass: rgba(255, 250, 252, 0.42);
  --jj-glass-mid: rgba(255, 248, 250, 0.52);
  --jj-glass-strong: rgba(255, 252, 253, 0.62);
  --jj-glass-soft: rgba(255, 255, 255, 0.32);
  --jj-blur: blur(36px) saturate(1.45);
  --jj-blur-sm: blur(22px) saturate(1.3);
  --jj-blur-lg: blur(48px) saturate(1.55);
  --jj-glass-border: 1px solid rgba(255, 255, 255, 0.55);
  --jj-glass-shadow:
    0 12px 40px rgba(160, 80, 100, 0.1),
    0 2px 8px rgba(160, 80, 100, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  --jj-art: url("${art}");
  --jj-polaroid: url("${polaroid}");
  --jj-sparkle: url("${sparkle}");
  --jj-heart: url("${heart}");
  /* edge color sampled from wallpaper so seams never look white */
  --jj-edge: #D898A4;
  --toolbar-height: 44px !important;
  --height-toolbar: 44px !important;
  --spacing-token-safe-header-top: 44px !important;
  --spacing-token-safe-header-left: 80px !important;
  --thread-content-top-inset: 52px !important;
  --thread-floating-content-top-inset: 52px !important;
  --app-shell-main-content-frame-top-offset: 0px !important;
}

html.codex-customizer .rounded-3xl { border-radius: 20px !important; }
html.codex-customizer .rounded-2xl { border-radius: 16px !important; }
html.codex-customizer .rounded-xl { border-radius: 14px !important; }
html.codex-customizer .rounded-lg { border-radius: 12px !important; }

/* ----- Shell: same art on html/body (fallback) + full viewport fill ----- */
html.codex-customizer,
html.codex-customizer body,
html.codex-customizer.electron-dark body,
html.codex-customizer.electron-opaque body {
  background-color: var(--jj-edge) !important;
  background-image: var(--jj-art) !important;
  background-size: cover !important;
  background-position: center 30% !important;
  background-repeat: no-repeat !important;
  background-attachment: fixed !important;
  color: var(--jj-ink) !important;
  font-family: "SF Pro Display", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", system-ui, sans-serif !important;
  -webkit-font-smoothing: antialiased !important;
  margin: 0 !important;
  padding: 0 !important;
  min-height: 100% !important;
  height: 100% !important;
}

html.codex-customizer #root,
html.codex-customizer body > div:first-of-type {
  background: transparent !important;
  background-image: none !important;
  border: none !important;
  box-shadow: none !important;
  margin: 0 !important;
  padding: 0 !important;
  min-height: 100% !important;
  height: 100% !important;
}

html.codex-customizer body::before,
html.codex-customizer body::after {
  content: none !important;
  display: none !important;
}

/* ----- Title bar: uniform Gaussian frosted glass ----- */
html.codex-customizer header.app-header-tint,
html.codex-customizer.electron-dark header.app-header-tint,
html.codex-customizer.electron-opaque header.app-header-tint,
html.codex-customizer main.main-surface > header.app-header-tint,
html.codex-customizer main.main-surface > header.app-header-tint.app-header-tint,
html.codex-customizer .app-header-tint {
  position: relative !important;
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.18) !important;
  background-color: rgba(255, 255, 255, 0.18) !important;
  background-image: none !important;
  border: none !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.48) !important;
  color: #2A2226 !important;
  -webkit-text-fill-color: #2A2226 !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.65),
    0 8px 28px rgba(180, 100, 120, 0.06) !important;
  backdrop-filter: blur(40px) saturate(1.5) !important;
  -webkit-backdrop-filter: blur(40px) saturate(1.5) !important;
  height: 44px !important;
  min-height: 44px !important;
  max-height: 44px !important;
  padding: 0 28px 2px 78px !important;
  margin: 0 !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 4px !important;
  z-index: 200 !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  overflow: hidden !important;
}

/* No art-clone pseudos on caption (avoid banding) */
html.codex-customizer header.app-header-tint::before,
html.codex-customizer header.app-header-tint::after {
  content: none !important;
  display: none !important;
}

/* Kill measure-clone twins that create a second/misplaced button row */
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

/* One optical row for every header column — above frost layers */
html.codex-customizer header.app-header-tint > * {
  position: relative !important;
  z-index: 2 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  height: 100% !important;
  min-height: 0 !important;
  max-height: none !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  box-sizing: border-box !important;
  line-height: 1 !important;
  overflow: visible !important;
  min-width: 0 !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer header.app-header-tint > * > * {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  height: auto !important;
  max-height: none !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  line-height: 1 !important;
  min-width: 0 !important;
}

/* Title text: high-contrast dark on glass (beats any residual white remint) */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] header.app-header-tint,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] header.app-header-tint .truncate,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] header.app-header-tint [class*="truncate"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] header.app-header-tint span:not(button span):not([class*="sr-only"]),
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] header.app-header-tint h1,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] header.app-header-tint h2,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] header.app-header-tint [class*="font-semibold"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] header.app-header-tint [class*="font-medium"],
html.codex-customizer header.app-header-tint,
html.codex-customizer header.app-header-tint .truncate,
html.codex-customizer header.app-header-tint [class*="truncate"],
html.codex-customizer header.app-header-tint span:not(button span):not([class*="sr-only"]) {
  color: #2A2226 !important;
  -webkit-text-fill-color: #2A2226 !important;
  text-shadow: none !important;
  opacity: 1 !important;
  visibility: visible !important;
}

html.codex-customizer header.app-header-tint .truncate,
html.codex-customizer header.app-header-tint [class*="truncate"] {
  font-size: 13px !important;
  font-weight: 650 !important;
  line-height: 26px !important;
  min-width: 0 !important;
  max-width: min(42vw, 480px) !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  flex: 0 1 auto !important;
}

/* Center title block: flex row, leave room for right tools */
html.codex-customizer header.app-header-tint [class*="grid-cols"],
html.codex-customizer header.app-header-tint [class*="grid"] {
  display: flex !important;
  align-items: center !important;
  width: auto !important;
  min-width: 0 !important;
  max-width: calc(100% - 220px) !important;
  gap: 6px !important;
  flex: 1 1 auto !important;
}

/* Toolbar chips — mini frosted pills */
html.codex-customizer header.app-header-tint button,
html.codex-customizer header.app-header-tint [role="button"],
html.codex-customizer header.app-header-tint [class*="border"][class*="cursor"] {
  background: rgba(255, 255, 255, 0.42) !important;
  border: 1px solid rgba(255, 255, 255, 0.55) !important;
  border-radius: 999px !important;
  color: #2A2226 !important;
  -webkit-text-fill-color: #2A2226 !important;
  box-shadow:
    0 2px 10px rgba(160, 80, 100, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.85) !important;
  height: 28px !important;
  min-height: 28px !important;
  max-height: 28px !important;
  padding: 0 11px !important;
  margin: 0 2px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  line-height: 1 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  align-self: center !important;
  gap: 4px !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
  position: relative !important;
  left: auto !important;
  right: auto !important;
  top: auto !important;
  bottom: auto !important;
  transform: none !important;
  backdrop-filter: var(--jj-blur-sm) !important;
  -webkit-backdrop-filter: var(--jj-blur-sm) !important;
}

/* Icon-only square tools */
html.codex-customizer header.app-header-tint button:not(:has(span:not(:empty))):not(:has([class*="truncate"])) {
  width: 28px !important;
  min-width: 28px !important;
  max-width: 28px !important;
  padding: 0 !important;
}

html.codex-customizer header.app-header-tint button:hover,
html.codex-customizer header.app-header-tint [role="button"]:hover {
  background: rgba(255, 255, 255, 0.62) !important;
  border-color: rgba(255, 255, 255, 0.75) !important;
}

html.codex-customizer header.app-header-tint button *,
html.codex-customizer header.app-header-tint button span,
html.codex-customizer header.app-header-tint [role="button"] * {
  color: #2A2226 !important;
  -webkit-text-fill-color: #2A2226 !important;
  opacity: 1 !important;
  visibility: visible !important;
  font-size: 12px !important;
  line-height: 1 !important;
  text-shadow: none !important;
}

html.codex-customizer header.app-header-tint button svg,
html.codex-customizer header.app-header-tint button svg *,
html.codex-customizer header.app-header-tint [role="button"] svg {
  color: #C45A6C !important;
  -webkit-text-fill-color: #C45A6C !important;
  fill: currentColor !important;
  width: 14px !important;
  height: 14px !important;
  opacity: 1 !important;
  visibility: visible !important;
  flex-shrink: 0 !important;
}

/*
 * Rightmost toolbar cluster — pin inside the bar, NOT past the window edge.
 * Extra margin-right keeps the last icon clear of the rounded macOS corner.
 */
html.codex-customizer header.app-header-tint > :last-child {
  margin-left: auto !important;
  margin-right: 8px !important;
  flex: 0 0 auto !important;
  flex-shrink: 0 !important;
  overflow: visible !important;
  min-width: max-content !important;
  width: auto !important;
  max-width: none !important;
  justify-content: flex-end !important;
  align-items: center !important;
  gap: 3px !important;
  padding-right: 0 !important;
  position: relative !important;
  left: auto !important;
  right: auto !important;
  transform: none !important;
  box-sizing: border-box !important;
}

html.codex-customizer header.app-header-tint > :last-child > * {
  flex-shrink: 0 !important;
  position: relative !important;
  left: auto !important;
  right: auto !important;
  top: auto !important;
  bottom: auto !important;
  transform: none !important;
  margin: 0 1px !important;
}

/* Every trailing tool stays in flow — no absolute that escapes the bar */
html.codex-customizer header.app-header-tint button[aria-label*="打开"],
html.codex-customizer header.app-header-tint button[aria-label*="位置"],
html.codex-customizer header.app-header-tint button[aria-label*="Open"],
html.codex-customizer header.app-header-tint button[aria-label*="显示"],
html.codex-customizer header.app-header-tint button[aria-label*="隐藏"],
html.codex-customizer header.app-header-tint button[aria-label*="侧边栏"],
html.codex-customizer header.app-header-tint button[aria-label*="摘要"],
html.codex-customizer header.app-header-tint > :last-child button,
html.codex-customizer header.app-header-tint > :last-child [role="button"] {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
  left: auto !important;
  right: auto !important;
  top: auto !important;
  bottom: auto !important;
  transform: none !important;
  z-index: 220 !important;
  pointer-events: auto !important;
  flex-shrink: 0 !important;
  margin: 0 1px !important;
  /* slightly tighter so 4 tools fit before the corner */
  height: 26px !important;
  min-height: 26px !important;
  max-height: 26px !important;
}

html.codex-customizer header.app-header-tint > :last-child button:not(:has(span:not(:empty))),
html.codex-customizer header.app-header-tint > :last-child button:not(:has([class*="truncate"])) {
  width: 26px !important;
  min-width: 26px !important;
  max-width: 26px !important;
  padding: 0 !important;
}

/* Title group must shrink so the right cluster is never pushed off-screen */
html.codex-customizer header.app-header-tint > :first-child,
html.codex-customizer header.app-header-tint > :nth-child(2) {
  min-width: 0 !important;
  flex: 1 1 auto !important;
  overflow: hidden !important;
}

/* ----- Sidebar — seamless frosted glass (no art-clone banding) -----
 * ONE uniform glass fill + real backdrop-filter. No wallpaper clone.
 */
html.codex-customizer aside.app-shell-left-panel,
html.codex-customizer.electron-dark aside.app-shell-left-panel,
html.codex-customizer.electron-opaque aside.app-shell-left-panel,
html.codex-customizer .app-shell-left-panel {
  position: relative !important;
  isolation: isolate !important;
  background: rgba(255, 248, 250, 0.38) !important;
  background-color: rgba(255, 248, 250, 0.38) !important;
  background-image: none !important;
  border-right: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow:
    8px 0 32px rgba(220, 120, 140, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.62) !important;
  color: var(--jj-ink) !important;
  z-index: 30 !important;
  backdrop-filter: blur(44px) saturate(1.45) !important;
  -webkit-backdrop-filter: blur(44px) saturate(1.45) !important;
  overflow: visible !important;
}

/* Kill leftover pseudo frost layers (prevent 分色) */
html.codex-customizer aside.app-shell-left-panel::before,
html.codex-customizer .app-shell-left-panel::before,
html.codex-customizer aside.app-shell-left-panel::after,
html.codex-customizer .app-shell-left-panel::after {
  content: none !important;
  display: none !important;
  background: none !important;
  background-image: none !important;
  filter: none !important;
  opacity: 0 !important;
}

/* ----- Left rail PIN: stay permanently open after explicit open ----- */
html.codex-customizer.cc-left-pinned aside.app-shell-left-panel,
html.codex-customizer.cc-left-pinned .app-shell-left-panel,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"].cc-left-pinned aside.app-shell-left-panel {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  transform: none !important;
  position: relative !important;
  left: auto !important;
  right: auto !important;
  top: auto !important;
  bottom: auto !important;
  height: 100% !important;
  max-height: none !important;
  min-width: 220px !important;
  width: max(220px, min(320px, 28vw)) !important;
  flex: 0 0 auto !important;
  z-index: 40 !important;
  margin: 0 !important;
}

/* Nested surfaces transparent — one continuous glass column, not stacked cards */
html.codex-customizer aside.app-shell-left-panel > *,
html.codex-customizer .app-shell-left-panel > * {
  position: relative !important;
  z-index: 1 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
}

html.codex-customizer aside.app-shell-left-panel,
html.codex-customizer aside.app-shell-left-panel button,
html.codex-customizer aside.app-shell-left-panel a,
html.codex-customizer aside.app-shell-left-panel span,
html.codex-customizer aside.app-shell-left-panel div,
html.codex-customizer aside.app-shell-left-panel p,
html.codex-customizer aside.app-shell-left-panel label,
html.codex-customizer aside.app-shell-left-panel nav,
html.codex-customizer aside.app-shell-left-panel ul,
html.codex-customizer aside.app-shell-left-panel li,
html.codex-customizer aside.app-shell-left-panel section {
  color: var(--jj-ink) !important;
  -webkit-text-fill-color: var(--jj-ink) !important;
}

/* Kill every nested solid fill / border so nav rows stay flat */
html.codex-customizer aside.app-shell-left-panel div,
html.codex-customizer aside.app-shell-left-panel nav,
html.codex-customizer aside.app-shell-left-panel ul,
html.codex-customizer aside.app-shell-left-panel li,
html.codex-customizer aside.app-shell-left-panel section,
html.codex-customizer aside.app-shell-left-panel [class*="bg-"],
html.codex-customizer aside.app-shell-left-panel [class*="surface"],
html.codex-customizer aside.app-shell-left-panel [class*="sidebar"] {
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
}

/*
 * CRITICAL: nav / project / thread rows must be FLAT (not glass pills).
 * Earlier rules painted every button as a frosted capsule → noisy stacked cards.
 */
html.codex-customizer aside.app-shell-left-panel button,
html.codex-customizer aside.app-shell-left-panel a,
html.codex-customizer aside.app-shell-left-panel [role="button"],
html.codex-customizer aside.app-shell-left-panel [class*="rounded"],
html.codex-customizer aside.app-shell-left-panel [class*="rounded-md"],
html.codex-customizer aside.app-shell-left-panel [class*="rounded-lg"],
html.codex-customizer aside.app-shell-left-panel [class*="rounded-xl"] {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  border: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border-radius: 10px !important;
  margin: 1px 6px !important;
  min-height: unset !important;
  letter-spacing: normal !important;
}

html.codex-customizer aside.app-shell-left-panel svg {
  color: var(--jj-rose) !important;
  -webkit-text-fill-color: var(--jj-rose) !important;
}

/* Subtle hover wash only — no pill chrome */
html.codex-customizer aside.app-shell-left-panel button:hover:not([aria-current="page"]),
html.codex-customizer aside.app-shell-left-panel a:hover:not([aria-current="page"]),
html.codex-customizer aside.app-shell-left-panel [role="button"]:hover:not([aria-current="page"]) {
  background-color: rgba(232, 146, 156, 0.1) !important;
  background-image: none !important;
  border: none !important;
  box-shadow: none !important;
}

/* Section titles: plain text, never a white chip */
html.codex-customizer aside.app-shell-left-panel [class*="nav-section-title"],
html.codex-customizer aside.app-shell-left-panel [class*="nav-section-title"] *,
html.codex-customizer aside.app-shell-left-panel [class*="section-title"],
html.codex-customizer aside.app-shell-left-panel button[class*="section"] {
  color: var(--jj-rose-deep) !important;
  -webkit-text-fill-color: var(--jj-rose-deep) !important;
  background: transparent !important;
  background-image: none !important;
  border: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Selected row: soft rose wash + left accent, still flat */
html.codex-customizer aside.app-shell-left-panel [aria-current="page"],
html.codex-customizer aside.app-shell-left-panel [aria-selected="true"],
html.codex-customizer aside.app-shell-left-panel button[aria-current="page"],
html.codex-customizer aside.app-shell-left-panel a[aria-current="page"] {
  background-color: rgba(255, 255, 255, 0.28) !important;
  background-image: none !important;
  border: none !important;
  box-shadow: inset 2px 0 0 var(--jj-rose-deep) !important;
  color: var(--jj-ink) !important;
  -webkit-text-fill-color: var(--jj-ink) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer aside.app-shell-left-panel [aria-current="page"] *,
html.codex-customizer aside.app-shell-left-panel [aria-selected="true"] * {
  color: var(--jj-ink) !important;
  -webkit-text-fill-color: var(--jj-ink) !important;
  text-shadow: none !important;
}

html.codex-customizer aside.app-shell-left-panel [aria-current="page"] svg,
html.codex-customizer aside.app-shell-left-panel [aria-selected="true"] svg {
  color: var(--jj-rose-deep) !important;
  -webkit-text-fill-color: var(--jj-rose-deep) !important;
}

html.codex-customizer aside.app-shell-left-panel .text-token-description-foreground,
html.codex-customizer aside.app-shell-left-panel .sidebar-foreground-muted,
html.codex-customizer aside.app-shell-left-panel .opacity-50 {
  color: var(--jj-ink-soft) !important;
  -webkit-text-fill-color: var(--jj-ink-soft) !important;
  opacity: 1 !important;
}

/*
 * DO NOT style button[class*="rounded-full"] here —
 * Codex paints almost every nav row with rounded-full, so that selector
 * turns the whole rail into stacked glass capsules.
 *
 * Top chrome (Codex/search) and 「展开显示」are marked by CDP as
 * .cc-jj-chip / .cc-jj-expand — see cdp-injector.
 */
html.codex-customizer aside.app-shell-left-panel button.cc-jj-chip,
html.codex-customizer aside.app-shell-left-panel [role="button"].cc-jj-chip,
html.codex-customizer aside.app-shell-left-panel a.cc-jj-chip,
html.codex-customizer aside.app-shell-left-panel button.cc-jj-expand {
  background: rgba(255, 255, 255, 0.42) !important;
  background-color: rgba(255, 255, 255, 0.42) !important;
  border: 1px solid rgba(255, 255, 255, 0.55) !important;
  border-radius: 999px !important;
  box-shadow:
    0 4px 14px rgba(220, 120, 140, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(16px) saturate(1.25) !important;
  -webkit-backdrop-filter: blur(16px) saturate(1.25) !important;
  color: var(--jj-rose-deep) !important;
  -webkit-text-fill-color: var(--jj-rose-deep) !important;
  font-weight: 650 !important;
  min-height: 30px !important;
  padding: 0 12px !important;
  margin: 4px 8px !important;
}

/* Selected row — soft wash only */
html.codex-customizer aside.app-shell-left-panel [aria-current="page"],
html.codex-customizer aside.app-shell-left-panel [aria-selected="true"],
html.codex-customizer aside.app-shell-left-panel button[aria-current="page"],
html.codex-customizer aside.app-shell-left-panel a[aria-current="page"] {
  margin: 1px 6px !important;
  min-height: unset !important;
  letter-spacing: normal !important;
  border-radius: 10px !important;
  background: rgba(255, 255, 255, 0.28) !important;
  background-color: rgba(255, 255, 255, 0.28) !important;
  background-image: none !important;
  border: none !important;
  box-shadow: inset 2px 0 0 var(--jj-rose-deep) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer .sidebar-resize-handle-line {
  background: rgba(232, 146, 156, 0.28) !important;
}

/* ----- Main surface: art painted ON main (not just body bleed-through) -----
 * Base theme-css paints solid token bg on main — override with full wallpaper
 * so the non-sidebar region is always covered end-to-end.
 */
html.codex-customizer main.main-surface,
html.codex-customizer.electron-dark main.main-surface,
html.codex-customizer.electron-opaque main.main-surface {
  position: relative !important;
  /* shorthand beats base solid token background on main */
  background: var(--jj-edge) var(--jj-art) center 30% / cover no-repeat fixed !important;
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  color: var(--jj-ink) !important;
  overflow: hidden !important;
  z-index: 10 !important;
  flex: 1 1 auto !important;
  min-width: 0 !important;
  min-height: 0 !important;
  align-self: stretch !important;
}

/* Very light left veil only — keep art readable as full wallpaper */
html.codex-customizer main.main-surface::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  pointer-events: none !important;
  z-index: 0 !important;
  background: linear-gradient(100deg,
    rgba(255, 245, 247, 0.22) 0%,
    rgba(255, 245, 247, 0.08) 28%,
    transparent 52%) !important;
}

/*
 * DO NOT set position:relative on main > * —
 * that rewrites the right tools rail layout.
 */

html.codex-customizer main.main-surface,
html.codex-customizer main.main-surface .text-token-foreground,
html.codex-customizer main.main-surface [class*="_markdownText"],
html.codex-customizer main.main-surface [class*="_paragraph"],
html.codex-customizer main.main-surface p,
html.codex-customizer main.main-surface li,
html.codex-customizer main.main-surface span {
  color: var(--jj-ink) !important;
  -webkit-text-fill-color: var(--jj-ink) !important;
}

/* Kill every intermediate opaque surface in the main column */
html.codex-customizer .thread-scroll-container,
html.codex-customizer [container-name="thread-content"],
html.codex-customizer .bg-token-main-surface-primary,
html.codex-customizer [class*="bg-token-main-surface-primary"],
html.codex-customizer [class*="bg-token-main-surface-secondary"],
html.codex-customizer .app-shell-main-content-viewport,
html.codex-customizer .app-shell-main-content-frame,
html.codex-customizer main.main-surface > div,
html.codex-customizer main.main-surface [role="main"],
html.codex-customizer main.main-surface [class*="flex-1"],
html.codex-customizer main.main-surface [class*="min-h-0"] {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

html.codex-customizer .app-shell-main-content-viewport,
html.codex-customizer .app-shell-main-content-frame {
  margin: 0 !important;
  border: none !important;
}

html.codex-customizer .app-shell-main-content-top-fade,
html.codex-customizer [class*="from-token-main-surface"] {
  display: none !important;
  opacity: 0 !important;
  background: transparent !important;
}

html.codex-customizer main.main-surface header.sticky,
html.codex-customizer main .sticky.top-0,
html.codex-customizer main header:not(.app-header-tint) {
  background: rgba(255, 252, 253, 0.36) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.42) !important;
  color: var(--jj-ink) !important;
  backdrop-filter: var(--jj-blur) !important;
  -webkit-backdrop-filter: var(--jj-blur) !important;
  box-shadow: 0 6px 24px rgba(180, 100, 120, 0.06) !important;
}

/* Content must clear the frosted caption (native top inset + extra air) */
html.codex-customizer .thread-scroll-container,
html.codex-customizer [container-name="thread-content"],
html.codex-customizer main.main-surface [role="main"] {
  padding-top: 8px !important;
  box-sizing: border-box !important;
}

html.codex-customizer .app-shell-main-content-viewport,
html.codex-customizer .app-shell-main-content-frame {
  padding-top: 0 !important;
  margin-top: 0 !important;
}

/* ============================================================
   Home hero + suggestion cards (gallery skin-01 language)
   ============================================================ */

/* Project picker / hero strip above cards */
html.codex-customizer main.main-surface [data-feature="game-source"] {
  text-shadow: 0 1px 12px rgba(255, 255, 255, 0.65) !important;
  color: var(--jj-ink) !important;
  -webkit-text-fill-color: var(--jj-ink) !important;
}

html.codex-customizer main.main-surface [data-feature="game-source"]::before,
html.codex-customizer main.main-surface [data-feature="game-source"]::after {
  content: none !important;
  display: none !important;
}

/* Hero prompt card — shell transparent when frost layers present; fallback light glass */
html.codex-customizer main.main-surface [role="main"] > div:first-child > div:first-child > div:first-child,
html.codex-customizer main.main-surface [role="main"] [class*="rounded-3xl"],
html.codex-customizer main.main-surface [role="main"] [class*="rounded-2xl"][class*="border"],
html.codex-customizer main.main-surface [role="main"] [class*="rounded-2xl"][class*="shadow"],
html.codex-customizer main.main-surface [role="main"] [class*="rounded-full"][class*="border"] {
  background: rgba(255, 255, 255, 0.16) !important;
  background-color: rgba(255, 255, 255, 0.16) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  border-radius: 22px !important;
  box-shadow:
    0 14px 40px rgba(100, 50, 70, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
  backdrop-filter: blur(44px) saturate(1.55) !important;
  -webkit-backdrop-filter: blur(44px) saturate(1.55) !important;
  overflow: hidden !important;
  isolation: auto !important;
}

html.codex-customizer main.main-surface [role="main"] .cc-jj-frost,
html.codex-customizer main.main-surface [role="main"] [class*="rounded-3xl"].cc-jj-frost,
html.codex-customizer main.main-surface [role="main"] [class*="rounded-2xl"].cc-jj-frost {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  overflow: hidden !important;
  isolation: isolate !important;
}

html.codex-customizer main.main-surface [role="main"] > div:first-child > div:first-child::before,
html.codex-customizer main.main-surface [role="main"] > div:first-child > div:first-child::after {
  content: none !important;
  display: none !important;
  background: none !important;
}

/* Main prompt line: larger, warmer editorial type */
html.codex-customizer main.main-surface [data-feature="game-source"] + *,
html.codex-customizer main.main-surface [role="main"] h1,
html.codex-customizer main.main-surface [role="main"] h2,
html.codex-customizer main.main-surface [role="main"] [class*="text-2xl"],
html.codex-customizer main.main-surface [role="main"] [class*="text-3xl"],
html.codex-customizer main.main-surface [role="main"] [class*="font-semibold"][class*="text-"] {
  color: #3A2E32 !important;
  -webkit-text-fill-color: #3A2E32 !important;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.55), 0 8px 24px rgba(255, 255, 255, 0.25) !important;
  font-weight: 650 !important;
  letter-spacing: 0.01em !important;
}

/* Four suggestion cards — true frost shells */
html.codex-customizer .group\\/home-suggestions,
html.codex-customizer [class*="home-suggestions"] {
  gap: 14px !important;
}

html.codex-customizer .group\\/home-suggestions button,
html.codex-customizer [class*="home-suggestions"] button {
  position: relative !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  gap: 12px !important;
  background: rgba(255, 255, 255, 0.14) !important;
  background-color: rgba(255, 255, 255, 0.14) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  border-radius: 18px !important;
  box-shadow:
    0 12px 36px rgba(100, 50, 70, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
  color: var(--jj-ink) !important;
  -webkit-text-fill-color: var(--jj-ink) !important;
  backdrop-filter: blur(36px) saturate(1.45) !important;
  -webkit-backdrop-filter: blur(36px) saturate(1.45) !important;
  min-height: 128px !important;
  padding: 18px 16px 28px !important;
  overflow: hidden !important;
  isolation: auto !important;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease !important;
}

html.codex-customizer .group\\/home-suggestions button.cc-jj-frost,
html.codex-customizer [class*="home-suggestions"] button.cc-jj-frost {
  background: transparent !important;
  background-color: transparent !important;
  isolation: isolate !important;
  overflow: hidden !important;
}

html.codex-customizer .group\\/home-suggestions button:hover,
html.codex-customizer [class*="home-suggestions"] button:hover {
  border-color: rgba(255, 255, 255, 0.72) !important;
  box-shadow:
    0 18px 48px rgba(200, 100, 120, 0.14),
    0 2px 8px rgba(200, 100, 120, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.75) !important;
  transform: translateY(-2px) !important;
}

/* Heart / sparkle above frost layers */
html.codex-customizer .group\\/home-suggestions button.cc-jj-frost::before,
html.codex-customizer .group\\/home-suggestions button.cc-jj-frost::after,
html.codex-customizer [class*="home-suggestions"] button.cc-jj-frost::before,
html.codex-customizer [class*="home-suggestions"] button.cc-jj-frost::after {
  z-index: 3 !important;
}

/* Circular rose icon bubbles (gallery style — not square tiles) */
html.codex-customizer .group\\/home-suggestions button > span:first-child,
html.codex-customizer [class*="home-suggestions"] button > span:first-child {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-bottom: 2px !important;
}

html.codex-customizer .group\\/home-suggestions button > span:first-child > span:first-child,
html.codex-customizer .group\\/home-suggestions button [class*="rounded"],
html.codex-customizer [class*="home-suggestions"] button > span:first-child > span:first-child,
html.codex-customizer [class*="home-suggestions"] button [class*="rounded-full"],
html.codex-customizer [class*="home-suggestions"] button [class*="rounded-md"],
html.codex-customizer [class*="home-suggestions"] button [class*="rounded-lg"] {
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;
  min-height: 44px !important;
  border-radius: 999px !important;
  background: linear-gradient(145deg, #F5B8C0 0%, #E88A98 48%, #D46A78 100%) !important;
  background-image: linear-gradient(145deg, #F5B8C0 0%, #E88A98 48%, #D46A78 100%) !important;
  color: #FFFFFF !important;
  -webkit-text-fill-color: #FFFFFF !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  filter: none !important;
  position: relative !important;
  z-index: 2 !important;
  box-shadow:
    0 8px 18px rgba(232, 138, 152, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.45) !important;
  border: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

html.codex-customizer .group\\/home-suggestions button svg,
html.codex-customizer [class*="home-suggestions"] button svg {
  color: #FFFFFF !important;
  -webkit-text-fill-color: #FFFFFF !important;
  width: 20px !important;
  height: 20px !important;
  stroke: currentColor !important;
}

html.codex-customizer .group\\/home-suggestions button svg *,
html.codex-customizer [class*="home-suggestions"] button svg * {
  color: #FFFFFF !important;
  fill: currentColor !important;
  stroke: currentColor !important;
}

/* Card label text (not the circular icon bubble) */
html.codex-customizer .group\\/home-suggestions button {
  color: var(--jj-ink) !important;
  -webkit-text-fill-color: var(--jj-ink) !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  line-height: 1.35 !important;
  text-align: left !important;
}

html.codex-customizer .group\\/home-suggestions button > span:not(:first-child),
html.codex-customizer .group\\/home-suggestions button span:not(:has(svg)),
html.codex-customizer [class*="home-suggestions"] button > span:not(:first-child),
html.codex-customizer [class*="home-suggestions"] button span:not(:has(svg)) {
  color: var(--jj-ink) !important;
  -webkit-text-fill-color: var(--jj-ink) !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  line-height: 1.35 !important;
  text-align: left !important;
}

/* Heart under each card */
html.codex-customizer .group\\/home-suggestions button::after,
html.codex-customizer [class*="home-suggestions"] button::after {
  content: "" !important;
  position: absolute !important;
  left: 50% !important;
  bottom: 10px !important;
  width: 13px !important;
  height: 12px !important;
  margin-left: -6.5px !important;
  background: var(--jj-heart) center / contain no-repeat !important;
  opacity: 0.78 !important;
  pointer-events: none !important;
  filter: drop-shadow(0 1px 2px rgba(232, 138, 152, 0.25)) !important;
}

/* Soft sparkle on cards */
html.codex-customizer .group\\/home-suggestions button::before,
html.codex-customizer [class*="home-suggestions"] button::before {
  content: "" !important;
  position: absolute !important;
  top: 12px !important;
  right: 14px !important;
  width: 11px !important;
  height: 11px !important;
  background: var(--jj-sparkle) center / contain no-repeat !important;
  opacity: 0.45 !important;
  pointer-events: none !important;
}

/* ----- Composer + Full-access: true frosted glass (low alpha + strong blur) -----
 * isolation:isolate kills/weakens backdrop-filter sampling — do NOT use it here.
 */
html.codex-customizer .composer-surface-chrome,
html.codex-customizer [class*="composer"][class*="surface"],
html.codex-customizer form[class*="composer"],
html.codex-customizer [class*="composer-parent"],
html.codex-customizer [data-codex-composer-root] {
  position: relative !important;
  isolation: auto !important;
  overflow: visible !important;
  background: rgba(255, 255, 255, 0.16) !important;
  background-color: rgba(255, 255, 255, 0.16) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  border-radius: 24px !important;
  box-shadow:
    0 16px 48px rgba(120, 60, 80, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
  backdrop-filter: blur(56px) saturate(1.65) !important;
  -webkit-backdrop-filter: blur(56px) saturate(1.65) !important;
  z-index: 40 !important;
}

html.codex-customizer .composer-surface-chrome::before,
html.codex-customizer .composer-surface-chrome::after,
html.codex-customizer [class*="composer"][class*="surface"]::before,
html.codex-customizer [class*="composer"][class*="surface"]::after,
html.codex-customizer [data-codex-composer-root]::before,
html.codex-customizer [data-codex-composer-root]::after,
html.codex-customizer [class*="composer-parent"]::before,
html.codex-customizer [class*="composer-parent"]::after {
  content: none !important;
  display: none !important;
}

html.codex-customizer .composer-surface-chrome div:not(.cc-jj-frost-layer):not(.cc-jj-frost-tint),
html.codex-customizer .composer-surface-chrome form,
html.codex-customizer .composer-surface-chrome section,
html.codex-customizer [data-codex-composer-root] div:not(.cc-jj-frost-layer):not(.cc-jj-frost-tint),
html.codex-customizer [data-codex-composer-root] form,
html.codex-customizer [class*="composer-parent"] div:not(.cc-jj-frost-layer):not(.cc-jj-frost-tint),
html.codex-customizer [class*="composer"][class*="surface"] div:not(.cc-jj-frost-layer):not(.cc-jj-frost-tint) {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Explicit restore for frost layers inside composer (beats any wipe rules) */
html.codex-customizer .composer-surface-chrome > .cc-jj-frost-layer,
html.codex-customizer [data-codex-composer-root] > .cc-jj-frost-layer,
html.codex-customizer [class*="composer-parent"] > .cc-jj-frost-layer,
html.codex-customizer [class*="composer"][class*="surface"] > .cc-jj-frost-layer {
  background-color: var(--jj-edge) !important;
  background-image: var(--jj-art) !important;
  background-size: cover !important;
  background-position: center 30% !important;
  background-attachment: fixed !important;
  filter: blur(40px) saturate(1.55) brightness(1.04) !important;
  -webkit-filter: blur(40px) saturate(1.55) brightness(1.04) !important;
  opacity: 1 !important;
  display: block !important;
}
html.codex-customizer .composer-surface-chrome > .cc-jj-frost-tint,
html.codex-customizer [data-codex-composer-root] > .cc-jj-frost-tint,
html.codex-customizer [class*="composer-parent"] > .cc-jj-frost-tint,
html.codex-customizer [class*="composer"][class*="surface"] > .cc-jj-frost-tint {
  background: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.28) 0%,
    rgba(255, 245, 248, 0.18) 100%
  ) !important;
  opacity: 1 !important;
  display: block !important;
  filter: none !important;
}

/* Full-access banner — same true glass as composer */
html.codex-customizer [class*="validation"][class*="rounded-t"],
html.codex-customizer [class*="-mb-8"][class*="rounded-t"],
html.codex-customizer main.main-surface [class*="rounded-t-3xl"],
html.codex-customizer [class*="bg-token-input-validation"],
html.codex-customizer [class*="validation-error"],
html.codex-customizer [class*="validation-warning"],
html.codex-customizer [class*="validation-info"] {
  position: relative !important;
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.14) !important;
  background-color: rgba(255, 255, 255, 0.14) !important;
  background-image: none !important;
  backdrop-filter: blur(48px) saturate(1.55) !important;
  -webkit-backdrop-filter: blur(48px) saturate(1.55) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  box-shadow:
    0 8px 28px rgba(120, 60, 80, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
}

/* Full-access inner overlay nodes also transparent */
html.codex-customizer [class*="validation"] [class*="absolute"],
html.codex-customizer [class*="bg-token-input-validation"] [class*="absolute"],
html.codex-customizer [class*="validation"] > div {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
}

html.codex-customizer .composer-surface-chrome .ProseMirror,
html.codex-customizer .ProseMirror {
  color: var(--jj-ink) !important;
  -webkit-text-fill-color: var(--jj-ink) !important;
}

html.codex-customizer .composer-surface-chrome .ProseMirror p.is-editor-empty::before,
html.codex-customizer .ProseMirror p.is-editor-empty::before,
html.codex-customizer .ProseMirror .is-empty::before {
  color: rgba(122, 106, 111, 0.48) !important;
  -webkit-text-fill-color: rgba(122, 106, 111, 0.48) !important;
}

html.codex-customizer .composer-surface-chrome button {
  border-radius: 999px !important;
}

html.codex-customizer button[aria-label*="发送"],
html.codex-customizer button[aria-label*="Send"] {
  background: linear-gradient(145deg, #F2B0B8, #E8929C) !important;
  color: #fff !important;
  border: none !important;
  box-shadow: 0 3px 12px rgba(232, 146, 156, 0.38) !important;
}

/* ----- Cards / panels in MAIN only (never restyle left sidebar rows) ----- */
html.codex-customizer main.main-surface .bg-token-bg-fog,
html.codex-customizer main.main-surface [class*="bg-token-bg-fog"],
html.codex-customizer main.main-surface [class*="bg-token-dropdown-background"],
html.codex-customizer main.main-surface [class*="elevation"],
html.codex-customizer main.main-surface [class*="rounded-2xl"][class*="bg-token"],
html.codex-customizer main.main-surface [class*="rounded-xl"][class*="bg-token"],
html.codex-customizer main.main-surface [class*="rounded-3xl"][class*="bg-"],
html.codex-customizer main.main-surface [class*="rounded-2xl"][class*="bg-"],
html.codex-customizer main.main-surface [class*="rounded-xl"][class*="border"],
html.codex-customizer main.main-surface [class*="shadow"][class*="rounded"],
html.codex-customizer main.main-surface [class*="bg-white"],
html.codex-customizer main.main-surface [class*="bg-token-surface"],
html.codex-customizer main.main-surface [class*="bg-token-elevated"],
html.codex-customizer main.main-surface [class*="bg-token-input-background"],
html.codex-customizer [role="dialog"],
html.codex-customizer [role="menu"],
html.codex-customizer [role="listbox"],
html.codex-customizer [data-radix-popper-content-wrapper] > *,
html.codex-customizer [data-radix-menu-content],
html.codex-customizer [data-radix-popper-content-wrapper] [class*="rounded"] {
  background: rgba(255, 248, 250, 0.36) !important;
  background-color: rgba(255, 248, 250, 0.36) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.55) !important;
  border-radius: 16px !important;
  box-shadow:
    0 12px 36px rgba(160, 80, 100, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.7) !important;
  color: var(--jj-ink) !important;
  backdrop-filter: blur(36px) saturate(1.45) !important;
  -webkit-backdrop-filter: blur(36px) saturate(1.45) !important;
}

/* Explicitly never glass-card anything inside the left rail */
html.codex-customizer aside.app-shell-left-panel [class*="rounded"]:not(button[class*="rounded-full"]),
html.codex-customizer aside.app-shell-left-panel [class*="bg-token"],
html.codex-customizer aside.app-shell-left-panel [class*="elevation"] {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Message bubbles & AI/user cards */
html.codex-customizer main.main-surface article[class*="bg-"],
html.codex-customizer main.main-surface [class*="bg-token-message"],
html.codex-customizer main.main-surface [class*="bg-token-foreground"],
html.codex-customizer main.main-surface [data-message-author-role],
html.codex-customizer main.main-surface [class*="max-w-"][class*="break-words"],
html.codex-customizer main.main-surface [class*="max-w-"][class*="rounded"] {
  background: rgba(255, 255, 255, 0.4) !important;
  background-image: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.48) 0%,
    rgba(255, 246, 248, 0.34) 100%
  ) !important;
  border: var(--jj-glass-border) !important;
  border-radius: 16px !important;
  box-shadow: var(--jj-glass-shadow) !important;
  backdrop-filter: var(--jj-blur) !important;
  -webkit-backdrop-filter: var(--jj-blur) !important;
}

/* Outer diff / file-change summary shell (「已编辑 N 个文件」) — true glass */
html.codex-customizer main.main-surface [class*="border"][class*="rounded"][class*="bg-"],
html.codex-customizer main.main-surface [class*="ring-"][class*="rounded"],
html.codex-customizer main.main-surface details,
html.codex-customizer main.main-surface details > summary,
html.codex-customizer main.main-surface [class*="file"][class*="rounded"],
html.codex-customizer main.main-surface [class*="diff"][class*="rounded"],
html.codex-customizer main.main-surface [class*="resource"][class*="rounded"] {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.16) !important;
  background-color: rgba(255, 255, 255, 0.16) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  border-radius: 16px !important;
  box-shadow:
    0 12px 40px rgba(120, 60, 80, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
  backdrop-filter: blur(44px) saturate(1.55) !important;
  -webkit-backdrop-filter: blur(44px) saturate(1.55) !important;
  color: var(--jj-ink) !important;
}

/*
 * Nested file path rows — very light frost so parent blur + wallpaper show through.
 * Not solid white pills.
 */
html.codex-customizer main.main-surface details [class*="rounded"],
html.codex-customizer main.main-surface details li,
html.codex-customizer main.main-surface details a,
html.codex-customizer main.main-surface details button:not([class*="rounded-full"]),
html.codex-customizer main.main-surface [class*="resource"] [class*="rounded"],
html.codex-customizer main.main-surface [class*="diff"] [class*="rounded"],
html.codex-customizer main.main-surface [class*="file-"] [class*="rounded"],
html.codex-customizer main.main-surface [class*="changed"] [class*="rounded"],
html.codex-customizer main.main-surface [class*="max-w-"] [class*="rounded"][class*="border"],
html.codex-customizer main.main-surface [class*="max-w-"] [class*="rounded"][class*="bg-"] {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.1) !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.32) !important;
  box-shadow: none !important;
  backdrop-filter: blur(20px) saturate(1.3) !important;
  -webkit-backdrop-filter: blur(20px) saturate(1.3) !important;
  border-radius: 12px !important;
}

/* Nested chrome inside message cards stays flat (no double frost slabs) */
html.codex-customizer main.main-surface article[class*="bg-"] > *:not(pre):not(code):not([class*="code"]):not([class*="rounded"]),
html.codex-customizer main.main-surface [class*="bg-token-message"] > *:not(pre):not(code):not([class*="code"]):not([class*="rounded"]),
html.codex-customizer main.main-surface details > *:not(summary):not(pre):not(code):not([class*="rounded"]) {
  background: transparent !important;
  background-image: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
}

html.codex-customizer code,
html.codex-customizer pre,
html.codex-customizer [class*="code-block"] {
  background: rgba(255, 238, 242, 0.48) !important;
  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  color: var(--jj-ink) !important;
  border-radius: 12px !important;
  backdrop-filter: var(--jj-blur-sm) !important;
  -webkit-backdrop-filter: var(--jj-blur-sm) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
}

/* Keep send / primary accent buttons solid (not frosted) */
html.codex-customizer button[aria-label*="发送"],
html.codex-customizer button[aria-label*="Send"] {
  background: linear-gradient(145deg, #F2B0B8, #E8929C) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border: none !important;
  color: #fff !important;
  box-shadow: 0 3px 12px rgba(232, 146, 156, 0.38) !important;
}

/* ---------- Right tools rail (structure from Codex 2007, pink chrome) ----------
 * Cap outer rail; never force width so col-resize still works.
 * Never width:100% all absolute children (blows out separator / w-px sash).
 */
html.codex-customizer main.main-surface aside.ml-auto,
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"],
html.codex-customizer main.main-surface aside[class*="z-[41]"],
html.codex-customizer main.main-surface aside.shrink-0:not(.app-shell-left-panel) {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.12) !important;
  background-color: rgba(255, 255, 255, 0.12) !important;
  background-image: none !important;
  border-left: 1px solid rgba(255, 255, 255, 0.4) !important;
  border-radius: 0 !important;
  z-index: 30 !important;
  box-shadow: -4px 0 28px rgba(120, 60, 80, 0.08) !important;
  overflow: visible !important;
  flex: 0 0 auto !important;
  max-width: min(360px, 36vw) !important;
  min-width: 240px !important;
  backdrop-filter: blur(48px) saturate(1.55) !important;
  -webkit-backdrop-filter: blur(48px) saturate(1.55) !important;
}

/* Content shell only (absolute inset-0) — NOT separator / sash */
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

/* Sliding content layer (JS may size ~727px) — exclude sash + edge line */
html.codex-customizer main.main-surface aside.ml-auto [class*="absolute"][class*="top-0"][class*="bottom-0"][class*="left-0"]:not([role="separator"]):not([class*="cursor-col-resize"]):not([class*="w-px"]):not([class*="sidebar-resize"]) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  right: 0 !important;
  left: 0 !important;
}

/* Resize sash: thin hit strip at LEFT edge of rail */
html.codex-customizer main.main-surface aside.ml-auto > [role="separator"],
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] > [role="separator"],
html.codex-customizer main.main-surface aside.ml-auto > [class*="cursor-col-resize"],
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] > [class*="cursor-col-resize"] {
  width: 1rem !important;
  min-width: 1rem !important;
  max-width: 1rem !important;
  left: 0 !important;
  right: auto !important;
  top: 0 !important;
  bottom: 0 !important;
  transform: translateX(-0.5rem) !important;
  z-index: 40 !important;
  box-sizing: border-box !important;
  pointer-events: auto !important;
  cursor: col-resize !important;
  background: transparent !important;
}

/* Decorative 1px left edge — stay 1px */
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

html.codex-customizer main.main-surface aside .sidebar-resize-handle-line,
html.codex-customizer main.main-surface aside [class*="sidebar-resize-handle-line"] {
  width: 2px !important;
  min-width: 2px !important;
  max-width: 2px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  background: rgba(232, 146, 156, 0.35) !important;
}

/* Tool rows — light frost pills on glass rail (环境信息 / 来源) */
html.codex-customizer main.main-surface aside.ml-auto button,
html.codex-customizer main.main-surface aside.ml-auto a,
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] button,
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] a {
  isolation: auto !important;
  border-radius: 14px !important;
  color: var(--jj-ink) !important;
  -webkit-text-fill-color: var(--jj-ink) !important;
  background: rgba(255, 255, 255, 0.12) !important;
  background-color: rgba(255, 255, 255, 0.12) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.35) !important;
  box-shadow: none !important;
  backdrop-filter: blur(22px) saturate(1.35) !important;
  -webkit-backdrop-filter: blur(22px) saturate(1.35) !important;
}

html.codex-customizer main.main-surface aside.ml-auto ul[class*="max-w"] button,
html.codex-customizer main.main-surface aside.ml-auto li button,
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] ul[class*="max-w"] button,
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] li button,
html.codex-customizer main.main-surface aside.ml-auto [class*="rounded"] button,
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] [class*="rounded"] button,
html.codex-customizer main.main-surface aside.ml-auto [class*="rounded"][class*="border"],
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] [class*="rounded"][class*="border"],
html.codex-customizer main.main-surface aside.ml-auto [class*="rounded-full"],
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] [class*="rounded-full"] {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.12) !important;
  background-color: rgba(255, 255, 255, 0.12) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.35) !important;
  box-shadow: none !important;
  backdrop-filter: blur(22px) saturate(1.35) !important;
  -webkit-backdrop-filter: blur(22px) saturate(1.35) !important;
  color: var(--jj-ink) !important;
  -webkit-text-fill-color: var(--jj-ink) !important;
  min-height: 40px !important;
  width: 100% !important;
}

html.codex-customizer main.main-surface aside.ml-auto ul[class*="max-w"] button:hover,
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] ul[class*="max-w"] button:hover,
html.codex-customizer main.main-surface aside.ml-auto button:hover,
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] button:hover {
  border-color: rgba(255, 255, 255, 0.55) !important;
  background: rgba(255, 255, 255, 0.22) !important;
  background-color: rgba(255, 255, 255, 0.22) !important;
  background-image: none !important;
}

/* Right rail section cards (环境信息 / 来源 shells) */
html.codex-customizer main.main-surface aside.ml-auto [class*="rounded-2xl"],
html.codex-customizer main.main-surface aside.ml-auto [class*="rounded-xl"],
html.codex-customizer main.main-surface aside.ml-auto [class*="rounded-3xl"],
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] [class*="rounded-2xl"],
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] [class*="rounded-xl"],
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] [class*="rounded-3xl"] {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.12) !important;
  background-color: rgba(255, 255, 255, 0.12) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow:
    0 10px 32px rgba(120, 60, 80, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(40px) saturate(1.5) !important;
  -webkit-backdrop-filter: blur(40px) saturate(1.5) !important;
}

html.codex-customizer main.main-surface aside.ml-auto svg,
html.codex-customizer main.main-surface aside[data-app-shell-focus-area="right-panel"] svg {
  color: var(--jj-rose) !important;
  -webkit-text-fill-color: var(--jj-rose) !important;
}

html.codex-customizer input,
html.codex-customizer textarea,
html.codex-customizer select {
  background: rgba(255, 255, 255, 0.42) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  color: var(--jj-ink) !important;
  border-radius: 12px !important;
  backdrop-filter: var(--jj-blur-sm) !important;
  -webkit-backdrop-filter: var(--jj-blur-sm) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
}

html.codex-customizer input:focus,
html.codex-customizer textarea:focus {
  border-color: rgba(232, 146, 156, 0.45) !important;
  box-shadow:
    0 0 0 3px rgba(232, 146, 156, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.65) !important;
  background: rgba(255, 255, 255, 0.55) !important;
}

html.codex-customizer [role="switch"][data-state="checked"],
html.codex-customizer [role="switch"][aria-checked="true"] {
  background: linear-gradient(90deg, #F2B0B8, #E8929C) !important;
}

html.codex-customizer a { color: var(--jj-rose-deep) !important; }
html.codex-customizer ::selection {
  background: rgba(232, 146, 156, 0.26) !important;
  color: var(--jj-ink) !important;
}

html.codex-customizer ::-webkit-scrollbar { width: 7px !important; height: 7px !important; }
html.codex-customizer ::-webkit-scrollbar-thumb {
  background: rgba(232, 146, 156, 0.35) !important;
  border-radius: 999px !important;
}

/* ============================================================
   Decor — brand / name / polaroid / sparkles ONLY (NO roses)
   ============================================================ */
#cc-jj-decor {
  position: fixed !important;
  pointer-events: none !important;
  z-index: 25 !important;
  overflow: visible !important;
  box-sizing: border-box !important;
}

/*
 * Decor brand sits under caption only on home; hide when thread chrome is dense
 * so it never fights the real header title color/layout.
 */
#cc-jj-decor .cc-jj-brand {
  position: absolute !important;
  left: 28px !important;
  top: 52px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 1px !important;
  max-width: min(360px, 42%) !important;
  z-index: 3 !important;
  pointer-events: none !important;
}

/* Hide floating brand when a real thread title is in the caption (not home) */
html.codex-customizer:has(header.app-header-tint [class*="truncate"]:not(:empty)) #cc-jj-decor .cc-jj-brand {
  opacity: 0.0 !important;
}

#cc-jj-decor .cc-jj-brand b {
  font-size: 13px !important;
  font-weight: 700 !important;
  color: var(--jj-rose-deep) !important;
  letter-spacing: 0.02em !important;
  line-height: 1.35 !important;
  text-shadow: 0 1px 0 rgba(255,255,255,0.85) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

#cc-jj-decor .cc-jj-brand b::before {
  content: "✦ " !important;
  color: var(--jj-rose) !important;
}

#cc-jj-decor .cc-jj-brand small {
  font-size: 11px !important;
  font-style: italic !important;
  font-weight: 500 !important;
  color: rgba(122, 106, 111, 0.7) !important;
  padding-left: 16px !important;
  white-space: nowrap !important;
}

#cc-jj-decor .cc-jj-name {
  position: absolute !important;
  left: 36px !important;
  top: 94px !important;
  font-family: "Snell Roundhand", "Segoe Script", "Brush Script MT", "Apple Chancery", cursive !important;
  font-size: clamp(26px, 3.2vw, 40px) !important;
  font-style: italic !important;
  font-weight: 400 !important;
  letter-spacing: 0.03em !important;
  color: rgba(212, 106, 120, 0.36) !important;
  text-shadow: 0 1px 0 rgba(255,255,255,0.55) !important;
  transform: rotate(-4deg) !important;
  white-space: nowrap !important;
  z-index: 2 !important;
  line-height: 1 !important;
}

/* Explicitly hide any leftover rose nodes */
#cc-jj-decor .cc-jj-roses-left,
#cc-jj-decor .cc-jj-roses-right {
  display: none !important;
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
  background: none !important;
}

#cc-jj-decor .cc-jj-sparkles {
  position: absolute !important;
  inset: 0 !important;
  background-image:
    var(--jj-sparkle), var(--jj-sparkle), var(--jj-sparkle), var(--jj-sparkle) !important;
  background-size: 11px 11px, 13px 13px, 10px 10px, 12px 12px !important;
  background-position: 18% 28%, 72% 16%, 42% 20%, 88% 38% !important;
  background-repeat: no-repeat !important;
  opacity: 0.4 !important;
  z-index: 1 !important;
}

/* Polaroid: sit in content gutter, not over the tools rail */
#cc-jj-decor .cc-jj-polaroid {
  position: absolute !important;
  right: max(18px, 12px) !important;
  bottom: 18px !important;
  width: 104px !important;
  height: 132px !important;
  box-sizing: border-box !important;
  padding: 7px 7px 28px !important;
  background-color: #FFFEFE !important;
  background-image:
    linear-gradient(#FFFEFE, #FFFEFE),
    var(--jj-polaroid) !important;
  background-size: 100% 26px, 100% auto !important;
  background-position: bottom center, center 6% !important;
  background-repeat: no-repeat !important;
  border: 1px solid rgba(220, 140, 150, 0.16) !important;
  border-radius: 2px !important;
  box-shadow: 0 10px 26px rgba(60, 30, 40, 0.16), 0 2px 4px rgba(60, 30, 40, 0.06) !important;
  transform: rotate(4deg) !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: center !important;
  z-index: 4 !important;
}

#cc-jj-decor .cc-jj-polaroid span {
  display: block !important;
  width: 100% !important;
  text-align: center !important;
  font-size: 8.5px !important;
  font-weight: 600 !important;
  line-height: 1.3 !important;
  color: #8A6E74 !important;
  letter-spacing: 0.01em !important;
}

/* Hide polaroid when tools rail is open so it never covers tool buttons */
html.codex-customizer:has(aside[data-app-shell-focus-area="right-panel"]) #cc-jj-decor .cc-jj-polaroid {
  opacity: 0 !important;
  pointer-events: none !important;
  transform: scale(0.9) !important;
}

#cc-jj-decor.cc-jj-narrow .cc-jj-name { opacity: 0 !important; }
#cc-jj-decor.cc-jj-narrow .cc-jj-polaroid {
  width: 88px !important;
  height: 112px !important;
  right: 10px !important;
  bottom: 12px !important;
}

html.codex-customizer [class*="project-selector"] button,
html.codex-customizer .group\\/project-selector button {
  background: rgba(255, 255, 255, 0.4) !important;
  border: var(--jj-glass-border) !important;
  border-radius: 999px !important;
  color: var(--jj-ink) !important;
  -webkit-text-fill-color: var(--jj-ink) !important;
  backdrop-filter: var(--jj-blur-sm) !important;
  -webkit-backdrop-filter: var(--jj-blur-sm) !important;
  box-shadow:
    0 4px 14px rgba(220, 120, 140, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7) !important;
}

/* Secondary action chips inside cards (撤销 / 审核 / Hide …) */
html.codex-customizer main.main-surface button[class*="rounded-full"],
html.codex-customizer main.main-surface button[class*="rounded-lg"],
html.codex-customizer main.main-surface button[class*="rounded-md"],
html.codex-customizer main.main-surface [role="button"][class*="rounded"] {
  backdrop-filter: var(--jj-blur-sm) !important;
  -webkit-backdrop-filter: var(--jj-blur-sm) !important;
}

/* Popovers / tooltips / toasts — glass */
html.codex-customizer [data-state="open"][class*="rounded"],
html.codex-customizer [class*="tooltip"],
html.codex-customizer [class*="Popover"],
html.codex-customizer [class*="toast"],
html.codex-customizer [class*="Toast"] {
  background: var(--jj-glass-mid) !important;
  border: var(--jj-glass-border) !important;
  box-shadow: var(--jj-glass-shadow) !important;
  backdrop-filter: var(--jj-blur) !important;
  -webkit-backdrop-filter: var(--jj-blur) !important;
  color: var(--jj-ink) !important;
}

html.codex-customizer button[aria-label*="完全访问"]::after,
html.codex-customizer button[aria-label*="Full access"]::after {
  content: "" !important;
  display: inline-block !important;
  width: 10px !important;
  height: 9px !important;
  margin-left: 4px !important;
  background: var(--jj-heart) center / contain no-repeat !important;
  vertical-align: middle !important;
  opacity: 0.8 !important;
}

/* ============================================================
   TRUE FROST LAYERS (Electron-safe Gaussian blur)
   CDP injects .cc-jj-frost + children:
     .cc-jj-frost-layer  → blurred wallpaper clone (filter:blur)
     .cc-jj-frost-tint   → translucent glass veil
   This does NOT rely on backdrop-filter (often killed by Electron / base CSS).
   ============================================================ */
html.codex-customizer .cc-jj-frost,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-frost {
  position: relative !important;
  overflow: hidden !important;
  isolation: isolate !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.48) !important;
  box-shadow:
    0 14px 40px rgba(100, 50, 70, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
  /* keep backdrop-filter as bonus when browser allows */
  backdrop-filter: blur(40px) saturate(1.5) !important;
  -webkit-backdrop-filter: blur(40px) saturate(1.5) !important;
}

/* Blurred wallpaper slice — real Gaussian blur via filter */
html.codex-customizer .cc-jj-frost-layer,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-frost-layer {
  content: none !important;
  display: block !important;
  position: absolute !important;
  /* expand so blur edges never clip hard */
  inset: -64px !important;
  z-index: 0 !important;
  pointer-events: none !important;
  background-color: var(--jj-edge) !important;
  background-image: var(--jj-art) !important;
  background-size: cover !important;
  background-position: center 30% !important;
  background-repeat: no-repeat !important;
  /* fixed aligns with body/main wallpaper → no banding seams */
  background-attachment: fixed !important;
  filter: blur(40px) saturate(1.55) brightness(1.04) !important;
  -webkit-filter: blur(40px) saturate(1.55) brightness(1.04) !important;
  /* NO transform — keeps background-attachment:fixed correct */
  transform: none !important;
  opacity: 1 !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Glass veil over blurred art */
html.codex-customizer .cc-jj-frost-tint,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-frost-tint {
  content: none !important;
  display: block !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: 0 !important;
  pointer-events: none !important;
  background: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.28) 0%,
    rgba(255, 245, 248, 0.18) 100%
  ) !important;
  background-image: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.28) 0%,
    rgba(255, 245, 248, 0.18) 100%
  ) !important;
  border: none !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
  filter: none !important;
  -webkit-filter: none !important;
  transform: none !important;
  opacity: 1 !important;
  border-radius: inherit !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Content above frost layers */
html.codex-customizer .cc-jj-frost > *:not(.cc-jj-frost-layer):not(.cc-jj-frost-tint),
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-frost > *:not(.cc-jj-frost-layer):not(.cc-jj-frost-tint) {
  position: relative !important;
  z-index: 1 !important;
}

/* Nested rows inside frost cards — light translucent, no second heavy slab */
html.codex-customizer .cc-jj-frost-row,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-frost-row {
  background: rgba(255, 255, 255, 0.14) !important;
  background-color: rgba(255, 255, 255, 0.14) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.35) !important;
  box-shadow: none !important;
  backdrop-filter: blur(16px) saturate(1.25) !important;
  -webkit-backdrop-filter: blur(16px) saturate(1.25) !important;
}

/* Compact frost for right-rail tool rows */
html.codex-customizer .cc-jj-frost-sm .cc-jj-frost-layer {
  filter: blur(28px) saturate(1.45) brightness(1.03) !important;
  -webkit-filter: blur(28px) saturate(1.45) brightness(1.03) !important;
  inset: -40px !important;
}
html.codex-customizer .cc-jj-frost-sm .cc-jj-frost-tint {
  background: rgba(255, 255, 255, 0.2) !important;
  background-image: none !important;
}

/* Frost layers must never be wiped by "composer div → transparent" rules */

/* ============================================================
   FINAL — shell chrome + global glass polish
   ============================================================ */
/* Sidebar: lighter uniform glass so blur is visible */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .app-shell-left-panel {
  background: rgba(255, 248, 250, 0.38) !important;
  background-color: rgba(255, 248, 250, 0.38) !important;
  background-image: none !important;
  backdrop-filter: blur(44px) saturate(1.45) !important;
  -webkit-backdrop-filter: blur(44px) saturate(1.45) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel::before,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel::after,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .app-shell-left-panel::before,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .app-shell-left-panel::after {
  content: none !important;
  display: none !important;
}

/* ============================================================
   TRIPLE FIX — true frosted glass for the 3 problem surfaces
   (composer+full access / file-edit card / right env panel)
   Low white alpha + strong blur; no isolation.
   ============================================================ */

/* (1) Composer shell + full-access banner */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] header.app-header-tint,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .app-header-tint {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.18) !important;
  background-color: rgba(255, 255, 255, 0.18) !important;
  background-image: none !important;
  backdrop-filter: blur(40px) saturate(1.5) !important;
  -webkit-backdrop-filter: blur(40px) saturate(1.5) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .composer-surface-chrome,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [data-codex-composer-root],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="composer"][class*="surface"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="composer-parent"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] form[class*="composer"] {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.16) !important;
  background-color: rgba(255, 255, 255, 0.16) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(56px) saturate(1.65) !important;
  -webkit-backdrop-filter: blur(56px) saturate(1.65) !important;
  box-shadow:
    0 16px 48px rgba(120, 60, 80, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="validation"][class*="rounded-t"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="-mb-8"][class*="rounded-t"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface [class*="rounded-t-3xl"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="bg-token-input-validation"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="validation-error"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="validation-warning"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="validation-info"] {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.14) !important;
  background-color: rgba(255, 255, 255, 0.14) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(48px) saturate(1.55) !important;
  -webkit-backdrop-filter: blur(48px) saturate(1.55) !important;
  box-shadow:
    0 8px 28px rgba(120, 60, 80, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
}

/* Composer / banner chips keep light glass */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .composer-surface-chrome button,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [data-codex-composer-root] button,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="composer-parent"] button,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="validation"] button {
  background: rgba(255, 255, 255, 0.22) !important;
  background-color: rgba(255, 255, 255, 0.22) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(18px) saturate(1.3) !important;
  -webkit-backdrop-filter: blur(18px) saturate(1.3) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
}

/* (2) File-edit summary card + path rows */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface details,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface details > summary,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface [class*="border"][class*="rounded"][class*="bg-"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface [class*="resource"][class*="rounded"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface [class*="diff"][class*="rounded"] {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.16) !important;
  background-color: rgba(255, 255, 255, 0.16) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(44px) saturate(1.55) !important;
  -webkit-backdrop-filter: blur(44px) saturate(1.55) !important;
  box-shadow:
    0 12px 40px rgba(120, 60, 80, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface details [class*="rounded"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface details button,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface details a,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface details li,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface [class*="resource"] [class*="rounded"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface [class*="diff"] [class*="rounded"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface [class*="max-w-"] [class*="rounded"][class*="border"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface [class*="max-w-"] [class*="rounded"][class*="bg-"] {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.1) !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.32) !important;
  box-shadow: none !important;
  backdrop-filter: blur(20px) saturate(1.3) !important;
  -webkit-backdrop-filter: blur(20px) saturate(1.3) !important;
}

/* (3) Right env panel shell + rows */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside.ml-auto,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside[data-app-shell-focus-area="right-panel"] {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.12) !important;
  background-color: rgba(255, 255, 255, 0.12) !important;
  background-image: none !important;
  backdrop-filter: blur(48px) saturate(1.55) !important;
  -webkit-backdrop-filter: blur(48px) saturate(1.55) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside.ml-auto [class*="rounded-2xl"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside.ml-auto [class*="rounded-xl"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside.ml-auto [class*="rounded-3xl"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside[data-app-shell-focus-area="right-panel"] [class*="rounded-2xl"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside[data-app-shell-focus-area="right-panel"] [class*="rounded-xl"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside[data-app-shell-focus-area="right-panel"] [class*="rounded-3xl"] {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.12) !important;
  background-color: rgba(255, 255, 255, 0.12) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(40px) saturate(1.5) !important;
  -webkit-backdrop-filter: blur(40px) saturate(1.5) !important;
  box-shadow:
    0 10px 32px rgba(120, 60, 80, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside.ml-auto button,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside.ml-auto a,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside[data-app-shell-focus-area="right-panel"] button,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside[data-app-shell-focus-area="right-panel"] a,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside.ml-auto [class*="rounded"][class*="border"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside[data-app-shell-focus-area="right-panel"] [class*="rounded"][class*="border"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside.ml-auto [class*="rounded-full"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] main.main-surface aside[data-app-shell-focus-area="right-panel"] [class*="rounded-full"] {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.12) !important;
  background-color: rgba(255, 255, 255, 0.12) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.35) !important;
  box-shadow: none !important;
  backdrop-filter: blur(22px) saturate(1.35) !important;
  -webkit-backdrop-filter: blur(22px) saturate(1.35) !important;
}

/* Generic elevated panels (dialogs etc.) — match true glass language */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .bg-token-bg-fog,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="bg-token-bg-fog"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="bg-token-dropdown-background"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [role="dialog"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [role="menu"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [data-radix-menu-content] {
  isolation: auto !important;
  background: rgba(255, 255, 255, 0.16) !important;
  background-color: rgba(255, 255, 255, 0.16) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(40px) saturate(1.5) !important;
  -webkit-backdrop-filter: blur(40px) saturate(1.5) !important;
}

/* Send button stays solid rose (not frosted) */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] button[aria-label*="发送"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] button[aria-label*="Send"] {
  background: linear-gradient(145deg, #F2B0B8, #E8929C) !important;
  border: none !important;
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: 0 3px 12px rgba(232, 146, 156, 0.38) !important;
}

/*
 * FINAL sidebar: nuclear flat for all rows, then re-open only CDP-marked chips.
 * Never match rounded-full globally — Codex puts that class on every nav row.
 */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel button,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel a,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel [role="button"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel button[class*="rounded-full"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel button[class*="rounded"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel [class*="rounded-full"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel [class*="rounded-lg"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel [class*="rounded-md"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel [class*="rounded-xl"] {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  border: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel button:hover:not([aria-current="page"]):not(.cc-jj-chip):not(.cc-jj-expand),
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel a:hover:not([aria-current="page"]):not(.cc-jj-chip) {
  background-color: rgba(232, 146, 156, 0.1) !important;
  background-image: none !important;
  border: none !important;
  box-shadow: none !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel [aria-current="page"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel [aria-selected="true"] {
  background: rgba(255, 255, 255, 0.28) !important;
  background-color: rgba(255, 255, 255, 0.28) !important;
  background-image: none !important;
  box-shadow: inset 2px 0 0 var(--jj-rose-deep) !important;
  border: none !important;
  border-radius: 10px !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* CDP-marked chips only */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel .cc-jj-chip,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] aside.app-shell-left-panel .cc-jj-expand {
  background: rgba(255, 255, 255, 0.42) !important;
  background-color: rgba(255, 255, 255, 0.42) !important;
  border: 1px solid rgba(255, 255, 255, 0.55) !important;
  border-radius: 999px !important;
  box-shadow:
    0 4px 14px rgba(220, 120, 140, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(16px) saturate(1.25) !important;
  -webkit-backdrop-filter: blur(16px) saturate(1.25) !important;
}

/* Composer chips — light glass (must stay lower alpha than shell) */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .composer-surface-chrome button,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [data-codex-composer-root] button,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="composer-parent"] button,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] [class*="validation"] button {
  background: rgba(255, 255, 255, 0.22) !important;
  background-color: rgba(255, 255, 255, 0.22) !important;
  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(18px) saturate(1.3) !important;
  -webkit-backdrop-filter: blur(18px) saturate(1.3) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] button[aria-label*="发送"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] button[aria-label*="Send"] {
  background: linear-gradient(145deg, #F2B0B8, #E8929C) !important;
  border: none !important;
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: 0 3px 12px rgba(232, 146, 156, 0.38) !important;
}

/* Dynamic Codex components: one surface owner per component. */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-composer {
  display: flex !important;
  flex-direction: column !important;
  gap: 0 !important;
  min-width: 0 !important;
  height: auto !important;
  min-height: 0 !important;
  overflow: hidden !important;
  background: rgba(255, 250, 252, 0.3) !important;
  border: var(--jj-glass-border) !important;
  border-radius: 24px !important;
  box-shadow: var(--jj-glass-shadow) !important;
  backdrop-filter: var(--jj-blur-lg) !important;
  -webkit-backdrop-filter: var(--jj-blur-lg) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-composer .composer-surface-chrome,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-composer form[class*="composer"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-composer [class*="composer-parent"] {
  position: relative !important;
  width: 100% !important;
  min-width: 0 !important;
  height: auto !important;
  min-height: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-access-banner {
  position: relative !important;
  inset: auto !important;
  transform: none !important;
  display: flex !important;
  width: 100% !important;
  max-width: none !important;
  height: auto !important;
  min-height: 56px !important;
  max-height: none !important;
  margin: 0 !important;
  padding: 12px 16px !important;
  overflow: visible !important;
  box-sizing: border-box !important;
  border: 0 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.42) !important;
  border-radius: 0 !important;
  background: rgba(255, 248, 250, 0.18) !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-access-banner > .flex,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-access-banner [class*="items-center"] {
  min-width: 0 !important;
  max-width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  align-items: center !important;
  gap: 10px !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-access-banner .min-w-0.flex-1 {
  min-width: 0 !important;
  height: auto !important;
  overflow: visible !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-access-banner button {
  flex: 0 0 auto !important;
  width: auto !important;
  max-width: 100% !important;
  min-height: 30px !important;
  margin-left: auto !important;
  white-space: nowrap !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary {
  isolation: auto !important;
  min-width: 0 !important;
  overflow: hidden !important;
  background: rgba(255, 250, 252, 0.3) !important;
  border: var(--jj-glass-border) !important;
  border-radius: 16px !important;
  box-shadow: var(--jj-glass-shadow) !important;
  backdrop-filter: var(--jj-blur) !important;
  -webkit-backdrop-filter: var(--jj-blur) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary > * {
  min-width: 0 !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary [class*="rounded"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary [class*="bg-token"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary [class*="elevation"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary .cc-jj-change-row {
  background: transparent !important;
  background-image: none !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary .cc-jj-change-row {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  width: 100% !important;
  min-width: 0 !important;
  min-height: 38px !important;
  padding: 7px 14px !important;
  border-top: 1px solid rgba(255, 255, 255, 0.36) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-row > :first-child {
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-row > :last-child {
  flex: 0 0 auto !important;
  margin-left: auto !important;
  white-space: nowrap !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-right-tools {
  height: 100% !important;
  min-height: 0 !important;
  max-width: min(360px, 36vw) !important;
  min-width: 240px !important;
  overflow: hidden !important;
  background: rgba(255, 255, 255, 0.12) !important;
  border-left: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: -4px 0 28px rgba(120, 60, 80, 0.08) !important;
  backdrop-filter: blur(48px) saturate(1.55) !important;
  -webkit-backdrop-filter: blur(48px) saturate(1.55) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-right-tools > [class*="absolute"][class*="inset-0"] {
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  overflow: auto !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-right-tools [class*="rounded-2xl"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-right-tools [class*="rounded-xl"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-right-tools [class*="rounded-3xl"] {
  background: transparent !important;
  background-image: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-right-tools button:not(.cc-jj-right-tool-row),
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-right-tools a:not(.cc-jj-right-tool-row),
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-right-tools [role="button"]:not(.cc-jj-right-tool-row) {
  width: auto !important;
  min-width: 0 !important;
  min-height: 0 !important;
  background: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-right-tool-row {
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
  min-width: 0 !important;
  min-height: 44px !important;
  height: auto !important;
  padding: 8px 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.38) !important;
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.16) !important;
  box-shadow: none !important;
  backdrop-filter: blur(18px) saturate(1.3) !important;
  -webkit-backdrop-filter: blur(18px) saturate(1.3) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-keycap,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-right-tools kbd {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex: 0 0 auto !important;
  width: auto !important;
  min-width: 0 !important;
  height: 22px !important;
  min-height: 22px !important;
  padding: 0 6px !important;
  margin-left: auto !important;
  line-height: 1 !important;
  font-size: 12px !important;
  white-space: nowrap !important;
  border: 0 !important;
  border-radius: 7px !important;
  background: rgba(122, 106, 111, 0.1) !important;
  box-shadow: none !important;
}

@media (max-width: 900px) {
  html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-access-banner > .flex,
  html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-access-banner [class*="items-center"] {
    flex-wrap: wrap !important;
  }

  html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-access-banner button {
    margin-left: auto !important;
    max-width: calc(100% - 24px) !important;
  }

  html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-right-tools {
    width: min(320px, 42vw) !important;
    max-width: min(320px, 42vw) !important;
    min-width: min(220px, 42vw) !important;
  }
}

/* Final component normalization: quiet interiors, one enclosing glass surface. */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary {
  overflow: hidden !important;
  padding: 10px !important;
  background: rgba(255, 250, 252, 0.32) !important;
  border: 1px solid rgba(255, 255, 255, 0.58) !important;
  border-radius: 18px !important;
  box-shadow: 0 12px 36px rgba(140, 70, 90, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.72) !important;
  backdrop-filter: blur(36px) saturate(1.4) !important;
  -webkit-backdrop-filter: blur(36px) saturate(1.4) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary [class*="rounded"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary [class*="bg-token"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary [class*="border"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary [class*="elevation"] {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  box-sizing: border-box !important;
  background: transparent !important;
  background-image: none !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary button,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary a,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary [role="button"] {
  position: relative !important;
  inset: auto !important;
  transform: none !important;
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  min-height: 34px !important;
  margin: 0 !important;
  padding: 6px 8px !important;
  box-sizing: border-box !important;
  background: transparent !important;
  border: 0 !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary .cc-jj-environment-row {
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
  height: 38px !important;
  min-height: 38px !important;
  max-height: 38px !important;
  margin: 0 !important;
  padding: 0 12px !important;
  gap: 10px !important;
  border: 0 !important;
  border-top: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 0 !important;
  background: rgba(255, 255, 255, 0.06) !important;
  box-sizing: border-box !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary .cc-jj-environment-row:first-of-type {
  border-top-color: transparent !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary button:hover,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary [role="button"]:hover {
  background: rgba(255, 255, 255, 0.18) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary {
  background: rgba(255, 250, 252, 0.24) !important;
  border-color: rgba(255, 255, 255, 0.52) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary .cc-jj-change-row,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary .cc-jj-change-row[class*="rounded"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary .cc-jj-change-row[class*="border"] {
  min-height: 36px !important;
  margin: 0 !important;
  padding: 7px 14px !important;
  background: transparent !important;
  border: 0 !important;
  border-top: 1px solid rgba(255, 255, 255, 0.28) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-composer {
  background: rgba(255, 250, 252, 0.24) !important;
  border-color: rgba(255, 255, 255, 0.58) !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-composer .composer-surface-chrome,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-composer .composer-surface-chrome > *,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-composer form,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-composer [contenteditable="true"],
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-composer .ProseMirror {
  background: transparent !important;
  background-image: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-access-banner {
  background: rgba(255, 255, 255, 0.08) !important;
  border-bottom-color: rgba(255, 255, 255, 0.32) !important;
}

/* No nested capsules: outer glass owns the silhouette; rows use dividers only. */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary :is(button, a, li, [role="button"], [class*="rounded"], [class*="border"], [class*="bg-token"]):not(.cc-jj-change-summary),
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary .cc-jj-change-row,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary :is(button, a, li, [role="button"], [class*="rounded"], [class*="border"], [class*="bg-token"]):not(.cc-jj-environment-summary),
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary .cc-jj-environment-row {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary .cc-jj-change-row,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary .cc-jj-environment-row {
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  border-top: 1px solid rgba(255, 255, 255, 0.28) !important;
  border-radius: 0 !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary .cc-jj-change-row:first-of-type,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary .cc-jj-environment-row:first-of-type {
  border-top-color: transparent !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary {
  padding: 8px 12px !important;
}

html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-environment-summary > *,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] .cc-jj-change-summary > * {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  box-sizing: border-box !important;
}

/* Header toolbar chips */
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] header.app-header-tint button,
html.codex-customizer[data-cc-preset="jujingyi-sunset-breeze"] header.app-header-tint [role="button"] {
  background: rgba(255, 255, 255, 0.22) !important;
  border: 1px solid rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(18px) saturate(1.3) !important;
  -webkit-backdrop-filter: blur(18px) saturate(1.3) !important;
}
`
}
