import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAppStore, type PageId } from '../store/useAppStore'
import { IconCode, IconInfo, IconPalette, IconPower, IconSettings } from './Icons'

const items: { id: PageId; icon: typeof IconPalette; labelKey: string }[] = [
  { id: 'studio', icon: IconPalette, labelKey: 'nav.studio' },
  { id: 'editor', icon: IconCode, labelKey: 'nav.editor' },
  { id: 'control', icon: IconPower, labelKey: 'nav.control' },
  { id: 'settings', icon: IconSettings, labelKey: 'nav.settings' },
  { id: 'about', icon: IconInfo, labelKey: 'nav.about' }
]

export function Sidebar() {
  const { t } = useTranslation()
  const page = useAppStore((s) => s.page)
  const setPage = useAppStore((s) => s.setPage)
  const codex = useAppStore((s) => s.codex)

  return (
    <aside className="sidebar glass">
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item) => {
          const active = page === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${active ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 16,
                    background: 'var(--accent-soft)',
                    zIndex: -1
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <Icon className="icon" />
              <span>{t(item.labelKey)}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="status-pill" title={codex.lastError || undefined}>
          <span className={`status-dot ${codex.status}`} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {t(`status.${codex.status}`)}
          </span>
        </div>
      </div>
    </aside>
  )
}
