import CDP from 'chrome-remote-interface'
import type { ThemePreset } from '../shared/types'
import {
  buildThemeCss,
  buildTokenMap,
  ROOT_CLASS,
  STYLE_TAG_ID
} from './theme-css'

const MARKER = '__CODEX_CUSTOMIZER__'

function wrapCustomCss(css: string): string {
  const trimmed = css.trim()
  if (!trimmed) return ''
  if (trimmed.includes(`.${ROOT_CLASS}`) || trimmed.includes('html.codex-customizer')) {
    return trimmed
  }
  return trimmed
    .replace(/\bbody\b/g, `html.${ROOT_CLASS} body`)
    .replace(/#root/g, `html.${ROOT_CLASS} #root`)
    .replace(/\.monaco-workbench/g, `html.${ROOT_CLASS} .monaco-workbench`)
}

/**
 * Injection script: CSS text + important token map + SPA persistence.
 *
 * CDP findings:
 * - Native writes --color-text-foreground=#fff on <html> without !important
 * - Stylesheet !important + inline important both needed; native can rewrite style attr
 * - Markdown uses var(--text-primary); 10% accent tint looked pure white in screenshots
 */
function buildInjectionScript(preset: ThemePreset, globalCss = ''): string {
  const extra =
    (preset.customCss ? wrapCustomCss(preset.customCss) + '\n' : '') +
    (globalCss ? wrapCustomCss(globalCss) : '')

  const css = buildThemeCss(preset.tokens, extra)
  const cssJson = JSON.stringify(css)
  const metaJson = JSON.stringify({
    id: preset.id,
    injectedAt: new Date().toISOString()
  })
  const tokenMapJson = JSON.stringify(buildTokenMap(preset.tokens))
  // Keys native theme engine most often rewrites on documentElement
  const criticalKeys = [
    '--color-text',
    '--color-text-foreground',
    '--color-text-foreground-secondary',
    '--color-text-foreground-tertiary',
    '--color-text-primary',
    '--color-text-secondary',
    '--color-text-tertiary',
    '--color-text-accent',
    '--color-icon-primary',
    '--color-icon-secondary',
    '--color-icon-tertiary',
    '--color-icon-accent',
    '--text-primary',
    '--text-secondary',
    '--color-token-foreground',
    '--color-token-text-primary',
    '--color-token-text-secondary',
    '--color-token-text-tertiary',
    '--color-token-description-foreground',
    '--vscode-foreground',
    '--vscode-editor-foreground',
    '--cc-text-primary',
    '--cc-text-secondary',
    '--cc-accent'
  ]

  return `
(() => {
  try {
    const css = ${cssJson};
    const meta = ${metaJson};
    const tokenMap = ${tokenMapJson};
    const criticalKeys = ${JSON.stringify(criticalKeys)};
    const STYLE_ID = ${JSON.stringify(STYLE_TAG_ID)};
    const ROOT_CLASS = ${JSON.stringify(ROOT_CLASS)};
    let applying = false;

    const applyTokens = (el) => {
      if (!el || !el.style) return;
      for (const k of Object.keys(tokenMap)) {
        try { el.style.setProperty(k, tokenMap[k], 'important'); } catch (_) {}
      }
    };

    const applyCritical = (el) => {
      if (!el || !el.style) return;
      for (const k of criticalKeys) {
        if (tokenMap[k] == null) continue;
        try { el.style.setProperty(k, tokenMap[k], 'important'); } catch (_) {}
      }
    };

    const ensureStyleTag = () => {
      const root = document.documentElement;
      let style = document.getElementById(STYLE_ID);
      if (!style) {
        style = document.createElement('style');
        style.id = STYLE_ID;
        style.setAttribute('data-codex-customizer', 'true');
        (document.head || root).appendChild(style);
      } else {
        const parent = style.parentNode || document.head || root;
        if (parent.lastChild !== style) parent.appendChild(style);
      }
      if (style.textContent !== css) style.textContent = css;
      return style;
    };

    const apply = () => {
      if (applying) return window.${MARKER} || { ok: true, id: meta.id, skipped: true };
      applying = true;
      try {
        const root = document.documentElement;
        if (!root) return { ok: false, error: 'no documentElement' };
        root.classList.add(ROOT_CLASS);
        root.classList.add('electron-opaque');
        root.setAttribute('data-cc-preset', meta.id);
        applyTokens(root);
        if (document.body) applyTokens(document.body);
        ensureStyleTag();

        try {
          const icons = document.querySelectorAll(
            'svg.icon-xs, svg.icon-2xs, svg.icon-sm, svg[class*="icon-"], button svg, a svg, aside svg, header svg, nav svg, [data-settings-panel-slug] svg'
          );
          // Dark blue XP caption needs white glyphs; light skins need dark/accent glyphs
          const darkCaption =
            meta.id === 'codex-2007' ||
            document.documentElement.getAttribute('data-cc-preset') === 'codex-2007';

          icons.forEach((svg) => {
            if (!svg) return;
            if (svg.closest('header.app-header-tint, .app-header-tint')) {
              const capColor = darkCaption ? '#FFFFFF' : (tokenMap['--cc-accent'] || '#C45A6C');
              svg.style.setProperty('color', capColor, 'important');
              svg.querySelectorAll('path, circle, rect, line, polyline, polygon').forEach((el) => {
                const fill = el.getAttribute('fill');
                if (fill !== 'none') el.setAttribute('fill', 'currentColor');
              });
              svg.dataset.ccIcon = '1';
              return;
            }
            // Callouts A+: icons use theme accent (not danger/warning red-yellow)
            const inCallout = svg.closest(
              '[class*="validation-error"], [class*="bg-token-input-validation-error"], [class*="text-token-error"], [class*="validation-warning"], [class*="bg-token-input-validation-warning"], [class*="border-token-editor-warning"], [class*="validation-info"]'
            ) || (svg.parentElement && svg.parentElement.querySelector('[class*="validation-error-background"], [class*="validation-warning-background"], [class*="validation-info-background"]'))
              || (svg.closest('aside,section,div') && svg.closest('aside,section,div').querySelector(':scope > [class*="validation-warning-background"], :scope > [class*="validation-error-background"]'));
            if (inCallout) {
              svg.style.setProperty('color', 'var(--cc-accent)', 'important');
            } else if (
              svg.closest('[class*="charts-red"], [class*="text-token-charts-red"]')
            ) {
              svg.style.setProperty('color', 'var(--cc-danger)', 'important');
            } else {
              svg.style.setProperty('color', 'var(--cc-icon)', 'important');
            }
            const paintPaths = svg.dataset.ccIcon !== '1' || !!inCallout;
            if (svg.dataset.ccIcon !== '1') svg.dataset.ccIcon = '1';
            if (paintPaths) {
              svg.querySelectorAll('path, circle, rect, line, polyline, polygon').forEach((el) => {
                const fill = el.getAttribute('fill');
                const stroke = el.getAttribute('stroke');
                if (fill !== 'none' && (!fill || fill === 'currentColor' || /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(fill) || fill === 'white' || fill === 'black')) {
                  el.setAttribute('fill', 'currentColor');
                }
                if (stroke && stroke !== 'none') el.setAttribute('stroke', 'currentColor');
                if (inCallout) {
                  try { el.style.setProperty('fill', 'currentColor', 'important'); } catch (_) {}
                }
              });
            }
          });
        } catch (_) {}

        // Callouts scheme A: theme surface + semantic accent strip/icon (not solid red blocks).
        // Settings tip: empty absolute overlay; text/svg are SIBLINGS → paint parent.
        try {
          const danger = tokenMap['--cc-danger'] || '#F87171';
          const warning = tokenMap['--cc-warning'] || '#FBBF24';
          const info = tokenMap['--cc-accent-secondary'] || '#34D399';
          const accent = tokenMap['--cc-accent'] || '#4ADE80';
          const base = tokenMap['--cc-bg-base'] || '#0C1410';
          const elevated = tokenMap['--color-background-elevated-primary-opaque'] || tokenMap['--cc-bg-elevated'] || base;
          const primary = tokenMap['--cc-text-primary'] || '#ECFDF5';
          const secondary = tokenMap['--cc-text-secondary'] || primary;
          const border = tokenMap['--cc-border'] || 'rgba(255,255,255,0.12)';
          const errBg = tokenMap['--cc-callout-error-bg'] || ('color-mix(in srgb, ' + accent + ' 14%, ' + elevated + ')');
          const errFg = tokenMap['--cc-callout-error-fg'] || primary;
          const errFgSec = tokenMap['--cc-callout-error-fg-secondary'] || secondary;
          const errAccent = tokenMap['--cc-callout-error-accent'] || accent;
          const warnBg = tokenMap['--cc-callout-warning-bg'] || ('color-mix(in srgb, ' + accent + ' 12%, ' + elevated + ')');
          const warnFg = tokenMap['--cc-callout-warning-fg'] || primary;
          const warnFgSec = tokenMap['--cc-callout-warning-fg-secondary'] || secondary;
          const warnAccent = tokenMap['--cc-callout-warning-accent'] || accent;
          const elevation = tokenMap['--cc-callout-elevation'] || ('0 0 0 0.5px color-mix(in srgb, ' + accent + ' 28%, transparent)');

          const hardenSurface = (el, bgMix, _accentBar, attached) => {
            if (!el) return;
            // 落日海风: keep Gaussian frosted glass — never force solid / backdrop-filter:none
            const glassPreset = meta.id === 'jujingyi-sunset-breeze';
            if (bgMix && !glassPreset) el.style.setProperty('background-color', bgMix, 'important');
            el.style.setProperty('opacity', '1', 'important');
            if (!glassPreset) {
              el.style.setProperty('backdrop-filter', 'none', 'important');
              el.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
            }
            // No left accent bar — reads as broken UI (bright strip on rounded card).
            // Attached banners (Full access): no ring either (seams the composer).
            if (attached) {
              el.style.setProperty('border-color', 'transparent', 'important');
              el.style.setProperty('border-width', '0', 'important');
              el.style.setProperty('box-shadow', 'none', 'important');
              el.style.setProperty('border-bottom-left-radius', '0', 'important');
              el.style.setProperty('border-bottom-right-radius', '0', 'important');
            } else if (!glassPreset) {
              el.style.setProperty('border-color', border, 'important');
              el.style.setProperty('box-shadow', elevation, 'important');
            }
          };

          const paintContent = (root, fg, fgSecondary, iconAccent, btnThemed) => {
            if (!root) return;
            root.style.setProperty('color', fg, 'important');
            root.style.setProperty('-webkit-text-fill-color', fg, 'important');
            root.style.setProperty('opacity', '1', 'important');
            root.querySelectorAll('p,span,div,li,label,a,button,h1,h2,h3,h4,small,strong,em,b,i').forEach((el) => {
              const cls = String(el.className || '');
              if (/validation-(error|warning|info)-background|bg-token-input-validation/.test(cls) && /absolute|inset-0|-z-/.test(cls)) {
                return;
              }
              // Body / secondary lines
              const isBody =
                /leading-4|mt-0|text-pretty/.test(cls) ||
                (/\btext-xs\b/.test(cls) && !/font-semibold|font-bold/.test(cls));
              const isTitle = /font-semibold|font-bold/.test(cls);
              const color = isTitle ? fg : isBody ? fgSecondary : fg;
              el.style.setProperty('color', color, 'important');
              el.style.setProperty('-webkit-text-fill-color', color, 'important');
              el.style.setProperty('opacity', '1', 'important');
            });
            // Icons: theme accent (A+)
            root.querySelectorAll('svg').forEach((svg) => {
              const parentCls = String(svg.parentElement?.className || '') + ' ' + String(svg.className || '');
              if (/absolute|validation-.*-background/.test(parentCls)) return;
              svg.style.setProperty('color', iconAccent, 'important');
              svg.style.setProperty('-webkit-text-fill-color', iconAccent, 'important');
              svg.querySelectorAll('path, circle, rect').forEach((el) => {
                el.setAttribute('fill', 'currentColor');
                try { el.style.setProperty('fill', 'currentColor', 'important'); } catch (_) {}
              });
            });
            if (btnThemed) {
              root.querySelectorAll('button').forEach((btn) => {
                btn.style.setProperty('background-color', 'color-mix(in srgb, ' + primary + ' 8%, transparent)', 'important');
                btn.style.setProperty('border-color', border, 'important');
                btn.style.setProperty('color', secondary, 'important');
                btn.style.setProperty('-webkit-text-fill-color', secondary, 'important');
                btn.style.setProperty('opacity', '1', 'important');
              });
            }
          };

          const paintOverlayFamily = (overlaySel, fg, fgSec, bgMix, iconAccent, btnThemed) => {
            document.querySelectorAll(overlaySel).forEach((node) => {
              if (!node) return;
              const cls = String(node.className || '');
              const isOverlayOnly = /absolute|inset-0|-z-/.test(cls) || node.childElementCount === 0;
              // Full access: rounded-t + -mb-8 tucks under composer — treat as attached
              // class tokens are like "-mb-8" / "rounded-t-3xl" (must not draw full ring)
              const attached =
                /(?:^|\\s)-mb-\\d|(?:^|\\s)mb-\\d|rounded-t|rounded-t-\\d/.test(' ' + cls) ||
                (parseFloat(getComputedStyle(node).marginBottom) < 0);
              hardenSurface(node, bgMix, isOverlayOnly ? null : iconAccent, attached);
              if (isOverlayOnly && node.parentElement) {
                const parent = node.parentElement;
                const pCls = String(parent.className || '');
                const pAttached = /-mb-|rounded-t|mb-8/.test(pCls);
                hardenSurface(parent, null, iconAccent, pAttached);
                paintContent(parent, fg, fgSec, iconAccent, btnThemed);
              } else {
                paintContent(node, fg, fgSec, iconAccent, btnThemed);
              }
            });
          };

          paintOverlayFamily(
            '[class*="bg-token-input-validation-error-background"], [class*="validation-error-background"], [class*="bg-token-input-validation-error"]',
            errFg,
            errFgSec,
            errBg,
            errAccent,
            true
          );
          paintOverlayFamily(
            '[class*="bg-token-input-validation-warning-background"], [class*="validation-warning-background"]',
            warnFg,
            warnFgSec,
            warnBg,
            warnAccent,
            false
          );
          document.querySelectorAll('[class*="border-token-editor-warning-foreground"]').forEach((el) => {
            if (el.querySelector('[class*="validation-warning-background"]')) {
              hardenSurface(el, null, warnAccent);
              paintContent(el, warnFg, warnFgSec, warnAccent, false);
            }
          });
          paintOverlayFamily(
            '[class*="bg-token-input-validation-info-background"], [class*="validation-info-background"]',
            primary,
            secondary,
            'color-mix(in srgb, ' + accent + ' 12%, ' + elevated + ')',
            accent,
            false
          );
        } catch (_) {}

        try {
          document.querySelectorAll('[role="switch"][data-state="checked"] > span.relative, [role="switch"][aria-checked="true"] > span.relative').forEach((el) => {
            el.style.setProperty('background-color', 'var(--cc-accent)', 'important');
          });
        } catch (_) {}

        // Remint pure / near-white / cool-gray text (incl. color(srgb …) form)
        try {
          const skipRe = /git-decoration|charts-|error-foreground|token-error|svg|hljs-deletion|hljs-addition|bg-token-charts/i;
          const parse = (c) => {
            if (!c) return null;
            let m = String(c).match(/color\\(srgb\\s+([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)/i);
            if (m) return { r: +m[1] * 255, g: +m[2] * 255, b: +m[3] * 255, a: 1 };
            m = String(c).match(/rgba?\\(\\s*([\\d.]+)[,\\s]+([\\d.]+)[,\\s]+([\\d.]+)(?:[,\\s/]+([\\d.]+))?/i);
            if (!m) return null;
            return { r: +m[1], g: +m[2], b: +m[3], a: m[4] != null ? +m[4] : 1 };
          };
          const isNeutral = (c) => {
            if (!c) return false;
            const s = String(c).toLowerCase();
            if (s === 'white' || s === '#fff' || s === '#ffffff' || s === 'black' || s === '#000' || s === '#000000') return true;
            const p = parse(c);
            if (!p) return false;
            if (p.r > 248 && p.g > 248 && p.b > 248) return true;
            if (p.r < 20 && p.g < 20 && p.b < 20) return true;
            const max = Math.max(p.r, p.g, p.b);
            const min = Math.min(p.r, p.g, p.b);
            return max - min < 14 && max > 50;
          };
          const nodes = document.querySelectorAll(
            'p,span,div,li,label,a,button,h1,h2,h3,h4,td,th,code,small,strong,em,b,i'
          );
          nodes.forEach((el) => {
            if (!el || el.closest('svg')) return;
            // Never remint semantic callouts / danger / warning chips
            if (el.closest('[class*="validation-error"], [class*="validation-warning"], [class*="validation-info"], [class*="bg-token-input-validation"], [class*="text-token-error"], [class*="text-token-charts-red"], [class*="bg-token-charts-red"], [class*="border-token-editor-warning"]')) {
              return;
            }
            // Caption title color depends on theme chrome (dark XP vs light skins)
            if (el.closest('header.app-header-tint, .app-header-tint')) {
              // Buttons keep their own chip colors (styled by CSS)
              if (el.closest('button, [role="button"], [class*="border"]')) return;
              const darkCap =
                meta.id === 'codex-2007' ||
                document.documentElement.getAttribute('data-cc-preset') === 'codex-2007';
              if (darkCap) {
                el.style.setProperty('color', '#FFFFFF', 'important');
                el.style.setProperty('-webkit-text-fill-color', '#FFFFFF', 'important');
              } else {
                // Light frosted caption: solid dark title (not washed / not pure white)
                el.style.setProperty('color', '#2A2226', 'important');
                el.style.setProperty('-webkit-text-fill-color', '#2A2226', 'important');
              }
              el.dataset.ccText = '1';
              return;
            }
            const cls = String(el.className || '');
            if (skipRe.test(cls)) return;
            const prev = el.style.getPropertyValue('color');
            if (el.dataset.ccText === '1' && (prev === 'var(--cc-text-primary)' || prev === 'var(--cc-text-secondary)' || prev === '#FFFFFF' || prev === 'rgb(255, 255, 255)')) return;
            const cs = window.getComputedStyle(el);
            if (isNeutral(cs.color) || isNeutral(cs.webkitTextFillColor)) {
              const fs = parseFloat(cs.fontSize) || 14;
              const role = fs <= 12 ? 'var(--cc-text-secondary)' : 'var(--cc-text-primary)';
              el.style.setProperty('color', role, 'important');
              el.style.setProperty('-webkit-text-fill-color', role, 'important');
              el.dataset.ccText = '1';
            }
          });
        } catch (_) {}

        // Character-skin decor: pin to main.main-surface bounds (no viewport overlap chaos)
        try {
          const DECOR_ID = 'cc-jj-decor';
          const placeDecor = () => {
            let decor = document.getElementById(DECOR_ID);
            if (meta.id !== 'jujingyi-sunset-breeze') {
              if (decor) decor.remove();
              return;
            }
            if (!decor) {
              decor = document.createElement('div');
              decor.id = DECOR_ID;
              decor.setAttribute('aria-hidden', 'true');
              decor.innerHTML =
                '<div class="cc-jj-brand"><b>鞠婧祎专属定制皮肤 · 落日海风</b><small>Codex App 限定版 · Ju Jingyi</small></div>' +
                '<div class="cc-jj-name">Ju Jingyi</div>' +
                '<div class="cc-jj-sparkles"></div>' +
                '<div class="cc-jj-polaroid"><span>一直陪伴<br>是最温暖的应援 ♥</span></div>';
              document.body.appendChild(decor);
            } else {
              // Drop legacy rose nodes from older injections
              decor.querySelectorAll('.cc-jj-roses-left, .cc-jj-roses-right').forEach((n) => n.remove());
            }
            const main =
              document.querySelector('main.main-surface') ||
              document.querySelector('main');
            if (!main) return;
            const r = main.getBoundingClientRect();
            decor.style.left = Math.round(r.left) + 'px';
            decor.style.top = Math.round(r.top) + 'px';
            decor.style.width = Math.round(r.width) + 'px';
            decor.style.height = Math.round(r.height) + 'px';
            decor.classList.toggle('cc-jj-narrow', r.width < 720);
          };
          placeDecor();
          window.__CODEX_CUSTOMIZER_JJ_PLACE__ = placeDecor;
          if (!window.__CODEX_CUSTOMIZER_JJ_RESIZE__) {
            window.__CODEX_CUSTOMIZER_JJ_RESIZE__ = () => {
              try { window.__CODEX_CUSTOMIZER_JJ_PLACE__ && window.__CODEX_CUSTOMIZER_JJ_PLACE__(); } catch (_) {}
            };
            window.addEventListener('resize', window.__CODEX_CUSTOMIZER_JJ_RESIZE__, { passive: true });
          }
        } catch (_) {}

        /*
         * 落日海风 sidebar row chrome:
         * Codex paints almost every left-rail control with rounded-full + solid bg,
         * which our glass theme previously turned into stacked capsules.
         * Force ALL rows flat, then mark only real chips (top brand/search,
         * 「展开显示」, bottom custom) with .cc-jj-chip / .cc-jj-expand.
         */
        try {
          if (meta.id === 'jujingyi-sunset-breeze') {
            const polishLeftRail = () => {
              const panel = document.querySelector('aside.app-shell-left-panel, .app-shell-left-panel');
              if (!panel) return;
              const pr = panel.getBoundingClientRect();
              if (pr.width < 40 || pr.height < 40) return;

              panel.querySelectorAll('button, a, [role="button"]').forEach((el) => {
                if (!el || !panel.contains(el)) return;
                const text = String(el.textContent || '').replace(/\\s+/g, ' ').trim();
                const label = String(el.getAttribute('aria-label') || el.getAttribute('title') || '').trim();
                const blob = text + ' ' + label;
                const r = el.getBoundingClientRect();
                // Only the brand/search strip (first ~40px). Nav rows start below.
                const nearTop = r.top - pr.top < 40 && r.height <= 38;
                const isExpand = /展开显示|折叠显示|Expand display|Collapse display|Show more|Hide more/i.test(blob);
                const isCustom =
                  /^custom$/i.test(text) ||
                  /设置|Settings|Open settings/i.test(blob);
                const isHelp = text === '?' || /帮助|Help|About/i.test(label);
                const isChip = nearTop || isExpand || ((r.bottom > pr.bottom - 64) && (isCustom || isHelp));

                el.classList.remove('cc-jj-chip', 'cc-jj-expand');
                // Strip native / residual pill paints so CSS flat rules win
                el.style.setProperty('background', 'transparent', 'important');
                el.style.setProperty('background-color', 'transparent', 'important');
                el.style.setProperty('background-image', 'none', 'important');
                el.style.setProperty('border-color', 'transparent', 'important');
                el.style.setProperty('box-shadow', 'none', 'important');
                el.style.setProperty('backdrop-filter', 'none', 'important');
                el.style.setProperty('-webkit-backdrop-filter', 'none', 'important');

                if (isChip) {
                  el.classList.add(isExpand ? 'cc-jj-expand' : 'cc-jj-chip');
                  el.style.setProperty('background', 'rgba(255,255,255,0.42)', 'important');
                  el.style.setProperty('background-color', 'rgba(255,255,255,0.42)', 'important');
                  el.style.setProperty('border', '1px solid rgba(255,255,255,0.55)', 'important');
                  el.style.setProperty('border-radius', '999px', 'important');
                  el.style.setProperty(
                    'box-shadow',
                    '0 4px 14px rgba(220,120,140,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
                    'important'
                  );
                  el.style.setProperty('backdrop-filter', 'blur(16px) saturate(1.25)', 'important');
                  el.style.setProperty('-webkit-backdrop-filter', 'blur(16px) saturate(1.25)', 'important');
                } else if (
                  el.getAttribute('aria-current') === 'page' ||
                  el.getAttribute('aria-selected') === 'true'
                ) {
                  el.style.setProperty('background', 'rgba(255,255,255,0.28)', 'important');
                  el.style.setProperty('background-color', 'rgba(255,255,255,0.28)', 'important');
                  el.style.setProperty('border-radius', '10px', 'important');
                  el.style.setProperty('box-shadow', 'inset 2px 0 0 #D46A78', 'important');
                }
              });

              // Nested wrappers that still paint solid pills
              panel.querySelectorAll('li, div, section').forEach((node) => {
                if (!node || node === panel) return;
                if (node.querySelector && node.querySelector('.cc-jj-chip, .cc-jj-expand')) return;
                const cs = window.getComputedStyle(node);
                const bg = cs.backgroundColor || '';
                // Only clear opaque-ish solid fills (not fully transparent)
                if (/rgba?\\(/.test(bg) && !/rgba\\(\\s*0\\s*,\\s*0\\s*,\\s*0\\s*,\\s*0\\s*\\)/.test(bg) && bg !== 'transparent') {
                  // Skip if this is the panel itself or a scrollport with no rounded card look
                  const br = cs.borderRadius || '';
                  if (parseFloat(br) >= 8 || /rounded/.test(String(node.className || ''))) {
                    // Don't clear if it only contains selected row chrome we want
                    if (node.matches && (node.matches('[aria-current="page"]') || node.matches('[aria-selected="true"]'))) return;
                    node.style.setProperty('background', 'transparent', 'important');
                    node.style.setProperty('background-color', 'transparent', 'important');
                    node.style.setProperty('background-image', 'none', 'important');
                    node.style.setProperty('box-shadow', 'none', 'important');
                  }
                }
              });
            };

            /*
             * TRUE FROST: inject wallpaper-blur layers into key cards.
             * Electron / base theme often kill backdrop-filter; filter:blur on a
             * fixed wallpaper clone always works and reads as Gaussian glass.
             */
            const ensureFrost = (el, opts) => {
              if (!el || !el.isConnected) return;
              const small = !!(opts && opts.small);
              el.classList.add('cc-jj-frost');
              if (small) el.classList.add('cc-jj-frost-sm');
              else el.classList.remove('cc-jj-frost-sm');

              el.style.setProperty('position', el.style.position || 'relative', 'important');
              // Keep existing border-radius; force paint-free shell
              el.style.setProperty('background', 'transparent', 'important');
              el.style.setProperty('background-color', 'transparent', 'important');
              el.style.setProperty('background-image', 'none', 'important');
              el.style.setProperty('isolation', 'isolate', 'important');
              el.style.setProperty('overflow', 'hidden', 'important');
              // Bonus when Electron allows it
              el.style.setProperty('backdrop-filter', 'blur(40px) saturate(1.5)', 'important');
              el.style.setProperty('-webkit-backdrop-filter', 'blur(40px) saturate(1.5)', 'important');

              let layer = el.querySelector(':scope > .cc-jj-frost-layer');
              if (!layer) {
                layer = document.createElement('div');
                layer.className = 'cc-jj-frost-layer';
                layer.setAttribute('aria-hidden', 'true');
                el.insertBefore(layer, el.firstChild);
              }
              let tint = el.querySelector(':scope > .cc-jj-frost-tint');
              if (!tint) {
                tint = document.createElement('div');
                tint.className = 'cc-jj-frost-tint';
                tint.setAttribute('aria-hidden', 'true');
                // tint sits above layer
                if (layer.nextSibling) el.insertBefore(tint, layer.nextSibling);
                else el.appendChild(tint);
              }

              // Re-assert layer paints (in case something wiped them)
              layer.style.setProperty('display', 'block', 'important');
              layer.style.setProperty('position', 'absolute', 'important');
              layer.style.setProperty('inset', small ? '-40px' : '-64px', 'important');
              layer.style.setProperty('z-index', '0', 'important');
              layer.style.setProperty('pointer-events', 'none', 'important');
              layer.style.setProperty('background-color', 'var(--jj-edge, #D898A4)', 'important');
              // background-image comes from CSS var(--jj-art); also set if available
              const art = getComputedStyle(document.documentElement).getPropertyValue('--jj-art').trim();
              if (art) layer.style.setProperty('background-image', art, 'important');
              layer.style.setProperty('background-size', 'cover', 'important');
              layer.style.setProperty('background-position', 'center 30%', 'important');
              layer.style.setProperty('background-repeat', 'no-repeat', 'important');
              layer.style.setProperty('background-attachment', 'fixed', 'important');
              layer.style.setProperty(
                'filter',
                small ? 'blur(28px) saturate(1.45) brightness(1.03)' : 'blur(40px) saturate(1.55) brightness(1.04)',
                'important'
              );
              layer.style.setProperty(
                '-webkit-filter',
                small ? 'blur(28px) saturate(1.45) brightness(1.03)' : 'blur(40px) saturate(1.55) brightness(1.04)',
                'important'
              );
              layer.style.setProperty('transform', 'none', 'important');
              layer.style.setProperty('opacity', '1', 'important');

              tint.style.setProperty('display', 'block', 'important');
              tint.style.setProperty('position', 'absolute', 'important');
              tint.style.setProperty('inset', '0', 'important');
              tint.style.setProperty('z-index', '0', 'important');
              tint.style.setProperty('pointer-events', 'none', 'important');
              tint.style.setProperty(
                'background',
                small
                  ? 'rgba(255,255,255,0.2)'
                  : 'linear-gradient(165deg, rgba(255,255,255,0.28) 0%, rgba(255,245,248,0.18) 100%)',
                'important'
              );
              tint.style.setProperty('opacity', '1', 'important');
              tint.style.setProperty('filter', 'none', 'important');

              // Lift real content above frost
              Array.from(el.children).forEach((child) => {
                if (!child || child === layer || child === tint) return;
                child.style.setProperty('position', 'relative', 'important');
                child.style.setProperty('z-index', '1', 'important');
              });
            };

            const clearSolidFills = (root, depth) => {
              if (!root || depth > 4) return;
              root.querySelectorAll('div, section, form, span, li').forEach((node) => {
                if (!node || node.classList.contains('cc-jj-frost-layer') || node.classList.contains('cc-jj-frost-tint')) return;
                if (node.closest && node.closest('button, a, [role="button"], input, textarea, select, .ProseMirror')) {
                  // only skip if the node IS the interactive, not an ancestor wrapper
                  if (node.matches && node.matches('button, a, [role="button"], input, textarea, select')) return;
                }
                const cs = window.getComputedStyle(node);
                const bg = cs.backgroundColor || '';
                const br = parseFloat(cs.borderRadius) || 0;
                // Clear opaque-ish nested slabs that mask frost
                if (br >= 6 || /rounded|bg-token|elevation|surface/.test(String(node.className || ''))) {
                  if (bg && bg !== 'transparent' && !/rgba\\(\\s*0\\s*,\\s*0\\s*,\\s*0\\s*,\\s*0\\s*\\)/.test(bg)) {
                    // keep very translucent fills
                    const m = bg.match(/rgba?\\(\\s*[\\d.]+\\s*,\\s*[\\d.]+\\s*,\\s*[\\d.]+\\s*(?:,\\s*([\\d.]+))?\\s*\\)/i);
                    const a = m && m[1] != null ? parseFloat(m[1]) : 1;
                    if (a > 0.2) {
                      node.style.setProperty('background', 'transparent', 'important');
                      node.style.setProperty('background-color', 'transparent', 'important');
                      node.style.setProperty('background-image', 'none', 'important');
                      node.style.setProperty('box-shadow', 'none', 'important');
                    }
                  }
                }
              });
            };

            const markFrostRows = (root) => {
              if (!root) return;
              root.querySelectorAll('button, a, [role="button"], li, [class*="rounded"]').forEach((el) => {
                if (!el || el.classList.contains('cc-jj-frost')) return;
                const r = el.getBoundingClientRect();
                if (r.width < 80 || r.height < 28 || r.height > 72) return;
                // path-like full-width rows
                if (r.width > (root.getBoundingClientRect().width * 0.7)) {
                  el.classList.add('cc-jj-frost-row');
                  el.style.setProperty('background', 'rgba(255,255,255,0.14)', 'important');
                  el.style.setProperty('background-color', 'rgba(255,255,255,0.14)', 'important');
                  el.style.setProperty('background-image', 'none', 'important');
                  el.style.setProperty('border', '1px solid rgba(255,255,255,0.35)', 'important');
                  el.style.setProperty('box-shadow', 'none', 'important');
                  el.style.setProperty('backdrop-filter', 'blur(16px) saturate(1.25)', 'important');
                  el.style.setProperty('-webkit-backdrop-filter', 'blur(16px) saturate(1.25)', 'important');
                }
              });
            };

            const polishFrostSurfaces = () => {
              // (0) Home hero prompt card + four suggestion cards
              const main =
                document.querySelector('main.main-surface') || document.querySelector('main');
              if (main) {
                // Hero: large rounded card with the main prompt line
                main.querySelectorAll(
                  '[role="main"] [class*="rounded-3xl"], [role="main"] [class*="rounded-2xl"], [role="main"] [class*="rounded-full"]'
                ).forEach((el) => {
                  if (el.closest('aside')) return;
                  if (el.closest('[class*="home-suggestions"]')) return;
                  const r = el.getBoundingClientRect();
                  const text = String(el.textContent || '');
                  // Hero is wide and relatively short (prompt bar), not a tall list
                  if (r.width < 280 || r.height < 56 || r.height > 220) return;
                  if (
                    /构建什么|中构建|What should|should we build|OpenHand|GrokRegister|Codex/i.test(text) ||
                    (r.width > 420 && r.height >= 64 && r.height <= 180)
                  ) {
                    ensureFrost(el, { small: false });
                    clearSolidFills(el, 0);
                  }
                });

                // Suggestion cards
                main
                  .querySelectorAll(
                    '[class*="home-suggestions"] button, .group\\/home-suggestions button'
                  )
                  .forEach((btn) => {
                    const r = btn.getBoundingClientRect();
                    if (r.width < 100 || r.height < 80) return;
                    ensureFrost(btn, { small: true });
                    // Do NOT clear icon gradient bubbles (small rounded 40-48px)
                    btn.querySelectorAll('div, span, section').forEach((node) => {
                      if (!node || node.classList.contains('cc-jj-frost-layer') || node.classList.contains('cc-jj-frost-tint')) return;
                      const nr = node.getBoundingClientRect();
                      if (nr.width <= 52 && nr.height <= 52) return; // rose icon bubble
                      if (node.closest && node.closest('svg')) return;
                      const cs = window.getComputedStyle(node);
                      const bg = cs.backgroundColor || '';
                      const br = parseFloat(cs.borderRadius) || 0;
                      if (br >= 6 || /rounded|bg-token|elevation|surface/.test(String(node.className || ''))) {
                        const m = bg.match(/rgba?\\(\\s*[\\d.]+\\s*,\\s*[\\d.]+\\s*,\\s*[\\d.]+\\s*(?:,\\s*([\\d.]+))?\\s*\\)/i);
                        const a = m && m[1] != null ? parseFloat(m[1]) : (/rgb\\(/.test(bg) ? 1 : 0);
                        if (a > 0.25) {
                          node.style.setProperty('background', 'transparent', 'important');
                          node.style.setProperty('background-color', 'transparent', 'important');
                          node.style.setProperty('background-image', 'none', 'important');
                          node.style.setProperty('box-shadow', 'none', 'important');
                        }
                      }
                    });
                    // Re-assert rose icon gradient after clear
                    btn.querySelectorAll('[class*="rounded-full"], [class*="rounded-md"], [class*="rounded-lg"]').forEach((icon) => {
                      const ir = icon.getBoundingClientRect();
                      if (ir.width > 52 || ir.height > 52) return;
                      icon.style.setProperty(
                        'background',
                        'linear-gradient(145deg, #F5B8C0 0%, #E88A98 48%, #D46A78 100%)',
                        'important'
                      );
                      icon.style.setProperty(
                        'background-image',
                        'linear-gradient(145deg, #F5B8C0 0%, #E88A98 48%, #D46A78 100%)',
                        'important'
                      );
                      icon.style.setProperty('color', '#fff', 'important');
                      icon.style.setProperty('border-radius', '999px', 'important');
                      icon.style.setProperty('z-index', '2', 'important');
                      icon.style.setProperty('position', 'relative', 'important');
                    });
                  });
              }

              // Mark dynamic Codex surfaces semantically. CSS owns their visual layout;
              // the periodic pass only refreshes markers as native DOM changes.
              // Markers are additive and idempotent. Dynamic nodes remove themselves with
              // their native DOM; resetTheme clears markers when leaving the preset.
              // Avoid remove/re-add churn here because class mutations retrigger apply().
              document.querySelectorAll('.cc-jj-frost-row').forEach((el) => {
                el.classList.remove('cc-jj-frost-row');
                [
                  'background',
                  'background-color',
                  'background-image',
                  'border',
                  'box-shadow',
                  'backdrop-filter',
                  '-webkit-backdrop-filter'
                ].forEach((property) => el.style.removeProperty(property));
              });

              const composer = document.querySelector('[data-codex-composer-root]');
              if (composer) {
                composer.classList.add('cc-jj-composer');
                composer.querySelectorAll('div, section, form').forEach((node) => {
                  if (node.classList.contains('cc-jj-frost-layer') || node.classList.contains('cc-jj-frost-tint')) return;
                  ['background', 'background-color', 'background-image', 'border', 'box-shadow', 'backdrop-filter', '-webkit-backdrop-filter']
                    .forEach((property) => node.style.removeProperty(property));
                });
                const composerDock = composer.closest('.sticky.bottom-0') || composer.parentElement || composer;
                const bannerCandidates = composerDock.querySelectorAll(
                  '[class*="validation"][class*="rounded-t"], [class*="-mb-8"][class*="rounded-t"], [class*="bg-token-input-validation"], [class*="validation-error"], [class*="validation-warning"], [class*="validation-info"]'
                );
                let banner = null;
                bannerCandidates.forEach((candidate) => {
                  const r = candidate.getBoundingClientRect();
                  if (r.width < 160 || r.height < 28) return;
                  const shell = candidate.closest('[class*="rounded-t"]') || candidate;
                  if (!banner || shell.contains(banner)) banner = shell;
                });
                if (banner) banner.classList.add('cc-jj-access-banner');
              }

              if (main) {
                const candidates = Array.from(
                  main.querySelectorAll('details, [class*="border"][class*="rounded"]')
                ).filter((el) => {
                  if (el.closest('aside, [data-codex-composer-root], [class*="home-suggestions"]')) return false;
                  const r = el.getBoundingClientRect();
                  const text = String(el.textContent || '');
                  return r.width >= 220 && r.height >= 70 &&
                    (/已编辑|个文件|files? changed|edited/i.test(text) ||
                      (/\\+\\d+/.test(text) && /(?:−|-)\\d+/.test(text)));
                });
                candidates.forEach((candidate) => {
                  if (candidates.some((other) => other !== candidate && other.contains(candidate))) return;
                  candidate.classList.add('cc-jj-change-summary');
                  candidate.querySelectorAll('div, section, li, button, a').forEach((node) => {
                    if (node === candidate) return;
                    ['background', 'background-color', 'background-image', 'border', 'border-radius', 'box-shadow', 'backdrop-filter', '-webkit-backdrop-filter']
                      .forEach((property) => node.style.removeProperty(property));
                  });
                  const cardWidth = candidate.getBoundingClientRect().width;
                  candidate.querySelectorAll('button, a, li, [role="button"], [class*="rounded"]').forEach((row) => {
                    if (row.closest('.cc-jj-change-summary') !== candidate) return;
                    const r = row.getBoundingClientRect();
                    const text = String(row.textContent || '').trim();
                    if (r.width >= cardWidth * 0.72 && r.height >= 28 && r.height <= 72 &&
                        (/[/\\\\]/.test(text) || /\\+\\d+|(?:−|-)\\d+/.test(text))) {
                      row.classList.add('cc-jj-change-row');
                    }
                  });
                });
              }

              document.querySelectorAll('[class*="origin-top-right"]').forEach((panel) => {
                const r = panel.getBoundingClientRect();
                const text = String(panel.textContent || '');
                if (r.width < 220 || r.height < 100 || !/环境信息|Environment|变更|Changes|本地|Local|GitHub/i.test(text)) return;
                panel.classList.add('cc-jj-environment-summary');
                panel.querySelectorAll('div, section, li, button, a').forEach((node) => {
                  if (node === panel) return;
                  ['background', 'background-color', 'background-image', 'border', 'box-shadow', 'backdrop-filter', '-webkit-backdrop-filter']
                    .forEach((property) => node.style.removeProperty(property));
                });
                const panelWidth = r.width;
                panel.querySelectorAll('button, a, [role="button"]').forEach((control) => {
                  const cr = control.getBoundingClientRect();
                  const label = String(control.textContent || control.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim();
                  const isDataRow = /变更|Changes|本地|Local|main|提交或推送|Commit|Push|GitHub CLI/i.test(label);
                  if (isDataRow && cr.width >= panelWidth * 0.62 && cr.height >= 28 && cr.height <= 64) {
                    control.classList.add('cc-jj-environment-row');
                  }
                });
              });

              document
                .querySelectorAll('main.main-surface aside[data-app-shell-focus-area="right-panel"]')
                .forEach((rail) => {
                  rail.classList.add('cc-jj-right-tools');
                  const railWidth = rail.getBoundingClientRect().width;
                  rail.querySelectorAll('kbd, [class*="keybinding"], [class*="Keybinding"]').forEach((keycap) => {
                    keycap.classList.add('cc-jj-keycap');
                  });
                  rail.querySelectorAll('button, a, [role="button"]').forEach((row) => {
                    if (row.closest('kbd, [class*="keybinding"], [class*="Keybinding"]')) return;
                    const r = row.getBoundingClientRect();
                    const text = String(row.textContent || '').trim();
                    const isIconOnly = !text || r.width <= 48;
                    if (!isIconOnly && r.width >= railWidth * 0.68 && r.height >= 28 && r.height <= 72) {
                      row.classList.add('cc-jj-right-tool-row');
                    }
                  });
                });
            };

            polishLeftRail();
            polishFrostSurfaces();
            window.__CODEX_CUSTOMIZER_JJ_LEFT_POLISH__ = polishLeftRail;
            window.__CODEX_CUSTOMIZER_JJ_FROST_POLISH__ = polishFrostSurfaces;
            if (!window.__CODEX_CUSTOMIZER_JJ_LEFT_POLISH_TIMER__) {
              window.__CODEX_CUSTOMIZER_JJ_LEFT_POLISH_TIMER__ = setInterval(() => {
                try {
                  if (document.documentElement.getAttribute('data-cc-preset') === 'jujingyi-sunset-breeze') {
                    window.__CODEX_CUSTOMIZER_JJ_LEFT_POLISH__ && window.__CODEX_CUSTOMIZER_JJ_LEFT_POLISH__();
                    window.__CODEX_CUSTOMIZER_JJ_FROST_POLISH__ && window.__CODEX_CUSTOMIZER_JJ_FROST_POLISH__();
                    window.__CODEX_CUSTOMIZER_JJ_PLACE__ && window.__CODEX_CUSTOMIZER_JJ_PLACE__();
                  }
                } catch (_) {}
              }, 700);
            }
          } else {
            try {
              if (window.__CODEX_CUSTOMIZER_JJ_LEFT_POLISH_TIMER__) {
                clearInterval(window.__CODEX_CUSTOMIZER_JJ_LEFT_POLISH_TIMER__);
                window.__CODEX_CUSTOMIZER_JJ_LEFT_POLISH_TIMER__ = null;
              }
              document.querySelectorAll('.cc-jj-frost-layer, .cc-jj-frost-tint').forEach((n) => n.remove());
              document.querySelectorAll('.cc-jj-frost, .cc-jj-frost-sm, .cc-jj-frost-row').forEach((el) => {
                el.classList.remove('cc-jj-frost', 'cc-jj-frost-sm', 'cc-jj-frost-row');
              });
            } catch (_) {}
          }
        } catch (_) {}

        window.${MARKER} = Object.assign({}, meta, { active: true, apply: apply, styleId: STYLE_ID });
        return { ok: true, id: meta.id };
      } finally {
        applying = false;
      }
    };

    const result = apply();

    /*
     * Decouple right-rail toggle from 置顶摘要:
     * Native Codex auto-shows origin-top-right when the tools rail closes.
     * User expects rightmost header button = rail only; left button = summary.
     * We track explicit user opens via 切换置顶摘要 and set html.cc-summary-open
     * for the theme CSS gate.
     */
    try {
      const setSummaryOpen = (open) => {
        window.__CODEX_CUSTOMIZER_SUMMARY_OPEN__ = !!open;
        const root = document.documentElement;
        if (open) root.classList.add('cc-summary-open');
        else root.classList.remove('cc-summary-open');
      };

      // Replace prior handler so re-inject never double-toggles
      if (window.__CODEX_CUSTOMIZER_SUMMARY_HANDLER__) {
        document.removeEventListener('click', window.__CODEX_CUSTOMIZER_SUMMARY_HANDLER__, true);
      }

      window.__CODEX_CUSTOMIZER_SUMMARY_HANDLER__ = (e) => {
        const btn = e.target && e.target.closest ? e.target.closest('button') : null;
        if (!btn || !btn.closest('header.app-header-tint, header, .app-header-tint')) return;
        const label = btn.getAttribute('aria-label') || btn.getAttribute('title') || '';
        // Only the pin control for the floating env panel (rail-closed mode).
        // "切换摘要" (no 置顶) opens a Radix popover while the tools rail is open — leave it alone.
        if (!/置顶摘要/.test(label)) return;
        setSummaryOpen(!window.__CODEX_CUSTOMIZER_SUMMARY_OPEN__);
      };

      document.addEventListener('click', window.__CODEX_CUSTOMIZER_SUMMARY_HANDLER__, true);
      window.__CODEX_CUSTOMIZER_SUMMARY_BOUND__ = true;

      // Preserve pin across re-inject; default closed on first bind
      if (typeof window.__CODEX_CUSTOMIZER_SUMMARY_OPEN__ !== 'boolean') {
        setSummaryOpen(false);
      } else {
        setSummaryOpen(window.__CODEX_CUSTOMIZER_SUMMARY_OPEN__);
      }
    } catch (_) {}

    /*
     * Left sidebar pin:
     * Native Codex often only peeks the left rail on hover after collapse —
     * click does not keep it open. We treat explicit open clicks as PIN and
     * keep the rail permanently expanded until the user toggles close again.
     */
    try {
      const LEFT_PIN_KEY = '__CODEX_CUSTOMIZER_LEFT_PINNED__';
      const LEFT_WIDTH_KEY = '__CODEX_CUSTOMIZER_LEFT_WIDTH__';

      const getLeftPanel = () =>
        document.querySelector('aside.app-shell-left-panel, .app-shell-left-panel');

      const isLeftOpen = (panel) => {
        if (!panel) return false;
        const cs = window.getComputedStyle(panel);
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) return false;
        const r = panel.getBoundingClientRect();
        return r.width >= 48 && r.height >= 80;
      };

      const setLeftPinned = (open) => {
        window[LEFT_PIN_KEY] = !!open;
        const root = document.documentElement;
        if (open) root.classList.add('cc-left-pinned');
        else root.classList.remove('cc-left-pinned');
        if (!open) {
          const panel = getLeftPanel();
          if (panel) {
            ;[
              'display',
              'visibility',
              'opacity',
              'pointer-events',
              'transform',
              'width',
              'min-width',
              'max-width',
              'flex',
              'flex-basis',
              'position',
              'left',
              'right',
              'top',
              'bottom',
              'z-index',
              'margin',
              'height',
              'max-height'
            ].forEach((k) => {
              try { panel.style.removeProperty(k); } catch (_) {}
            });
          }
        }
      };

      const forceLeftOpen = () => {
        if (!window[LEFT_PIN_KEY]) return;
        const panel = getLeftPanel();
        if (!panel) return;
        const r = panel.getBoundingClientRect();
        if (r.width >= 160) {
          window[LEFT_WIDTH_KEY] = Math.round(r.width);
        }
        const w = window[LEFT_WIDTH_KEY] || 260;
        panel.style.setProperty('display', 'flex', 'important');
        panel.style.setProperty('visibility', 'visible', 'important');
        panel.style.setProperty('opacity', '1', 'important');
        panel.style.setProperty('pointer-events', 'auto', 'important');
        panel.style.setProperty('transform', 'none', 'important');
        panel.style.setProperty('position', 'relative', 'important');
        panel.style.setProperty('left', 'auto', 'important');
        panel.style.setProperty('right', 'auto', 'important');
        panel.style.setProperty('top', 'auto', 'important');
        panel.style.setProperty('bottom', 'auto', 'important');
        panel.style.setProperty('width', w + 'px', 'important');
        panel.style.setProperty('min-width', Math.min(220, w) + 'px', 'important');
        panel.style.setProperty('max-width', '380px', 'important');
        panel.style.setProperty('flex', '0 0 ' + w + 'px', 'important');
        panel.style.setProperty('flex-basis', w + 'px', 'important');
        panel.style.setProperty('z-index', '40', 'important');
        panel.style.setProperty('height', '100%', 'important');
        panel.style.setProperty('max-height', 'none', 'important');
        panel.style.setProperty('margin', '0', 'important');
        // Parent flex row must not collapse the rail
        const parent = panel.parentElement;
        if (parent) {
          parent.style.setProperty('display', parent.style.display || 'flex', 'important');
        }
        document.documentElement.classList.add('cc-left-pinned');
      };

      const isLeftToggleBtn = (btn) => {
        if (!btn) return false;
        const label = (
          btn.getAttribute('aria-label') ||
          btn.getAttribute('title') ||
          btn.getAttribute('data-tooltip') ||
          btn.getAttribute('data-state') ||
          btn.textContent ||
          ''
        ).trim();
        // Explicit sidebar / nav rail toggles (CN + EN)
        if (
          /侧边栏|左边栏|左侧栏|导航栏|sidebar|side[\\s-]?bar|left panel|left rail|toggle navigation|toggle sidebar|show sidebar|hide sidebar|显示侧边|隐藏侧边|展开侧边|折叠侧边|显示导航|隐藏导航|panel.*left|left.*panel|主侧栏|切换.*栏/i.test(
            label
          )
        ) {
          return true;
        }
        // Header chrome icon near traffic lights (Codex layout: first cluster tools)
        if (btn.closest('header.app-header-tint, header, .app-header-tint')) {
          // Prefer known labels already matched; also match "显示/隐藏" generic panel toggles
          if (/显示\\/隐藏|显示或隐藏|Show\\/Hide|toggle panel|open panel|close panel/i.test(label)) {
            // Exclude right-rail-only controls
            if (!/右侧|right|tools|工具|摘要|summary/i.test(label)) return true;
          }
        }
        return false;
      };

      if (window.__CODEX_CUSTOMIZER_LEFT_HANDLER__) {
        document.removeEventListener('click', window.__CODEX_CUSTOMIZER_LEFT_HANDLER__, true);
      }
      if (window.__CODEX_CUSTOMIZER_LEFT_LEAVE__) {
        document.removeEventListener('pointerleave', window.__CODEX_CUSTOMIZER_LEFT_LEAVE__, true);
        document.removeEventListener('mouseleave', window.__CODEX_CUSTOMIZER_LEFT_LEAVE__, true);
      }

      window.__CODEX_CUSTOMIZER_LEFT_HANDLER__ = (e) => {
        const btn = e.target && e.target.closest ? e.target.closest('button, [role="button"], a') : null;
        const wasOpen = isLeftOpen(getLeftPanel());
        const wasToggle = isLeftToggleBtn(btn);

        const rememberWidth = () => {
          const panel = getLeftPanel();
          if (!panel) return;
          const r = panel.getBoundingClientRect();
          if (r.width >= 160) window[LEFT_WIDTH_KEY] = Math.round(r.width);
        };

        // Explicit sidebar toggle: wait for native animation, then pin or release once
        if (wasToggle) {
          window.setTimeout(() => {
            const nowOpen = isLeftOpen(getLeftPanel());
            if (nowOpen) {
              rememberWidth();
              setLeftPinned(true);
              forceLeftOpen();
            } else {
              setLeftPinned(false);
            }
          }, 220);
          // Re-assert pin after slower transitions
          window.setTimeout(() => {
            if (window[LEFT_PIN_KEY]) forceLeftOpen();
          }, 480);
          return;
        }

        // Any other click that opens a closed rail → treat as pin intent
        window.setTimeout(() => {
          const nowOpen = isLeftOpen(getLeftPanel());
          if (!wasOpen && nowOpen) {
            rememberWidth();
            setLeftPinned(true);
            forceLeftOpen();
          } else if (window[LEFT_PIN_KEY]) {
            forceLeftOpen();
          }
        }, 80);
      };

      // If pinned, any leave that collapses the rail gets immediately re-opened
      window.__CODEX_CUSTOMIZER_LEFT_LEAVE__ = (e) => {
        if (!window[LEFT_PIN_KEY]) return;
        const panel = getLeftPanel();
        if (!panel) return;
        // Only react when pointer leaves the panel itself (or its descendants)
        if (e.target !== panel && !panel.contains(e.target)) return;
        window.setTimeout(() => {
          if (window[LEFT_PIN_KEY] && !isLeftOpen(getLeftPanel())) forceLeftOpen();
          else if (window[LEFT_PIN_KEY]) forceLeftOpen();
        }, 0);
      };

      document.addEventListener('click', window.__CODEX_CUSTOMIZER_LEFT_HANDLER__, true);
      document.addEventListener('pointerleave', window.__CODEX_CUSTOMIZER_LEFT_LEAVE__, true);
      document.addEventListener('mouseleave', window.__CODEX_CUSTOMIZER_LEFT_LEAVE__, true);

      // Also pin when user clicks into the peeked panel (treat interaction as intent to keep)
      if (window.__CODEX_CUSTOMIZER_LEFT_INTERACT__) {
        document.removeEventListener('pointerdown', window.__CODEX_CUSTOMIZER_LEFT_INTERACT__, true);
      }
      window.__CODEX_CUSTOMIZER_LEFT_INTERACT__ = (e) => {
        const panel = getLeftPanel();
        if (!panel || !panel.contains(e.target)) return;
        // Clicking a nav item while peeked → pin open
        if (!window[LEFT_PIN_KEY] && isLeftOpen(panel)) {
          const r = panel.getBoundingClientRect();
          if (r.width >= 160) window[LEFT_WIDTH_KEY] = Math.round(r.width);
          setLeftPinned(true);
          forceLeftOpen();
        }
      };
      document.addEventListener('pointerdown', window.__CODEX_CUSTOMIZER_LEFT_INTERACT__, true);

      // Preserve pin across re-inject
      if (typeof window[LEFT_PIN_KEY] !== 'boolean') {
        // Auto-pin if already open at inject time (user had it expanded)
        setLeftPinned(isLeftOpen(getLeftPanel()));
      } else {
        setLeftPinned(!!window[LEFT_PIN_KEY]);
      }
      if (window[LEFT_PIN_KEY]) {
        forceLeftOpen();
        window.setTimeout(forceLeftOpen, 80);
      }

      // Heartbeat while pinned — native hover-collapse can fight us mid-frame
      if (window.__CODEX_CUSTOMIZER_LEFT_TIMER__) clearInterval(window.__CODEX_CUSTOMIZER_LEFT_TIMER__);
      window.__CODEX_CUSTOMIZER_LEFT_TIMER__ = setInterval(() => {
        if (window[LEFT_PIN_KEY]) forceLeftOpen();
      }, 400);

      window.__CODEX_CUSTOMIZER_LEFT_BOUND__ = true;
    } catch (_) {}

    try {
      if (window.__CODEX_CUSTOMIZER_OBSERVER__) {
        window.__CODEX_CUSTOMIZER_OBSERVER__.disconnect();
      }
      let scheduled = null;
      const schedule = (full) => {
        if (scheduled) return;
        scheduled = setTimeout(() => {
          scheduled = null;
          if (full) apply();
          else {
            applyCritical(document.documentElement);
            if (document.body) applyCritical(document.body);
            ensureStyleTag();
          }
        }, full ? 100 : 40);
      };
      const obs = new MutationObserver((muts) => {
        let styleTouched = false;
        let structure = false;
        for (const m of muts) {
          if (m.type === 'attributes' && m.attributeName === 'style' && m.target === document.documentElement) {
            styleTouched = true;
          } else {
            structure = true;
          }
        }
        // Native theme rewrote html style — re-assert critical tokens immediately
        if (styleTouched && !applying) {
          applyCritical(document.documentElement);
          if (document.body) applyCritical(document.body);
        }
        if (structure) schedule(true);
      });
      obs.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'data-theme', 'data-appearance']
      });
      window.__CODEX_CUSTOMIZER_OBSERVER__ = obs;

      if (window.__CODEX_CUSTOMIZER_TIMER__) clearInterval(window.__CODEX_CUSTOMIZER_TIMER__);
      // Faster heartbeat: native can reset color-text-* on html
      window.__CODEX_CUSTOMIZER_TIMER__ = setInterval(() => {
        if (!document.getElementById(STYLE_ID) || !document.documentElement.classList.contains(ROOT_CLASS)) {
          apply();
        } else {
          applyCritical(document.documentElement);
          if (document.body) applyCritical(document.body);
          ensureStyleTag();
        }
      }, 800);
    } catch (_) {}

    return result;
  } catch (e) {
    return { ok: false, error: String(e && e.stack ? e.stack : (e && e.message ? e.message : e)) };
  }
})()
`.trim()
}

function buildResetScript(): string {
  return `
(() => {
  try {
    document.getElementById('${STYLE_TAG_ID}')?.remove();
    document.getElementById('cc-jj-decor')?.remove();
    try {
      if (window.__CODEX_CUSTOMIZER_JJ_RESIZE__) {
        window.removeEventListener('resize', window.__CODEX_CUSTOMIZER_JJ_RESIZE__);
      }
      window.__CODEX_CUSTOMIZER_JJ_RESIZE__ = null;
      window.__CODEX_CUSTOMIZER_JJ_PLACE__ = null;
    } catch (_) {}
    document.documentElement.classList.remove('${ROOT_CLASS}');
    document.documentElement.removeAttribute('data-cc-preset');
    const root = document.documentElement;
    Array.from(root.style).forEach((name) => {
      if (
        name.startsWith('--cc-') ||
        name.startsWith('--color-token') ||
        name.startsWith('--color-background') ||
        name.startsWith('--color-text') ||
        name.startsWith('--color-icon') ||
        name.startsWith('--text-primary') ||
        name.startsWith('--text-secondary') ||
        name.startsWith('--oai-wb-text') ||
        name.startsWith('--vscode-')
      ) {
        root.style.removeProperty(name);
      }
    });
    if (document.body) {
      Array.from(document.body.style).forEach((name) => {
        if (
          name.startsWith('--cc-') ||
          name.startsWith('--color-token') ||
          name.startsWith('--color-text') ||
          name.startsWith('--color-icon') ||
          name.startsWith('--vscode-')
        ) {
          document.body.style.removeProperty(name);
        }
      });
    }
    document.querySelectorAll('[data-cc-icon]').forEach((el) => {
      el.removeAttribute('data-cc-icon');
      el.style.removeProperty('color');
    });
    document.querySelectorAll('[data-cc-text]').forEach((el) => {
      el.removeAttribute('data-cc-text');
      el.style.removeProperty('color');
      el.style.removeProperty('-webkit-text-fill-color');
    });
    try { window.__CODEX_CUSTOMIZER_OBSERVER__?.disconnect(); } catch (_) {}
    try { if (window.__CODEX_CUSTOMIZER_TIMER__) clearInterval(window.__CODEX_CUSTOMIZER_TIMER__); } catch (_) {}
    try {
      if (window.__CODEX_CUSTOMIZER_SUMMARY_HANDLER__) {
        document.removeEventListener('click', window.__CODEX_CUSTOMIZER_SUMMARY_HANDLER__, true);
      }
    } catch (_) {}
    try { document.documentElement.classList.remove('cc-summary-open'); } catch (_) {}
    try { window.__CODEX_CUSTOMIZER_SUMMARY_OPEN__ = false; } catch (_) {}
    try { window.__CODEX_CUSTOMIZER_SUMMARY_BOUND__ = false; } catch (_) {}
    try { window.__CODEX_CUSTOMIZER_SUMMARY_HANDLER__ = null; } catch (_) {}
    try {
      if (window.__CODEX_CUSTOMIZER_LEFT_HANDLER__) {
        document.removeEventListener('click', window.__CODEX_CUSTOMIZER_LEFT_HANDLER__, true);
      }
      if (window.__CODEX_CUSTOMIZER_LEFT_LEAVE__) {
        document.removeEventListener('pointerleave', window.__CODEX_CUSTOMIZER_LEFT_LEAVE__, true);
        document.removeEventListener('mouseleave', window.__CODEX_CUSTOMIZER_LEFT_LEAVE__, true);
      }
      if (window.__CODEX_CUSTOMIZER_LEFT_INTERACT__) {
        document.removeEventListener('pointerdown', window.__CODEX_CUSTOMIZER_LEFT_INTERACT__, true);
      }
      if (window.__CODEX_CUSTOMIZER_LEFT_TIMER__) clearInterval(window.__CODEX_CUSTOMIZER_LEFT_TIMER__);
      if (window.__CODEX_CUSTOMIZER_JJ_LEFT_POLISH_TIMER__) {
        clearInterval(window.__CODEX_CUSTOMIZER_JJ_LEFT_POLISH_TIMER__);
      }
      document.documentElement.classList.remove('cc-left-pinned');
      window.__CODEX_CUSTOMIZER_LEFT_PINNED__ = false;
      window.__CODEX_CUSTOMIZER_LEFT_HANDLER__ = null;
      window.__CODEX_CUSTOMIZER_LEFT_LEAVE__ = null;
      window.__CODEX_CUSTOMIZER_LEFT_INTERACT__ = null;
      window.__CODEX_CUSTOMIZER_LEFT_BOUND__ = false;
      window.__CODEX_CUSTOMIZER_JJ_LEFT_POLISH__ = null;
      window.__CODEX_CUSTOMIZER_JJ_LEFT_POLISH_TIMER__ = null;
      document.querySelectorAll('.cc-jj-chip, .cc-jj-expand').forEach((el) => {
        el.classList.remove('cc-jj-chip', 'cc-jj-expand');
      });
      document.querySelectorAll('.cc-jj-frost-layer, .cc-jj-frost-tint').forEach((n) => n.remove());
      document.querySelectorAll('.cc-jj-frost, .cc-jj-frost-sm, .cc-jj-frost-row').forEach((el) => {
        el.classList.remove('cc-jj-frost', 'cc-jj-frost-sm', 'cc-jj-frost-row');
      });
      document.querySelectorAll(
        '.cc-jj-composer, .cc-jj-access-banner, .cc-jj-change-summary, .cc-jj-change-row, .cc-jj-environment-summary, .cc-jj-environment-row, .cc-jj-right-tools, .cc-jj-right-tool-row, .cc-jj-keycap'
      ).forEach((el) => {
        el.classList.remove(
          'cc-jj-composer',
          'cc-jj-access-banner',
          'cc-jj-change-summary',
          'cc-jj-change-row',
          'cc-jj-environment-summary',
          'cc-jj-environment-row',
          'cc-jj-right-tools',
          'cc-jj-right-tool-row',
          'cc-jj-keycap'
        );
      });
      window.__CODEX_CUSTOMIZER_JJ_FROST_POLISH__ = null;
    } catch (_) {}
    if (window.${MARKER}) window.${MARKER}.active = false;
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
})()
`.trim()
}

async function listInjectableTargets(port: number): Promise<CDP.Target[]> {
  const targets = await CDP.List({ port, host: '127.0.0.1' })
  return targets.filter((t) => {
    const type = t.type || ''
    const url = t.url || ''
    if (url.startsWith('devtools://') || url.startsWith('chrome-extension://')) {
      return false
    }
    if (type === 'page' || type === 'webview') return true
    if (type === 'iframe' || type === 'other') {
      return url.startsWith('app://') || url.includes('index.html')
    }
    return false
  })
}

async function waitForTargets(
  port: number,
  timeoutMs = 20000
): Promise<CDP.Target[]> {
  const start = Date.now()
  let lastError: unknown = null
  while (Date.now() - start < timeoutMs) {
    try {
      const pages = await listInjectableTargets(port)
      if (pages.length > 0) return pages
    } catch (e) {
      lastError = e
    }
    await new Promise((r) => setTimeout(r, 400))
  }
  throw new Error(
    `CDP targets not ready on port ${port}` +
      (lastError ? `: ${String(lastError)}` : '')
  )
}

async function evaluateOnTarget(
  port: number,
  target: CDP.Target,
  expression: string
): Promise<unknown> {
  const client = await CDP({
    host: '127.0.0.1',
    port,
    target: target.webSocketDebuggerUrl || target
  })
  try {
    const { Runtime, Page } = client as typeof client & {
      Runtime: {
        enable: () => Promise<void>
        evaluate: (opts: {
          expression: string
          returnByValue?: boolean
          awaitPromise?: boolean
        }) => Promise<{
          result: { value?: unknown }
          exceptionDetails?: {
            text?: string
            exception?: { description?: string }
            stackTrace?: {
              callFrames?: Array<{ functionName?: string; lineNumber?: number }>
            }
          }
        }>
      }
      Page?: {
        enable: () => Promise<void>
        addScriptToEvaluateOnNewDocument: (opts: {
          source: string
        }) => Promise<unknown>
      }
    }
    await Runtime.enable()
    try {
      if (Page) {
        await Page.enable()
        await Page.addScriptToEvaluateOnNewDocument({ source: expression })
      }
    } catch {
      // optional
    }
    const result = await Runtime.evaluate({
      expression,
      returnByValue: true,
      awaitPromise: true
    })
    if (result.exceptionDetails) {
      const ed = result.exceptionDetails
      const frame = ed.stackTrace?.callFrames?.[0]
      const detail =
        ed.exception?.description ||
        (frame
          ? `${ed.text || 'Error'} @ ${frame.functionName || '?'}:${frame.lineNumber ?? '?'}`
          : ed.text) ||
        'Runtime.evaluate failed'
      throw new Error(detail)
    }
    return result.result.value
  } finally {
    await client.close().catch(() => undefined)
  }
}

export async function injectTheme(
  port: number,
  preset: ThemePreset,
  globalCss = ''
): Promise<{ ok: boolean; message: string; targets: number }> {
  const targets = await waitForTargets(port)
  const ordered = [...targets].sort((a, b) => {
    const score = (t: CDP.Target) => {
      const u = t.url || ''
      if (u.includes('avatar-overlay')) return 3
      if (u === 'app://-/index.html') return 0
      if (u.includes('index.html')) return 1
      return 2
    }
    return score(a) - score(b)
  })

  const script = buildInjectionScript(preset, globalCss)
  let success = 0
  const errors: string[] = []

  for (const target of ordered) {
    try {
      const value = (await evaluateOnTarget(port, target, script)) as {
        ok?: boolean
        error?: string
      } | null
      if (value && value.ok === false) {
        errors.push(value.error || 'inject returned ok:false')
      } else {
        success += 1
      }
    } catch (e) {
      errors.push(String(e))
    }
  }

  if (success === 0) {
    return {
      ok: false,
      message: errors.join('; ') || 'No targets injected',
      targets: targets.length
    }
  }

  return {
    ok: true,
    message:
      errors.length > 0
        ? `Injected into ${success}/${targets.length} target(s); partial: ${errors.join('; ')}`
        : `Injected into ${success}/${targets.length} target(s)`,
    targets: targets.length
  }
}

export async function resetTheme(
  port: number
): Promise<{ ok: boolean; message: string }> {
  const targets = await waitForTargets(port, 8000)
  const script = buildResetScript()
  let success = 0

  for (const target of targets) {
    try {
      await evaluateOnTarget(port, target, script)
      success += 1
    } catch {
      // continue
    }
  }

  return {
    ok: success > 0,
    message:
      success > 0
        ? `Reset on ${success} target(s)`
        : 'Failed to reset theme on any target'
  }
}

export async function isCdpReachable(port: number): Promise<boolean> {
  try {
    await CDP.List({ port, host: '127.0.0.1' })
    return true
  } catch {
    return false
  }
}
