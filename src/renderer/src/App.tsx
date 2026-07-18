import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { TitleBar } from './components/TitleBar'
import { ToastHost } from './components/ToastHost'
import { AboutPage } from './pages/AboutPage'
import { ControlPage } from './pages/ControlPage'
import { EditorPage } from './pages/EditorPage'
import { SettingsPage } from './pages/SettingsPage'
import { StudioPage } from './pages/StudioPage'
import {
  hydrateApp,
  resolvedAppTheme,
  useAppStore
} from './store/useAppStore'
import i18n from './i18n'

export default function App() {
  const ready = useAppStore((s) => s.ready)
  const page = useAppStore((s) => s.page)
  const settings = useAppStore((s) => s.settings)
  const setCodex = useAppStore((s) => s.setCodex)
  const platform = window.codexCustomizer?.platform ?? 'darwin'

  useEffect(() => {
    void hydrateApp().then(() => {
      const locale = useAppStore.getState().settings.locale
      void i18n.changeLanguage(locale)
    })
  }, [])

  useEffect(() => {
    const theme = resolvedAppTheme(settings.appTheme)
    document.documentElement.setAttribute('data-theme', theme)

    if (settings.appTheme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const onChange = () => {
        document.documentElement.setAttribute(
          'data-theme',
          mq.matches ? 'dark' : 'light'
        )
      }
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }
    return undefined
  }, [settings.appTheme])

  useEffect(() => {
    const unsub = window.codexCustomizer?.onCodexStatus((state) => {
      setCodex(state)
    })
    return () => unsub?.()
  }, [setCodex])

  if (!ready) {
    return (
      <div className="app-shell" style={{ placeItems: 'center', display: 'grid' }}>
        <div className="loading-shimmer" style={{ width: 280, height: 12 }} />
      </div>
    )
  }

  return (
    <div className={`app-shell platform-${platform === 'win32' ? 'win' : platform}`}>
      <TitleBar />
      <div className="app-body">
        <Sidebar />
        <main className="main-panel glass">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              style={{ height: '100%', minHeight: 0 }}
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            >
              {page === 'studio' && <StudioPage />}
              {page === 'editor' && <EditorPage />}
              {page === 'control' && <ControlPage />}
              {page === 'settings' && <SettingsPage />}
              {page === 'about' && <AboutPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ToastHost />
    </div>
  )
}
