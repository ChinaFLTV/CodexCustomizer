import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconPlay, IconRefresh, IconStop } from '../components/Icons'
import { updateSettings, useAppStore } from '../store/useAppStore'

export function ControlPage() {
  const { t } = useTranslation()
  const settings = useAppStore((s) => s.settings)
  const codex = useAppStore((s) => s.codex)
  const busy = useAppStore((s) => s.busy)
  const setBusy = useAppStore((s) => s.setBusy)
  const setCodex = useAppStore((s) => s.setCodex)
  const setSettings = useAppStore((s) => s.setSettings)
  const pushToast = useAppStore((s) => s.pushToast)
  const selectedPresetId = useAppStore((s) => s.selectedPresetId)

  const [pathDraft, setPathDraft] = useState(settings.codexPath || '')
  const [portDraft, setPortDraft] = useState(String(settings.debuggingPort))

  // Stop only when CDP session is live / starting — not when product runs without CDP
  const showStop =
    codex.status === 'connected' ||
    codex.status === 'injecting' ||
    codex.status === 'starting'

  async function handleDetect() {
    setBusy(true)
    try {
      const result = await window.codexCustomizer.detectCodex()
      if (result.path) {
        setPathDraft(result.path)
        const next = await updateSettings({ codexPath: result.path })
        setSettings(next)
        pushToast({ type: 'success', message: result.path })
      } else {
        pushToast({ type: 'error', message: t('studio.needRunning') })
      }
    } finally {
      setBusy(false)
    }
  }

  async function handleBrowse() {
    const path = await window.codexCustomizer.pickCodexPath()
    if (path) {
      setPathDraft(path)
      const next = await updateSettings({ codexPath: path })
      setSettings(next)
    }
  }

  async function handleSavePath() {
    const port = Number(portDraft)
    if (!Number.isFinite(port) || port < 1024 || port > 65535) {
      pushToast({ type: 'error', message: 'Port: 1024–65535' })
      return
    }
    const next = await updateSettings({
      codexPath: pathDraft || null,
      debuggingPort: port
    })
    setSettings(next)
    pushToast({ type: 'success', message: t('toast.saved') })
  }

  async function handleStart() {
    setBusy(true)
    try {
      if (pathDraft !== settings.codexPath || Number(portDraft) !== settings.debuggingPort) {
        await updateSettings({
          codexPath: pathDraft || null,
          debuggingPort: Number(portDraft) || settings.debuggingPort
        })
      }
      const state = await window.codexCustomizer.startCodex({
        path: pathDraft || undefined,
        presetId: selectedPresetId || undefined
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
      setCodex(await window.codexCustomizer.stopCodex())
      pushToast({ type: 'success', message: t('toast.stopped') })
    } finally {
      setBusy(false)
    }
  }

  async function handleRefresh() {
    setCodex(await window.codexCustomizer.getCodexStatus())
  }

  async function toggleAutoInject() {
    const next = await updateSettings({ autoInjectOnStart: !settings.autoInjectOnStart })
    setSettings(next)
  }

  return (
    <div className="panel-scroll">
      <header className="page-header">
        <h1>{t('control.title')}</h1>
        <p>{t('control.subtitle')}</p>
      </header>

      {codex.lastError && <div className="error-banner">{codex.lastError}</div>}

      <div className="studio-actions">
        {!showStop ? (
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
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => void handleRefresh()}>
          <IconRefresh width={16} height={16} />
          {t('actions.refresh')}
        </button>
      </div>

      <div className="card">
        <h3>{t('status.codex')}</h3>
        <dl className="kv-grid" style={{ marginTop: 12 }}>
          <dt>{t('status.codex')}</dt>
          <dd>
            <span className={`status-dot ${codex.status}`} style={{ display: 'inline-block', marginRight: 8 }} />
            {t(`status.${codex.status}`)}
          </dd>
          <dt>{t('control.pid')}</dt>
          <dd>{codex.pid ?? '—'}</dd>
          <dt>{t('status.cdp')}</dt>
          <dd>{codex.debuggingPort ?? settings.debuggingPort}</dd>
          <dt>{t('status.preset')}</dt>
          <dd>{codex.activePresetId ?? t('status.none')}</dd>
          <dt>{t('control.lastInjected')}</dt>
          <dd>{codex.injectedAt ? new Date(codex.injectedAt).toLocaleString() : '—'}</dd>
          <dt>{t('control.executable')}</dt>
          <dd>{codex.executablePath ?? settings.codexPath ?? '—'}</dd>
        </dl>
      </div>

      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="codex-path">{t('control.path')}</label>
            <div className="input-row">
              <input
                id="codex-path"
                className="input"
                value={pathDraft}
                onChange={(e) => setPathDraft(e.target.value)}
                placeholder="/Applications/ChatGPT.app"
                spellCheck={false}
              />
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => void handleBrowse()}>
                {t('actions.browse')}
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => void handleDetect()}>
                {t('actions.detect')}
              </button>
            </div>
            <p className="hint">{t('control.pathHint')}</p>
          </div>

          <div className="field">
            <label htmlFor="cdp-port">{t('control.port')}</label>
            <input
              id="cdp-port"
              className="input"
              value={portDraft}
              onChange={(e) => setPortDraft(e.target.value.replace(/[^\d]/g, ''))}
              inputMode="numeric"
              style={{ maxWidth: 180 }}
            />
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.autoInjectOnStart}
              onChange={() => void toggleAutoInject()}
            />
            <span className="toggle-label">{t('control.autoInject')}</span>
          </label>

          <div>
            <button type="button" className="btn btn-primary" onClick={() => void handleSavePath()}>
              {t('actions.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
