# Codex Customizer

跨平台 Electron 应用，用于为 **Codex APP** 进行个性化主题定制。UI 采用高斯模糊 / 毛玻璃（Frosted Glass）风格，支持浅色 / 深色 / 跟随系统主题，以及简体中文、英语、法语、日语、德语国际化。

## 定制原理

Codex 本身是 Electron 应用。本工具会：

1. 以 `--remote-debugging-port=<port>` 启动 Codex
2. 通过 **Chrome DevTools Protocol (CDP)** 连接其调试端口
3. 向 Codex 的页面 / webview target 注入 CSS 变量与玻璃态样式
4. 支持在不重启 Codex 的情况下热切换主题预设

> 请尽量通过本应用启动 Codex，否则可能无法附加 CDP。

## 功能

- 启动 / 停止 Codex
- 自动检测或手动选择 Codex 可执行路径（macOS / Windows / Linux）
- 8 套内置主题组合（极光玻璃、午夜余烬、樱雾、极地破晓等）
- **自定义 CSS 编辑器**（全局 CSS + 主题级 CSS，带行号与 Tab 缩进）
- **主题导入 / 导出**（`.codex-theme.json` 主题包，可含多个主题与全局 CSS）
- 基于内置主题复制、编辑令牌、另存为自定义主题
- 一键注入 / 还原默认样式
- 应用内主题：浅色、深色、跟随系统
- 多语言：`zh-CN` · `en` · `fr` · `ja` · `de`
- 启动后自动注入上次使用的主题

## 技术栈

- Electron + electron-vite
- React 18 + TypeScript
- Framer Motion（Q 弹动画）
- i18next / react-i18next
- zustand
- chrome-remote-interface（CDP）
- electron-store（本地设置）
- electron-builder（打包）

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 类型检查
npm run typecheck

# 构建
npm run build

# 打包（当前平台）
npm run dist
```

### 平台打包

```bash
npm run dist:mac
npm run dist:win
npm run dist:linux
```

## 使用流程

1. 打开 **运行控制**，自动检测或浏览选择 Codex 路径
2. 确认远程调试端口（默认 `9333`）
3. 在 **主题工坊** 选择预设，点击 **启动 Codex** 或 **应用主题**
4. Codex 启动并完成 CDP 注入后即可看到新主题
5. 可随时切换预设并再次 **应用主题**（热注入）

## 项目结构

```
├── src/main/               # 主进程：窗口、IPC、Codex 生命周期、CDP 注入
├── src/preload/            # contextBridge API
├── src/shared/             # 共享类型、主题预设、默认配置
├── src/renderer/           # React UI
│   └── src/
│       ├── components/
│       ├── i18n/locales/   # zh-CN / en / fr / ja / de
│       ├── pages/
│       ├── store/
│       └── styles/
└── resources/
```

## 注意事项

- 注入样式基于通用选择器与 CSS 变量，可适配多数 Electron/DOM 结构；若 Codex 大改 DOM，可能需要调整 `src/main/cdp-injector.ts` 中的选择器。
- 部分沙箱 / 权限策略下 CDP 可能受限；务必用本应用带调试参数启动。
- 停止 Codex 为尽力而为（SIGTERM / 进程组）；若仍有残留进程，可在系统活动监视器中结束。

## 故障排查

### `Error: Electron uninstall` / `Electron failed to install correctly`

说明 `electron` npm 包在，但原生二进制未完整解压（常见于安装中断或 `extract-zip` 不完整）。

项目已内置修复脚本，会在 `npm install` / `npm run dev` 前自动检查：

```bash
npm run ensure:electron
# 或
npm run dev
```

若仍失败，可强制重装：

```bash
rm -rf node_modules/electron
# macOS 可选：清缓存
rm -rf ~/Library/Caches/electron
npm install electron --foreground-scripts
npm run ensure:electron
npm run dev
```

## License

MIT
