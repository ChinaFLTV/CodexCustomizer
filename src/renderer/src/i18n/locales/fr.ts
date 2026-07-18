export default {
  app: {
    name: 'Codex Customizer',
    tagline: 'Sculptez une identité visuelle élégante pour Codex'
  },
  nav: {
    studio: 'Studio de thèmes',
    editor: 'Éditeur CSS',
    control: 'Exécution',
    settings: 'Réglages',
    about: 'À propos'
  },
  status: {
    stopped: 'Arrêté',
    starting: 'Démarrage…',
    running: 'En cours',
    injecting: 'Injection…',
    connected: 'Connecté',
    error: 'Erreur',
    codex: 'État de Codex',
    cdp: 'Port de débogage CDP',
    preset: 'Thème actif',
    none: 'Aucun'
  },
  actions: {
    start: 'Démarrer Codex',
    stop: 'Arrêter Codex',
    apply: 'Appliquer le thème',
    preview: 'Prévisualiser',
    reset: 'Réinitialiser',
    detect: 'Détecter',
    browse: 'Parcourir…',
    save: 'Enregistrer',
    retry: 'Réessayer',
    refresh: 'Actualiser'
  },
  studio: {
    title: 'Préréglages de thème',
    subtitle: 'Choisissez une palette raffinée et injectez-la dans Codex via CDP',
    applySuccess: 'Thème injecté avec succès',
    applyFail: "Échec de l'injection",
    needRunning: 'Démarrez Codex depuis cette application pour activer le débogage distant',
    active: 'Actif',
    tokens: 'Jetons de couleur',
    glass: 'Flou de verre',
    radius: 'Rayon'
  },
  editor: {
    title: 'CSS personnalisé et packs de thèmes',
    subtitle: 'Éditez le CSS global, les jetons, et importez / exportez des packs',
    tabGlobal: 'CSS global',
    tabTheme: 'Éditeur de thème',
    globalCss: 'CSS global personnalisé',
    globalCssHint: 'Ajouté après chaque injection. Variables --cc-* disponibles.',
    themeCss: 'CSS du thème',
    themeCssHint: 'Styles injectés uniquement avec le thème courant.',
    cssPlaceholder: '/* Écrivez le CSS ici… */',
    selectTheme: 'Choisir un thème',
    themeName: 'Nom du thème',
    themeDesc: 'Description',
    builtinGroup: 'Intégrés',
    customGroup: 'Personnalisés / importés',
    builtinReadonly: 'Les thèmes intégrés sont en lecture seule. Enregistrer crée une copie.',
    saveAsCustom: 'Enregistrer comme perso.',
    duplicate: 'Dupliquer',
    duplicated: 'Copie personnalisée créée',
    delete: 'Supprimer',
    deleted: 'Thème supprimé',
    confirmDelete: 'Supprimer ce thème personnalisé ? Action irréversible.',
    saveAndInject: 'Enregistrer et injecter',
    resetTemplate: 'Réinitialiser le modèle',
    import: 'Importer',
    importWithCss: 'Importer (avec CSS global)',
    exportSelected: 'Exporter la sélection',
    exportCustom: 'Exporter les perso.',
    exportAll: 'Tout exporter',
    exported: 'Thème exporté',
    imported: '{{count}} thème(s) importé(s)',
    badgeCustom: 'Perso.',
    badgeImported: 'Importé',
    ioTitle: 'Import / Export',
    ioHint: 'Les packs sont en JSON (.codex-theme.json), multi-thèmes + CSS global optionnel.'
  },
  control: {
    title: "Console d'exécution",
    subtitle: "Démarrer / arrêter Codex et gérer le lien d'injection CDP",
    path: 'Chemin ChatGPT / Codex',
    pathHint:
      'Prend en charge ChatGPT.app, Codex.app, binaire ou .exe. Le nouveau Codex est fusionné dans ChatGPT.app. Préférez le lancement depuis cette app pour le port de débogage.',
    port: 'Port de débogage distant',
    autoInject: 'Injecter automatiquement le dernier thème au démarrage',
    lastInjected: 'Dernière injection',
    pid: 'PID du processus',
    executable: 'Exécutable'
  },
  settings: {
    title: 'Préférences',
    subtitle: 'Langue, apparence et comportement',
    language: "Langue de l'interface",
    appTheme: "Thème de l'application",
    themeLight: 'Clair',
    themeDark: 'Sombre',
    themeSystem: 'Système',
    appearance: 'Apparence',
    behavior: 'Comportement',
    advanced: 'Avancé'
  },
  about: {
    title: 'À propos',
    version: 'Version',
    principle: 'Principe',
    principleBody:
      'Codex est une application Electron. Cet outil le lance avec un port de débogage distant CDP, puis injecte des variables CSS et un style verre dépoli dans son renderer — personnalisation non invasive.',
    stack: 'Stack',
    stackBody: 'Electron · React · TypeScript · Framer Motion · chrome-remote-interface',
    note: 'Astuce : démarrez toujours Codex depuis cette application, sinon le CDP peut être indisponible.',
    flowTitle: "Flux d'injection CDP",
    flow1: 'Lancer Codex avec --remote-debugging-port',
    flow2: 'Se connecter via Chrome DevTools Protocol',
    flow3: 'Énumérer les cibles page / webview',
    flow4: 'Injecter les variables CSS et le verre dépoli',
    flow5: 'Changer de préréglage à chaud sans redémarrer Codex'
  },
  toast: {
    started: 'Codex démarré',
    stopped: 'Codex arrêté',
    applied: 'Thème appliqué',
    reset: 'Styles par défaut restaurés',
    saved: 'Réglages enregistrés',
    error: "Échec de l'opération"
  },
  presets: {
    auroraGlass: {
      name: 'Verre Aurore',
      description: 'Nuit profonde et aurore violet-bleu, verre dépoli premium'
    },
    midnightEmber: {
      name: 'Braise de minuit',
      description: 'Tons chauds d’ambre sur fond sombre — calme et intense'
    },
    sakuraMist: {
      name: 'Brume Sakura',
      description: 'Haze rose-violet à l’ambiance japonaise floue'
    },
    arcticDawn: {
      name: 'Aube arctique',
      description: 'Thème clair cristallin, lumière bleue du matin'
    },
    forestHaze: {
      name: 'Brume forestière',
      description: 'Verts respirants — mousse et émeraude'
    },
    noirGold: {
      name: 'Noir Or',
      description: 'Noir minimal et or champagne — élégance executive'
    },
    lavenderCloud: {
      name: 'Nuage lavande',
      description: 'Lumière lavande aérienne, légère et sereine'
    },
    oceanDepth: {
      name: 'Profondeurs océanes',
      description: 'Bleus abyssaux cyan pour un travail concentré'
    }
  }
}
