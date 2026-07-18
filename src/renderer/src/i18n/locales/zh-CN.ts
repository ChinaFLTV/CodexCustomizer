export default {
  app: {
    name: 'Codex 主题定制器',
    tagline: '以优雅之姿，重塑 Codex 视觉体验'
  },
  nav: {
    studio: '主题工坊',
    editor: 'CSS 编辑器',
    control: '运行控制',
    settings: '设置',
    about: '关于'
  },
  status: {
    stopped: '已停止',
    starting: '启动中…',
    running: '已运行（无调试）',
    injecting: '注入主题…',
    connected: '已连接',
    error: '出错',
    codex: 'Codex 状态',
    cdp: 'CDP 调试端口',
    preset: '当前主题',
    none: '无'
  },
  actions: {
    start: '启动 Codex',
    stop: '停止 Codex',
    apply: '应用主题',
    preview: '预览注入',
    reset: '还原默认',
    detect: '自动检测',
    browse: '浏览',
    save: '保存',
    retry: '重试',
    refresh: '刷新状态'
  },
  studio: {
    title: '主题组合',
    subtitle: '选择一套精致预设，通过 CDP 实时注入 Codex',
    applySuccess: '主题已成功注入',
    applyFail: '注入失败',
    needRunning: '请先从本应用启动 ChatGPT / Codex，以开启远程调试端口',
    active: '使用中',
    tokens: '色彩令牌',
    glass: '玻璃模糊',
    radius: '圆角'
  },
  editor: {
    title: '自定义 CSS 与主题包',
    subtitle: '编辑全局 CSS、定制主题令牌，并导入 / 导出主题包',
    tabGlobal: '全局 CSS',
    tabTheme: '主题编辑',
    globalCss: '全局自定义 CSS',
    globalCssHint: '每次注入时附加在主题样式之后。可使用 --cc-* CSS 变量。',
    themeCss: '主题级 CSS',
    themeCssHint: '仅随当前主题一起注入的额外样式。',
    cssPlaceholder: '/* 在此编写 CSS… */',
    selectTheme: '选择主题',
    themeName: '主题名称',
    themeDesc: '主题描述',
    builtinGroup: '内置主题',
    customGroup: '自定义 / 已导入',
    builtinReadonly: '内置主题不可直接覆盖。保存时将创建一份自定义副本。',
    saveAsCustom: '另存为自定义',
    duplicate: '复制主题',
    duplicated: '已创建自定义副本',
    delete: '删除',
    deleted: '主题已删除',
    confirmDelete: '确定删除此自定义主题？此操作不可撤销。',
    saveAndInject: '保存并注入',
    resetTemplate: '恢复模板',
    import: '导入',
    importWithCss: '导入（含全局 CSS）',
    exportSelected: '导出当前',
    exportCustom: '导出自定义',
    exportAll: '导出全部',
    exported: '主题已导出',
    imported: '已导入 {{count}} 个主题',
    badgeCustom: '自定义',
    badgeImported: '导入',
    ioTitle: '导入 / 导出',
    ioHint: '主题包为 JSON（.codex-theme.json），可包含多个主题与可选的全局 CSS。'
  },
  control: {
    title: '运行控制台',
    subtitle: '启动、停止 Codex，并管理 CDP 注入链路',
    path: 'ChatGPT / Codex 路径',
    pathHint:
      '支持 ChatGPT.app、Codex.app、二进制或 .exe。新版 Codex 已并入 ChatGPT 桌面端（/Applications/ChatGPT.app）。若 ChatGPT 已在运行，点「启动」会自动附加 CDP；若无调试端口，将安全退出并以调试模式重启。',
    port: '远程调试端口',
    autoInject: '启动后自动注入上次主题',
    lastInjected: '上次注入时间',
    pid: '进程 PID',
    executable: '可执行文件'
  },
  settings: {
    title: '偏好设置',
    subtitle: '语言、外观与行为',
    language: '界面语言',
    appTheme: '应用主题',
    themeLight: '浅色',
    themeDark: '深色',
    themeSystem: '跟随系统',
    appearance: '外观',
    behavior: '行为',
    advanced: '高级'
  },
  about: {
    title: '关于',
    version: '版本',
    principle: '定制原理',
    principleBody:
      'Codex 本身基于 Electron。本应用通过 Chrome DevTools Protocol (CDP) 以远程调试端口启动 Codex，随后向其渲染进程注入 CSS 变量与玻璃态样式，实现非侵入式主题定制。',
    stack: '技术栈',
    stackBody: 'Electron · React · TypeScript · Framer Motion · chrome-remote-interface',
    note: '提示：请始终通过本应用启动 Codex，否则可能无法附加 CDP。',
    flowTitle: 'CDP 注入流程',
    flow1: '以 --remote-debugging-port 启动 Codex / ChatGPT',
    flow2: '通过 Chrome DevTools Protocol 建立连接',
    flow3: '枚举 page / webview 调试目标',
    flow4: '注入 CSS 变量与毛玻璃样式规则',
    flow5: '无需重启即可热切换主题预设'
  },
  toast: {
    started: 'Codex 已启动',
    stopped: 'Codex 已停止',
    applied: '主题已应用',
    reset: '已还原默认样式',
    saved: '设置已保存',
    error: '操作失败'
  },
  presets: {
    auroraGlass: {
      name: '极光玻璃',
      description: '深蓝夜空与紫蓝极光，顶级毛玻璃质感'
    },
    midnightEmber: {
      name: '午夜余烬',
      description: '暖橙余晖铺陈暗夜，沉稳而炽热'
    },
    sakuraMist: {
      name: '樱雾',
      description: '粉紫朦胧，日系柔焦氛围'
    },
    arcticDawn: {
      name: '极地破晓',
      description: '清透浅色，冰蓝晨光'
    },
    forestHaze: {
      name: '林间薄雾',
      description: '墨绿与翡翠绿的呼吸感'
    },
    noirGold: {
      name: '黑金',
      description: '极简黑底衬以香槟金，高端商务'
    },
    lavenderCloud: {
      name: '薰衣草云',
      description: '浅紫柔光，云端般轻盈'
    },
    oceanDepth: {
      name: '深海',
      description: '青蓝深渊与流光，冷静专注'
    },
    codex2007: {
      name: 'Codex 2007',
      description: 'QQ2007 / XP Luna 蓝白铬合金，标题栏渐变与经典聊天气质'
    }
  }
}
