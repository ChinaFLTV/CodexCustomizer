import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  IconDownload,
  IconPlay,
  IconSpark,
  IconStop,
  IconUpload
} from '../components/Icons'
import { useAppStore } from '../store/useAppStore'
import {
  displayThemeDescription,
  displayThemeName
} from '@shared/theme-presets'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 26 }
  }
}

export function StudioPage() {
  const { t } = useTranslation()
  const themes = useAppStore((s) => s.themes)
  const selectedPresetId = useAppStore((s) => s.selectedPresetId)
  const setSelectedPresetId = useAppStore((s) => s.setSelectedPresetId)
  const codex = useAppStore((s) => s.codex)
  const busy = useAppStore((s) => s.busy)
  const setBusy = useAppStore((s) => s.setBusy)
  const setCodex = useAppStore((s) => s.setCodex)
  const setThemes = useAppStore((s) => s.setThemes)
  const setPage = useAppStore((s) => s.setPage)
  const pushToast = useAppStore((s) => s.pushToast)

  const selected = useMemo(
    () => themes.find((p) => p.id === selectedPresetId) || themes[0],
    [themes, selectedPresetId]
  )

  const canInject =
    codex.status === 'connected' ||
    codex.status === 'running' ||
    codex.status === 'injecting'

  const isLive =
    codex.status === 'connected' ||
    codex.status === 'running' ||
    codex.status === 'injecting' ||
    codex.status === 'starting'

  async function handleStart() {
    setBusy(true)
    try {
      const state = await window.codexCustomizer.startCodex({
        presetId: selected?.id
      })
      setCodex(state)
      if (state.status === 'error') {
        pushToast({ type: 'error', message: state.lastError || t('toast.error') })
      } else {
        pushToast({ type: 'success', message: t('toast.started') })
      }
    } catch (e) {
      pushToast({ type: 'error', message: e instanceof Error ? e.message : t('toast.error') })
    } finally {
      setBusy(false)
    }
  }

  async function handleStop() {
    setBusy(true)
    try {
      const state = await window.codexCustomizer.stopCodex()
      setCodex(state)
      pushToast({ type: 'success', message: t('toast.stopped') })
    } catch (e) {
      pushToast({ type: 'error', message: e instanceof Error ? e.message : t('toast.error') })
    } finally {
      setBusy(false)
    }
  }

  async function handleApply() {
    if (!selected) return
    if (!canInject) {
      pushToast({ type: 'error', message: t('studio.needRunning') })
      return
    }
    setBusy(true)
    try {
      const result = await window.codexCustomizer.applyTheme(selected.id)
      const status = await window.codexCustomizer.getCodexStatus()
      setCodex(status)
      pushToast({
        type: result.ok ? 'success' : 'error',
        message: result.ok ? t('toast.applied') : result.message || t('studio.applyFail')
      })
    } catch (e) {
      pushToast({ type: 'error', message: e instanceof Error ? e.message : t('toast.error') })
    } finally {
      setBusy(false)
    }
  }

  async function handleReset() {
    setBusy(true)
    try {
      const result = await window.codexCustomizer.resetTheme()
      const status = await window.codexCustomizer.getCodexStatus()
      setCodex(status)
      pushToast({
        type: result.ok ? 'success' : 'error',
        message: result.ok ? t('toast.reset') : result.message
      })
    } catch (e) {
      pushToast({ type: 'error', message: e instanceof Error ? e.message : t('toast.error') })
    } finally {
      setBusy(false)
    }
  }

  async function handleExportSelected() {
    if (!selected) return
    setBusy(true)
    try {
      const result = await window.codexCustomizer.exportThemes({
        themeIds: [selected.id],
        includeGlobalCss: true
      })
      if (result.ok) {
        pushToast({ type: 'success', message: t('editor.exported') })
      } else if (result.message !== 'Cancelled') {
        pushToast({ type: 'error', message: result.message })
      }
    } finally {
      setBusy(false)
    }
  }

  async function handleImport() {
    setBusy(true)
    try {
      const result = await window.codexCustomizer.importThemes()
      if (result.ok) {
        setThemes(await window.codexCustomizer.listThemes())
        if (result.themes[0]) setSelectedPresetId(result.themes[0].id)
        pushToast({
          type: 'success',
          message: t('editor.imported', { count: result.imported })
        })
      } else if (result.message !== 'Cancelled') {
        pushToast({ type: 'error', message: result.message })
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="panel-scroll">
      <header className="page-header">
        <h1>{t('studio.title')}</h1>
        <p>{t('studio.subtitle')}</p>
      </header>

      {codex.lastError && <div className="error-banner">{codex.lastError}</div>}

      <div className="studio-actions">
        {!isLive ? (
          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void handleStart()}>
            <IconPlay width={16} height={16} />
            {t('actions.start')}
          </button>
        ) : (
          <button type="button" className="btn btn-danger" disabled={busy} onClick={() => void handleStop()}>
            <IconStop width={16} height={16} />
            {t('actions.stop')}
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy || !selected}
          onClick={() => void handleApply()}
        >
          <IconSpark width={16} height={16} />
          {t('actions.apply')}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy || !canInject}
          onClick={() => void handleReset()}
        >
          {t('actions.reset')}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy}
          onClick={() => void handleImport()}
        >
          <IconUpload width={16} height={16} />
          {t('editor.import')}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy || !selected}
          onClick={() => void handleExportSelected()}
        >
          <IconDownload width={16} height={16} />
          {t('editor.exportSelected')}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setPage('editor')}
        >
          {t('nav.editor')}
        </button>
      </div>

      <motion.div className="preset-grid" variants={container} initial="hidden" animate="show">
        {themes.map((preset) => {
          const isSelected = selected?.id === preset.id
          const isActive = codex.activePresetId === preset.id
          return (
            <motion.button
              key={preset.id}
              type="button"
              className={`preset-card ${isSelected ? 'selected' : ''}`}
              variants={item}
              onClick={() => setSelectedPresetId(preset.id)}
              onDoubleClick={() => void handleApply()}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="preset-preview"
                style={{ background: preset.preview.background }}
              >
                <span
                  className="preset-preview-orb"
                  style={{
                    width: 90,
                    height: 90,
                    left: -10,
                    top: -20,
                    background: preset.preview.primary
                  }}
                />
                <span
                  className="preset-preview-orb"
                  style={{
                    width: 70,
                    height: 70,
                    right: -8,
                    bottom: -16,
                    background: preset.preview.secondary
                  }}
                />
                <span className="preset-preview-glass" />
              </div>
              <h3 className="preset-name">
                {displayThemeName(preset, t)}
                {isActive && <span className="badge">{t('studio.active')}</span>}
                {preset.source && preset.source !== 'builtin' && (
                  <span className="badge" style={{ opacity: 0.85 }}>
                    {preset.source === 'imported' ? t('editor.badgeImported') : t('editor.badgeCustom')}
                  </span>
                )}
              </h3>
              <p className="preset-desc">{displayThemeDescription(preset, t)}</p>
              <div className="preset-meta">
                <span>
                  {t('studio.glass')}: {preset.tokens.blur}px
                </span>
                <span>
                  {t('studio.radius')}: {preset.tokens.radius}px
                </span>
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      {selected && (
        <div className="detail-panel">
          <div className="card">
            <h3>{displayThemeName(selected, t)}</h3>
            <p style={{ marginBottom: 14 }}>{displayThemeDescription(selected, t)}</p>
            <div className="swatch-row">
              {[
                selected.tokens.accent,
                selected.tokens.accentSecondary,
                selected.tokens.bgBase,
                selected.tokens.bgElevated,
                selected.tokens.success,
                selected.tokens.warning,
                selected.tokens.danger
              ].map((c, i) => (
                <span key={i} className="swatch" style={{ background: c }} title={c} />
              ))}
            </div>
          </div>
          <div className="card">
            <h3>{t('studio.tokens')}</h3>
            <dl className="kv-grid" style={{ marginTop: 12 }}>
              <dt>accent</dt>
              <dd>{selected.tokens.accent}</dd>
              <dt>bgBase</dt>
              <dd>{selected.tokens.bgBase}</dd>
              <dt>blur</dt>
              <dd>{selected.tokens.blur}px</dd>
              <dt>radius</dt>
              <dd>{selected.tokens.radius}px</dd>
              <dt>saturation</dt>
              <dd>{selected.tokens.saturation}</dd>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
