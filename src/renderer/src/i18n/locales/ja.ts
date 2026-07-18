export default {
  app: {
    name: 'Codex カスタマイザー',
    tagline: 'Codex に、洗練されたビジュアルを'
  },
  nav: {
    studio: 'テーマ工房',
    editor: 'CSS エディタ',
    control: '実行制御',
    settings: '設定',
    about: 'について'
  },
  status: {
    stopped: '停止中',
    starting: '起動中…',
    running: '実行中',
    injecting: '注入中…',
    connected: '接続済み',
    error: 'エラー',
    codex: 'Codex 状態',
    cdp: 'CDP デバッグポート',
    preset: '適用中のテーマ',
    none: 'なし'
  },
  actions: {
    start: 'Codex を起動',
    stop: 'Codex を停止',
    apply: 'テーマを適用',
    preview: 'プレビュー注入',
    reset: 'デフォルトに戻す',
    detect: '自動検出',
    browse: '参照…',
    save: '保存',
    retry: '再試行',
    refresh: '状態を更新'
  },
  studio: {
    title: 'テーマプリセット',
    subtitle: '洗練されたパレットを選び、CDP で Codex に注入します',
    applySuccess: 'テーマの注入に成功しました',
    applyFail: '注入に失敗しました',
    needRunning: 'リモートデバッグを有効にするため、このアプリから Codex を起動してください',
    active: '使用中',
    tokens: 'カラートークン',
    glass: 'ガラスぼかし',
    radius: '角丸'
  },
  editor: {
    title: 'カスタム CSS とテーマパック',
    subtitle: 'グローバル CSS・トークンの編集、テーマのインポート / エクスポート',
    tabGlobal: 'グローバル CSS',
    tabTheme: 'テーマ編集',
    globalCss: 'グローバルカスタム CSS',
    globalCssHint: '毎回の注入後に追加されます。--cc-* 変数が使えます。',
    themeCss: 'テーマ CSS',
    themeCssHint: '現在のテーマと一緒にだけ注入されるスタイル。',
    cssPlaceholder: '/* ここに CSS を記述… */',
    selectTheme: 'テーマを選択',
    themeName: 'テーマ名',
    themeDesc: '説明',
    builtinGroup: '組み込み',
    customGroup: 'カスタム / インポート',
    builtinReadonly: '組み込みテーマは直接上書きできません。保存するとカスタムコピーが作られます。',
    saveAsCustom: 'カスタムとして保存',
    duplicate: '複製',
    duplicated: 'カスタムコピーを作成しました',
    delete: '削除',
    deleted: 'テーマを削除しました',
    confirmDelete: 'このカスタムテーマを削除しますか？元に戻せません。',
    saveAndInject: '保存して注入',
    resetTemplate: 'テンプレートに戻す',
    import: 'インポート',
    importWithCss: 'インポート（グローバル CSS 含む）',
    exportSelected: '選択をエクスポート',
    exportCustom: 'カスタムをエクスポート',
    exportAll: 'すべてエクスポート',
    exported: 'テーマをエクスポートしました',
    imported: '{{count}} 件のテーマをインポートしました',
    badgeCustom: 'カスタム',
    badgeImported: 'インポート',
    ioTitle: 'インポート / エクスポート',
    ioHint: 'テーマパックは JSON（.codex-theme.json）。複数テーマと任意のグローバル CSS を含められます。'
  },
  control: {
    title: '実行コンソール',
    subtitle: 'Codex の起動・停止と CDP 注入リンクの管理',
    path: 'ChatGPT / Codex のパス',
    pathHint:
      'ChatGPT.app / Codex.app / バイナリ / .exe に対応。新版 Codex は ChatGPT.app に統合されています。デバッグポート付与のため本アプリからの起動を推奨します。',
    port: 'リモートデバッグポート',
    autoInject: '起動時に前回のテーマを自動注入',
    lastInjected: '最終注入時刻',
    pid: 'プロセス PID',
    executable: '実行ファイル'
  },
  settings: {
    title: '設定',
    subtitle: '言語・外観・動作',
    language: '表示言語',
    appTheme: 'アプリテーマ',
    themeLight: 'ライト',
    themeDark: 'ダーク',
    themeSystem: 'システム',
    appearance: '外観',
    behavior: '動作',
    advanced: '詳細'
  },
  about: {
    title: 'について',
    version: 'バージョン',
    principle: '仕組み',
    principleBody:
      'Codex は Electron アプリです。本ツールは CDP リモートデバッグポート付きで Codex を起動し、レンダラーへ CSS 変数とフロストガラス風スタイルを注入します。非侵襲的なテーマカスタマイズです。',
    stack: '技術スタック',
    stackBody: 'Electron · React · TypeScript · Framer Motion · chrome-remote-interface',
    note: 'ヒント: 常に本アプリから Codex を起動してください。そうしないと CDP が使えない場合があります。'
  },
  toast: {
    started: 'Codex を起動しました',
    stopped: 'Codex を停止しました',
    applied: 'テーマを適用しました',
    reset: 'デフォルトスタイルに戻しました',
    saved: '設定を保存しました',
    error: '操作に失敗しました'
  },
  presets: {
    auroraGlass: {
      name: 'オーロラガラス',
      description: '深い夜空と紫青のオーロラ、上質なすりガラス'
    },
    midnightEmber: {
      name: 'ミッドナイトエンバー',
      description: '暗いキャンバスに暖かな残り火 — 落ち着きと熱'
    },
    sakuraMist: {
      name: '桜霞',
      description: 'ピンク紫の霞、和のソフトフォーカス'
    },
    arcticDawn: {
      name: '北極の夜明け',
      description: '澄んだライトテーマ、氷の朝光'
    },
    forestHaze: {
      name: '森の霞',
      description: '苔とエメラルドの呼吸する緑'
    },
    noirGold: {
      name: 'ノワールゴールド',
      description: 'ミニマルな黒にシャンパンゴールド — 上質な佇まい'
    },
    lavenderCloud: {
      name: 'ラベンダークラウド',
      description: '軽やかなラベンダーの光、静かで無重力'
    },
    oceanDepth: {
      name: 'オーシャンデプス',
      description: '深いシアンの海、集中のためのブルー'
    }
  }
}
