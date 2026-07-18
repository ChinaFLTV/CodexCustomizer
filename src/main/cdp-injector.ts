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
          icons.forEach((svg) => {
            if (!svg) return;
            // Luna / XP caption: keep white glyphs — don't remint to muted icon color
            if (svg.closest('header.app-header-tint, .app-header-tint')) {
              svg.style.setProperty('color', '#FFFFFF', 'important');
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
            if (bgMix) el.style.setProperty('background-color', bgMix, 'important');
            el.style.setProperty('opacity', '1', 'important');
            el.style.setProperty('backdrop-filter', 'none', 'important');
            el.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
            // No left accent bar — reads as broken UI (bright strip on rounded card).
            // Attached banners (Full access): no ring either (seams the composer).
            if (attached) {
              el.style.setProperty('border-color', 'transparent', 'important');
              el.style.setProperty('border-width', '0', 'important');
              el.style.setProperty('box-shadow', 'none', 'important');
              el.style.setProperty('border-bottom-left-radius', '0', 'important');
              el.style.setProperty('border-bottom-right-radius', '0', 'important');
            } else {
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
            // Luna caption uses intentional white text — remint would paint it dark
            if (el.closest('header.app-header-tint, .app-header-tint')) {
              // Silver XP chips inside caption keep dark text
              if (el.closest('button, [class*="border"]')) return;
              el.style.setProperty('color', '#FFFFFF', 'important');
              el.style.setProperty('-webkit-text-fill-color', '#FFFFFF', 'important');
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
