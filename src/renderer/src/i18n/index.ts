import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from './locales/zh-CN'
import en from './locales/en'
import fr from './locales/fr'
import ja from './locales/ja'
import de from './locales/de'
import type { LocaleCode } from '@shared/types'

export const resources = {
  'zh-CN': { translation: zhCN },
  en: { translation: en },
  fr: { translation: fr },
  ja: { translation: ja },
  de: { translation: de }
} as const

export const localeOptions: { code: LocaleCode; label: string; native: string }[] = [
  { code: 'zh-CN', label: 'Chinese (Simplified)', native: '简体中文' },
  { code: 'en', label: 'English', native: 'English' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
  { code: 'de', label: 'German', native: 'Deutsch' }
]

export function initI18n(locale: LocaleCode = 'zh-CN'): typeof i18n {
  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      returnNull: false
    })
  } else {
    void i18n.changeLanguage(locale)
  }
  return i18n
}

export default i18n
