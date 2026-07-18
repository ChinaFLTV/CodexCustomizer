import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CssEditor } from '../components/CssEditor'
import {
  IconCode,
  IconDownload,
  IconSpark,
  IconTrash,
  IconUpload
} from '../components/Icons'
import { useAppStore } from '../store/useAppStore'
import {
  displayThemeDescription,
  displayThemeName
} from '@shared/theme-presets'
import type { ThemePreset, ThemeTokens } from '@shared/types'
import { DEFAULT_GLOBAL_CSS } from '@shared/defaults'

type EditorTab = 'global' | 'theme'

const TOKEN_FIELDS: { key: keyof ThemeTokens; label: string; type: 'color' | 'text' | 'number' }[] = [
  { key: 'accent', label: 'accent', type: 'color' },
  { key: 'accentSecondary', label: 'accentSecondary', type: 'color' },
  { key: 'bgBase', label: 'bgBase', type: 'color' },
  { key: 'bgElevated', label: 'bgElevated', type: 'text' },
  { key: 'bgGlass', label: 'bgGlass', type: 'text' },
  { key: 'textPrimary', label: 'textPrimary', type: 'color' },
  { key: 'textSecondary', label: 'textSecondary', type: 'text' },
  { key: 'border', label: 'border', type: 'text' },
  { key: 'success', label: 'success', type: 'color' },
  { key: 'warning', label: 'warning', type: 'color' },
  { key: 'danger', label: 'danger', type: 'color' },
  { key: 'fontFamily', label: 'fontFamily', type: 'text' },
  { key: 'radius', label: 'radius', type: 'number' },
  { key: 'blur', label: 'blur', type: 'number' },
  { key: 'saturation', label: 'saturation', type: 'number' }
]

function isEditable(theme: ThemePreset | undefined): boolean {
  return Boolean(theme && theme.source !== 'builtin')
}

export function EditorPage() {
  const { t } = useTranslation()
  const themes = useAppStore((s) => s.themes)
  const setThemes = useAppStore((s) => s.setThemes)
  const selectedPresetId = useAppStore((s) => s.selectedPresetId)
  const setSelectedPresetId = useAppStore((s) => s.setSelectedPresetId)
  const codex = useAppStore((s) => s.codex)
  const setCodex = useAppStore((s) => s.setCodex)
  const busy = useAppStore((s) => s.busy)
  const setBusy = useAppStore((s) => s.setBusy)
  const pushToast = useAppStore((s) => s.pushToast)
  const settings = useAppStore((s) => s.settings)
  const setSettings = useAppStore((s) => s.setSettings)

  const [tab, setTab] = useState<EditorTab>('global')
  const [globalCss, setGlobalCss] = useState(settings.globalCustomCss || '')
  const [dirtyGlobal, setDirtyGlobal] = useState(false)

  // Theme draft state
  const selected = useMemo(
    () => themes.find((p) => p.id === selectedPresetId) || themes[0],
    [themes, selectedPresetId]
  )
  const [draftName, setDraftName] = useState('')
  const [draftDesc, setDraftDesc] = useState('')
  const [draftCss, setDraftCss] = useState('')
  const [draftTokens, setDraftTokens] = useState<ThemeTokens | null>(null)
  const [dirtyTheme, setDirtyTheme] = useState(false)

  useEffect(() => {
    void window.codexCustomizer.getGlobalCss().then((css) => {
      setGlobalCss(css)
      setDirtyGlobal(false)
    })
  }, [])

  useEffect(() => {
    if (!selected) return
    setDraftName(displayThemeName(selected, t))
    setDraftDesc(displayThemeDescription(selected, t))
    setDraftCss(selected.customCss || '')
    setDraftTokens({ ...selected.tokens })
    setDirtyTheme(false)
  }, [selected?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const canInject =
    codex.status === 'connected' ||
    codex.status === 'running' ||
    codex.status === 'injecting'

  const editable = isEditable(selected)

  async function refreshThemes(selectId?: string) {
    const list = await window.codexCustomizer.listThemes()
    setThemes(list)
    if (selectId) setSelectedPresetId(selectId)
  }

  async function handleSaveGlobal() {
    setBusy(true)
    try {
      const saved = await window.codexCustomizer.setGlobalCss(globalCss)
      setGlobalCss(saved)
      setDirtyGlobal(false)
      const s = await window.codexCustomizer.getSettings()
      setSettings(s)
      pushToast({ type: 'success', message: t('toast.saved') })
    } catch (e) {
      pushToast({ type: 'error', message: e instanceof Error ? e.message : t('toast.error') })
    } finally {
      setBusy(false)
    }
  }

  async function handleApplyWithGlobal() {
    if (!selected) return
    if (dirtyGlobal) {
      await window.codexCustomizer.setGlobalCss(globalCss)
      setDirtyGlobal(false)
    }
    if (!canInject) {
      pushToast({ type: 'error', message: t('studio.needRunning') })
      return
    }
    setBusy(true)
    try {
      const result = await window.codexCustomizer.applyTheme(selected.id)
      setCodex(await window.codexCustomizer.getCodexStatus())
      pushToast({
        type: result.ok ? 'success' : 'error',
        message: result.ok ? t('toast.applied') : result.message
      })
    } finally {
      setBusy(false)
    }
  }

  async function handleSaveTheme() {
    if (!selected || !draftTokens) return
    if (!editable) {
      // duplicate then save edits as new custom theme
      await handleDuplicateAndSave()
      return
    }
    setBusy(true)
    try {
      const saved = await window.codexCustomizer.saveTheme({
        id: selected.id,
        name: draftName,
        description: draftDesc,
        tokens: draftTokens,
        customCss: draftCss,
        preview: {
          primary: draftTokens.accent,
          secondary: draftTokens.accentSecondary,
          background: draftTokens.bgBase
        }
      })
      await refreshThemes(saved.id)
      setDirtyTheme(false)
      pushToast({ type: 'success', message: t('toast.saved') })
    } catch (e) {
      pushToast({ type: 'error', message: e instanceof Error ? e.message : t('toast.error') })
    } finally {
      setBusy(false)
    }
  }

  async function handleDuplicateAndSave() {
    if (!selected || !draftTokens) return
    setBusy(true)
    try {
      const saved = await window.codexCustomizer.saveTheme({
        name: draftName.includes('(copy)') ? draftName : `${draftName} (custom)`,
        description: draftDesc,
        tokens: draftTokens,
        customCss: draftCss,
        baseId: selected.id,
        preview: {
          primary: draftTokens.accent,
          secondary: draftTokens.accentSecondary,
          background: draftTokens.bgBase
        }
      })
      await refreshThemes(saved.id)
      setDirtyTheme(false)
      pushToast({ type: 'success', message: t('editor.duplicated') })
    } catch (e) {
      pushToast({ type: 'error', message: e instanceof Error ? e.message : t('toast.error') })
    } finally {
      setBusy(false)
    }
  }

  async function handleDuplicate() {
    if (!selected) return
    setBusy(true)
    try {
      const created = await window.codexCustomizer.duplicateTheme(selected.id)
      await refreshThemes(created.id)
      setTab('theme')
      pushToast({ type: 'success', message: t('editor.duplicated') })
    } catch (e) {
      pushToast({ type: 'error', message: e instanceof Error ? e.message : t('toast.error') })
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!selected || !editable) return
    if (!window.confirm(t('editor.confirmDelete'))) return
    setBusy(true)
    try {
      const result = await window.codexCustomizer.deleteTheme(selected.id)
      if (!result.ok) {
        pushToast({ type: 'error', message: result.message })
        return
      }
      await refreshThemes()
      pushToast({ type: 'success', message: t('editor.deleted') })
    } finally {
      setBusy(false)
    }
  }

  async function handleExport(scope: 'selected' | 'custom' | 'all') {
    setBusy(true)
    try {
      let themeIds: string[] | null = null
      if (scope === 'selected' && selected) themeIds = [selected.id]
      else if (scope === 'custom') {
        themeIds = themes.filter((th) => th.source !== 'builtin').map((th) => th.id)
      }
      const result = await window.codexCustomizer.exportThemes({
        themeIds,
        includeGlobalCss: true
      })
      if (result.ok) {
        pushToast({
          type: 'success',
          message: result.path
            ? `${t('editor.exported')}: ${result.path}`
            : t('editor.exported')
        })
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
      const result = await window.codexCustomizer.importThemes({
        replaceGlobalCss: false
      })
      if (result.ok) {
        await refreshThemes(result.themes[0]?.id)
        const s = await window.codexCustomizer.getSettings()
        setSettings(s)
        setGlobalCss(s.globalCustomCss || '')
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

  async function handleImportWithCss() {
    setBusy(true)
    try {
      const result = await window.codexCustomizer.importThemes({
        replaceGlobalCss: true
      })
      if (result.ok) {
        await refreshThemes(result.themes[0]?.id)
        const s = await window.codexCustomizer.getSettings()
        setSettings(s)
        setGlobalCss(s.globalCustomCss || '')
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

  function updateToken<K extends keyof ThemeTokens>(key: K, value: ThemeTokens[K]) {
    if (!draftTokens) return
    setDraftTokens({ ...draftTokens, [key]: value })
    setDirtyTheme(true)
  }

  return (
    <div className="panel-scroll">
      <header className="page-header">
        <h1>{t('editor.title')}</h1>
        <p>{t('editor.subtitle')}</p>
      </header>

      <div className="studio-actions" style={{ justifyContent: 'space-between' }}>
        <div className="segmented" role="tablist">
          <button
            type="button"
            className={tab === 'global' ? 'active' : ''}
            onClick={() => setTab('global')}
          >
            <IconCode width={14} height={14} style={{ marginRight: 4, verticalAlign: -2 }} />
            {t('editor.tabGlobal')}
          </button>
          <button
            type="button"
            className={tab === 'theme' ? 'active' : ''}
            onClick={() => setTab('theme')}
          >
            {t('editor.tabTheme')}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={busy}
            onClick={() => void handleImport()}
          >
            <IconUpload width={14} height={14} />
            {t('editor.import')}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={busy}
            onClick={() => void handleExport('selected')}
          >
            <IconDownload width={14} height={14} />
            {t('editor.exportSelected')}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={busy}
            onClick={() => void handleExport('custom')}
          >
            <IconDownload width={14} height={14} />
            {t('editor.exportCustom')}
          </button>
        </div>
      </div>

      {tab === 'global' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0 }}>{t('editor.globalCss')}</h3>
              <p className="hint" style={{ marginTop: 6 }}>
                {t('editor.globalCssHint')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() => {
                  setGlobalCss(DEFAULT_GLOBAL_CSS)
                  setDirtyGlobal(true)
                }}
              >
                {t('editor.resetTemplate')}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={busy || !dirtyGlobal}
                onClick={() => void handleSaveGlobal()}
              >
                {t('actions.save')}
                {dirtyGlobal ? ' *' : ''}
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={busy}
                onClick={() => void handleApplyWithGlobal()}
              >
                <IconSpark width={14} height={14} />
                {t('editor.saveAndInject')}
              </button>
            </div>
          </div>
          <CssEditor
            value={globalCss}
            onChange={(v) => {
              setGlobalCss(v)
              setDirtyGlobal(true)
            }}
            minHeight={360}
            placeholder={t('editor.cssPlaceholder')}
          />
        </div>
      )}

      {tab === 'theme' && selected && draftTokens && (
        <>
          <div className="card">
            <div className="form-grid">
              <div className="field">
                <label htmlFor="theme-select">{t('editor.selectTheme')}</label>
                <select
                  id="theme-select"
                  className="select"
                  value={selected.id}
                  onChange={(e) => setSelectedPresetId(e.target.value)}
                >
                  <optgroup label={t('editor.builtinGroup')}>
                    {themes
                      .filter((th) => th.source === 'builtin' || !th.source)
                      .map((th) => (
                        <option key={th.id} value={th.id}>
                          {displayThemeName(th, t)}
                        </option>
                      ))}
                  </optgroup>
                  {themes.some((th) => th.source && th.source !== 'builtin') && (
                    <optgroup label={t('editor.customGroup')}>
                      {themes
                        .filter((th) => th.source && th.source !== 'builtin')
                        .map((th) => (
                          <option key={th.id} value={th.id}>
                            {displayThemeName(th, t)}
                            {th.source === 'imported' ? ' ⬇' : ''}
                          </option>
                        ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div className="field">
                <label htmlFor="theme-name">{t('editor.themeName')}</label>
                <input
                  id="theme-name"
                  className="input"
                  value={draftName}
                  onChange={(e) => {
                    setDraftName(e.target.value)
                    setDirtyTheme(true)
                  }}
                />
              </div>

              <div className="field">
                <label htmlFor="theme-desc">{t('editor.themeDesc')}</label>
                <input
                  id="theme-desc"
                  className="input"
                  value={draftDesc}
                  onChange={(e) => {
                    setDraftDesc(e.target.value)
                    setDirtyTheme(true)
                  }}
                />
              </div>

              {!editable && (
                <p className="hint">{t('editor.builtinReadonly')}</p>
              )}

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={busy || !dirtyTheme}
                  onClick={() => void handleSaveTheme()}
                >
                  {editable ? t('actions.save') : t('editor.saveAsCustom')}
                  {dirtyTheme ? ' *' : ''}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={busy}
                  onClick={() => void handleDuplicate()}
                >
                  {t('editor.duplicate')}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={busy || !canInject}
                  onClick={() => void handleApplyWithGlobal()}
                >
                  <IconSpark width={14} height={14} />
                  {t('actions.apply')}
                </button>
                {editable && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    disabled={busy}
                    onClick={() => void handleDelete()}
                  >
                    <IconTrash width={14} height={14} />
                    {t('editor.delete')}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="detail-panel">
            <div className="card">
              <h3>{t('studio.tokens')}</h3>
              <div className="token-grid" style={{ marginTop: 12 }}>
                {TOKEN_FIELDS.map((field) => (
                  <label key={field.key} className="token-field">
                    <span>{field.label}</span>
                    {field.type === 'color' && isHexColor(String(draftTokens[field.key])) ? (
                      <div className="token-color-row">
                        <input
                          type="color"
                          value={toHexColor(String(draftTokens[field.key]))}
                          onChange={(e) => updateToken(field.key, e.target.value as never)}
                        />
                        <input
                          className="input"
                          value={String(draftTokens[field.key])}
                          onChange={(e) => updateToken(field.key, e.target.value as never)}
                        />
                      </div>
                    ) : (
                      <input
                        className="input"
                        type={field.type === 'number' ? 'number' : 'text'}
                        step={field.key === 'saturation' ? 0.05 : 1}
                        value={String(draftTokens[field.key])}
                        onChange={(e) => {
                          if (field.type === 'number') {
                            updateToken(field.key, Number(e.target.value) as never)
                          } else {
                            updateToken(field.key, e.target.value as never)
                          }
                        }}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>{t('editor.themeCss')}</h3>
              <p className="hint" style={{ marginBottom: 10 }}>
                {t('editor.themeCssHint')}
              </p>
              <CssEditor
                value={draftCss}
                onChange={(v) => {
                  setDraftCss(v)
                  setDirtyTheme(true)
                }}
                minHeight={320}
                placeholder={t('editor.cssPlaceholder')}
              />
            </div>
          </div>
        </>
      )}

      <div className="card" style={{ marginTop: 4 }}>
        <h3>{t('editor.ioTitle')}</h3>
        <p className="hint" style={{ marginTop: 6, marginBottom: 12 }}>
          {t('editor.ioHint')}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={busy}
            onClick={() => void handleImport()}
          >
            <IconUpload width={14} height={14} />
            {t('editor.import')}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={busy}
            onClick={() => void handleImportWithCss()}
          >
            <IconUpload width={14} height={14} />
            {t('editor.importWithCss')}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={busy}
            onClick={() => void handleExport('all')}
          >
            <IconDownload width={14} height={14} />
            {t('editor.exportAll')}
          </button>
        </div>
      </div>
    </div>
  )
}

function isHexColor(v: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim())
}

function toHexColor(v: string): string {
  const s = v.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(s)) return s
  if (/^#[0-9a-fA-F]{3}$/.test(s)) {
    return `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`
  }
  return '#000000'
}
