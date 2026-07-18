import { useTranslation } from 'react-i18next'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="panel-scroll">
      <header className="page-header">
        <h1>{t('about.title')}</h1>
        <p>{t('app.tagline')}</p>
      </header>

      <div className="card">
        <h3>{t('about.principle')}</h3>
        <p style={{ marginTop: 8 }}>{t('about.principleBody')}</p>
      </div>

      <div className="card">
        <h3>{t('about.stack')}</h3>
        <p style={{ marginTop: 8 }}>{t('about.stackBody')}</p>
      </div>

      <div className="card">
        <h3>{t('about.version')}</h3>
        <p style={{ marginTop: 8 }}>1.0.0</p>
        <p className="hint" style={{ marginTop: 10 }}>
          {t('about.note')}
        </p>
      </div>

      <div
        className="card"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, transparent), color-mix(in srgb, var(--accent-2) 14%, transparent))'
        }}
      >
        <h3>{t('about.flowTitle')}</h3>
        <ol
          className="about-flow-list"
          style={{
            margin: '10px 0 0',
            paddingLeft: 18,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            fontSize: 13
          }}
        >
          <li>{t('about.flow1')}</li>
          <li>{t('about.flow2')}</li>
          <li>{t('about.flow3')}</li>
          <li>{t('about.flow4')}</li>
          <li>{t('about.flow5')}</li>
        </ol>
      </div>
    </div>
  )
}
