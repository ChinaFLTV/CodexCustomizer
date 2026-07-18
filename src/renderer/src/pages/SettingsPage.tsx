import { useTranslation } from 'react-i18next'
import { localeOptions } from '../i18n'
import {
  changeAppTheme,
  changeLocale,
  useAppStore
} from '../store/useAppStore'
import type { AppThemeMode, LocaleCode } from '@shared/types'
import i18n from '../i18n'

export function SettingsPage() {
  const { t } = useTranslation()
  const settings = useAppStore((s) => s.settings)
  const pushToast = useAppStore((s) => s.pushToast)

  async function onLocale(code: LocaleCode) {
    await changeLocale(code)
    await i18n.changeLanguage(code)
    pushToast({ type: 'success', message: t('toast.saved') })
  }

  async function onTheme(mode: AppThemeMode) {
    await changeAppTheme(mode)
    pushToast({ type: 'success', message: t('toast.saved') })
  }

  return (
    <div className="panel-scroll">
      <header className="page-header">
        <h1>{t('settings.title')}</h1>
        <p>{t('settings.subtitle')}</p>
      </header>

      <div className="card">
        <h3>{t('settings.appearance')}</h3>
        <div className="form-grid" style={{ marginTop: 14 }}>
          <div className="field">
            <label>{t('settings.language')}</label>
            <div className="segmented" role="group">
              {localeOptions.map((loc) => (
                <button
                  key={loc.code}
                  type="button"
                  className={settings.locale === loc.code ? 'active' : ''}
                  onClick={() => void onLocale(loc.code)}
                  title={loc.label}
                >
                  {loc.native}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>{t('settings.appTheme')}</label>
            <div className="segmented" role="group">
              {(
                [
                  ['light', 'settings.themeLight'],
                  ['dark', 'settings.themeDark'],
                  ['system', 'settings.themeSystem']
                ] as const
              ).map(([mode, key]) => (
                <button
                  key={mode}
                  type="button"
                  className={settings.appTheme === mode ? 'active' : ''}
                  onClick={() => void onTheme(mode)}
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>{t('settings.behavior')}</h3>
        <p style={{ marginTop: 8 }}>{t('control.autoInject')}</p>
        <p className="hint" style={{ marginTop: 8 }}>
          {t('about.note')}
        </p>
      </div>
    </div>
  )
}
