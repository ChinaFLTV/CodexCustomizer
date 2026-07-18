export default {
  app: {
    name: 'Codex Customizer',
    tagline: 'Verleihen Sie Codex eine elegante visuelle Identität'
  },
  nav: {
    studio: 'Themen-Studio',
    editor: 'CSS-Editor',
    control: 'Laufzeit',
    settings: 'Einstellungen',
    about: 'Über'
  },
  status: {
    stopped: 'Gestoppt',
    starting: 'Startet…',
    running: 'Läuft',
    injecting: 'Injiziert…',
    connected: 'Verbunden',
    error: 'Fehler',
    codex: 'Codex-Status',
    cdp: 'CDP-Debug-Port',
    preset: 'Aktives Thema',
    none: 'Keins'
  },
  actions: {
    start: 'Codex starten',
    stop: 'Codex stoppen',
    apply: 'Thema anwenden',
    preview: 'Vorschau injizieren',
    reset: 'Standard wiederherstellen',
    detect: 'Automatisch erkennen',
    browse: 'Durchsuchen…',
    save: 'Speichern',
    retry: 'Erneut versuchen',
    refresh: 'Status aktualisieren'
  },
  studio: {
    title: 'Themen-Presets',
    subtitle: 'Wählen Sie eine raffinierte Palette und injizieren Sie sie via CDP in Codex',
    applySuccess: 'Thema erfolgreich injiziert',
    applyFail: 'Injektion fehlgeschlagen',
    needRunning: 'Starten Sie Codex aus dieser App, um Remote-Debugging zu aktivieren',
    active: 'Aktiv',
    tokens: 'Farb-Tokens',
    glass: 'Glas-Unschärfe',
    radius: 'Radius'
  },
  editor: {
    title: 'Eigenes CSS & Themenpakete',
    subtitle: 'Globales CSS und Tokens bearbeiten, Themen importieren / exportieren',
    tabGlobal: 'Globales CSS',
    tabTheme: 'Themen-Editor',
    globalCss: 'Globales Custom-CSS',
    globalCssHint: 'Wird nach jeder Injektion angehängt. --cc-*-Variablen verfügbar.',
    themeCss: 'Themen-CSS',
    themeCssHint: 'Zusätzliche Styles nur mit dem aktuellen Thema.',
    cssPlaceholder: '/* CSS hier schreiben… */',
    selectTheme: 'Thema wählen',
    themeName: 'Themenname',
    themeDesc: 'Beschreibung',
    builtinGroup: 'Integriert',
    customGroup: 'Benutzerdefiniert / importiert',
    builtinReadonly: 'Integrierte Themen sind schreibgeschützt. Speichern erzeugt eine Kopie.',
    saveAsCustom: 'Als benutzerdefiniert speichern',
    duplicate: 'Duplizieren',
    duplicated: 'Benutzerdefinierte Kopie erstellt',
    delete: 'Löschen',
    deleted: 'Thema gelöscht',
    confirmDelete: 'Dieses benutzerdefinierte Thema löschen? Unwiderruflich.',
    saveAndInject: 'Speichern & injizieren',
    resetTemplate: 'Vorlage zurücksetzen',
    import: 'Importieren',
    importWithCss: 'Importieren (mit globalem CSS)',
    exportSelected: 'Auswahl exportieren',
    exportCustom: 'Eigene exportieren',
    exportAll: 'Alle exportieren',
    exported: 'Thema exportiert',
    imported: '{{count}} Thema/Themen importiert',
    badgeCustom: 'Eigen',
    badgeImported: 'Importiert',
    ioTitle: 'Import / Export',
    ioHint: 'Themenpakete sind JSON (.codex-theme.json), ggf. mit mehreren Themen und optionalem globalem CSS.'
  },
  control: {
    title: 'Laufzeit-Konsole',
    subtitle: 'Codex starten/stoppen und die CDP-Injektionsverbindung verwalten',
    path: 'ChatGPT- / Codex-Pfad',
    pathHint:
      'Unterstützt ChatGPT.app, Codex.app, Binary oder .exe. Das neue Codex-Desktop ist in ChatGPT.app integriert. Start vorzugsweise aus dieser App für den Debug-Port.',
    port: 'Remote-Debugging-Port',
    autoInject: 'Letztes Thema beim Start automatisch injizieren',
    lastInjected: 'Zuletzt injiziert',
    pid: 'Prozess-PID',
    executable: 'Executable'
  },
  settings: {
    title: 'Einstellungen',
    subtitle: 'Sprache, Erscheinungsbild und Verhalten',
    language: 'Oberflächensprache',
    appTheme: 'App-Thema',
    themeLight: 'Hell',
    themeDark: 'Dunkel',
    themeSystem: 'System',
    appearance: 'Erscheinungsbild',
    behavior: 'Verhalten',
    advanced: 'Erweitert'
  },
  about: {
    title: 'Über',
    version: 'Version',
    principle: 'Funktionsweise',
    principleBody:
      'Codex ist eine Electron-App. Dieses Tool startet sie mit einem CDP-Remote-Debugging-Port und injiziert CSS-Variablen sowie Milchglas-Styles in den Renderer — nicht-invasive Themenanpassung.',
    stack: 'Stack',
    stackBody: 'Electron · React · TypeScript · Framer Motion · chrome-remote-interface',
    note: 'Tipp: Starten Sie Codex immer aus dieser App, sonst ist CDP möglicherweise nicht verfügbar.',
    flowTitle: 'CDP-Injektionsablauf',
    flow1: 'Codex mit --remote-debugging-port starten',
    flow2: 'Über Chrome DevTools Protocol verbinden',
    flow3: 'Page-/Webview-Ziele auflisten',
    flow4: 'CSS-Variablen und Milchglas-Regeln injizieren',
    flow5: 'Presets ohne Neustart hot-swappen'
  },
  toast: {
    started: 'Codex gestartet',
    stopped: 'Codex gestoppt',
    applied: 'Thema angewendet',
    reset: 'Standardstile wiederhergestellt',
    saved: 'Einstellungen gespeichert',
    error: 'Vorgang fehlgeschlagen'
  },
  presets: {
    auroraGlass: {
      name: 'Aurora-Glas',
      description: 'Tiefe Nachthimmel mit violett-blauer Aurora und Premium-Milchglas'
    },
    midnightEmber: {
      name: 'Mitternachtsglut',
      description: 'Warme Glut auf dunklem Grund — ruhig und lebendig'
    },
    sakuraMist: {
      name: 'Sakura-Nebel',
      description: 'Weicher Rosa-Violett-Nebel im japanischen Soft-Focus'
    },
    arcticDawn: {
      name: 'Arktische Dämmerung',
      description: 'Klares helles Theme mit eisblauem Morgenlicht'
    },
    forestHaze: {
      name: 'Waldnebel',
      description: 'Atmende Grüntöne — Moos und Smaragd'
    },
    noirGold: {
      name: 'Noir Gold',
      description: 'Minimalistisches Schwarz mit Champagnergold — exekutive Eleganz'
    },
    lavenderCloud: {
      name: 'Lavendelwolke',
      description: 'Luftiges Lavendellicht, leicht und heiter'
    },
    oceanDepth: {
      name: 'Ozean-Tiefe',
      description: 'Cyan-abyssale Blautöne für fokussierte Arbeit'
    }
  }
}
