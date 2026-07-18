export default {
  app: {
    name: 'Codex Customizer',
    tagline: 'Sculpt an elegant visual identity for Codex'
  },
  nav: {
    studio: 'Theme Studio',
    editor: 'CSS Editor',
    control: 'Runtime',
    settings: 'Settings',
    about: 'About'
  },
  status: {
    stopped: 'Stopped',
    starting: 'Starting…',
    running: 'Running (no debug)',
    injecting: 'Injecting…',
    connected: 'Connected',
    error: 'Error',
    codex: 'Codex status',
    cdp: 'CDP debug port',
    preset: 'Active theme',
    none: 'None'
  },
  actions: {
    start: 'Start Codex',
    stop: 'Stop Codex',
    apply: 'Apply theme',
    preview: 'Inject preview',
    reset: 'Reset default',
    detect: 'Auto-detect',
    browse: 'Browse…',
    save: 'Save',
    retry: 'Retry',
    refresh: 'Refresh status'
  },
  studio: {
    title: 'Theme presets',
    subtitle: 'Pick a refined palette and inject it into Codex via CDP',
    applySuccess: 'Theme injected successfully',
    applyFail: 'Injection failed',
    needRunning: 'Start Codex from this app to enable remote debugging',
    active: 'Active',
    tokens: 'Color tokens',
    glass: 'Glass blur',
    radius: 'Radius'
  },
  editor: {
    title: 'Custom CSS & theme packs',
    subtitle: 'Edit global CSS, tune theme tokens, and import / export theme packs',
    tabGlobal: 'Global CSS',
    tabTheme: 'Theme editor',
    globalCss: 'Global custom CSS',
    globalCssHint: 'Appended after every theme injection. You can use --cc-* CSS variables.',
    themeCss: 'Theme-level CSS',
    themeCssHint: 'Extra styles injected only with the current theme.',
    cssPlaceholder: '/* Write CSS here… */',
    selectTheme: 'Select theme',
    themeName: 'Theme name',
    themeDesc: 'Description',
    builtinGroup: 'Built-in',
    customGroup: 'Custom / imported',
    builtinReadonly: 'Built-in themes are read-only. Saving will create a custom copy.',
    saveAsCustom: 'Save as custom',
    duplicate: 'Duplicate',
    duplicated: 'Custom copy created',
    delete: 'Delete',
    deleted: 'Theme deleted',
    confirmDelete: 'Delete this custom theme? This cannot be undone.',
    saveAndInject: 'Save & inject',
    resetTemplate: 'Reset template',
    import: 'Import',
    importWithCss: 'Import (with global CSS)',
    exportSelected: 'Export selected',
    exportCustom: 'Export custom',
    exportAll: 'Export all',
    exported: 'Theme exported',
    imported: 'Imported {{count}} theme(s)',
    badgeCustom: 'Custom',
    badgeImported: 'Imported',
    ioTitle: 'Import / Export',
    ioHint: 'Theme packs are JSON (.codex-theme.json) and may include multiple themes plus optional global CSS.'
  },
  control: {
    title: 'Runtime console',
    subtitle: 'Start / stop Codex and manage the CDP injection link',
    path: 'ChatGPT / Codex path',
    pathHint:
      'Supports ChatGPT.app, Codex.app, binary, or .exe. If ChatGPT is already running, Start will attach to CDP; if debugging is off, it will quit and relaunch with remote debugging enabled.',
    port: 'Remote debugging port',
    autoInject: 'Auto-inject last theme on start',
    lastInjected: 'Last injected at',
    pid: 'Process PID',
    executable: 'Executable'
  },
  settings: {
    title: 'Preferences',
    subtitle: 'Language, appearance and behavior',
    language: 'Interface language',
    appTheme: 'App theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    appearance: 'Appearance',
    behavior: 'Behavior',
    advanced: 'Advanced'
  },
  about: {
    title: 'About',
    version: 'Version',
    principle: 'How it works',
    principleBody:
      'Codex is an Electron app. This tool launches it with a Chrome DevTools Protocol (CDP) remote-debugging port, then injects CSS variables and frosted-glass styles into its renderer — non-invasive theme customization.',
    stack: 'Stack',
    stackBody: 'Electron · React · TypeScript · Framer Motion · chrome-remote-interface',
    note: 'Tip: always start Codex from this app, otherwise CDP may be unavailable.',
    flowTitle: 'CDP injection flow',
    flow1: 'Launch Codex with --remote-debugging-port',
    flow2: 'Connect via Chrome DevTools Protocol',
    flow3: 'Enumerate page / webview targets',
    flow4: 'Inject CSS variables + frosted-glass rules',
    flow5: 'Hot-swap presets without restarting Codex'
  },
  toast: {
    started: 'Codex started',
    stopped: 'Codex stopped',
    applied: 'Theme applied',
    reset: 'Default styles restored',
    saved: 'Settings saved',
    error: 'Operation failed'
  },
  presets: {
    auroraGlass: {
      name: 'Aurora Glass',
      description: 'Deep night sky with violet-blue aurora and premium frosted glass'
    },
    midnightEmber: {
      name: 'Midnight Ember',
      description: 'Warm ember tones over a dark canvas — calm yet vivid'
    },
    sakuraMist: {
      name: 'Sakura Mist',
      description: 'Soft pink-violet haze with a Japanese soft-focus mood'
    },
    arcticDawn: {
      name: 'Arctic Dawn',
      description: 'Crisp light theme with icy blue morning light'
    },
    forestHaze: {
      name: 'Forest Haze',
      description: 'Breathing greens — moss and emerald in soft fog'
    },
    noirGold: {
      name: 'Noir Gold',
      description: 'Minimal black with champagne gold — executive polish'
    },
    lavenderCloud: {
      name: 'Lavender Cloud',
      description: 'Airy lavender light, weightless and serene'
    },
    oceanDepth: {
      name: 'Ocean Depth',
      description: 'Cyan abyssal blues for focused deep work'
    }
  }
}
