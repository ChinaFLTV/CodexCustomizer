import { useTranslation } from 'react-i18next'
import { IconClose, IconMaximize, IconMinimize } from './Icons'

export function TitleBar() {
  const { t } = useTranslation()
  const platform = window.codexCustomizer?.platform ?? 'darwin'
  const showWinControls = platform === 'win32' || platform === 'linux'

  return (
    <header className="titlebar drag-region">
      <div className="titlebar-brand">
        <div className="brand-mark" />
        <span className="brand-title">{t('app.name')}</span>
        <span className="brand-tagline">{t('app.tagline')}</span>
      </div>
      {showWinControls && (
        <div className="window-controls no-drag">
          <button
            type="button"
            className="win-btn"
            onClick={() => void window.codexCustomizer.windowMinimize()}
            aria-label="Minimize"
          >
            <IconMinimize />
          </button>
          <button
            type="button"
            className="win-btn"
            onClick={() => void window.codexCustomizer.windowMaximize()}
            aria-label="Maximize"
          >
            <IconMaximize />
          </button>
          <button
            type="button"
            className="win-btn close"
            onClick={() => void window.codexCustomizer.windowClose()}
            aria-label="Close"
          >
            <IconClose />
          </button>
        </div>
      )}
    </header>
  )
}
