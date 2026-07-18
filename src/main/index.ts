import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  nativeTheme,
  shell
} from 'electron'
import { join } from 'path'
import { IPC } from '../shared/types'
import type { AppSettings } from '../shared/types'
import { getSettings, setSettings } from './settings-store'
import {
  applyTheme,
  bindMainWindow,
  listThemes,
  previewTheme,
  refreshStatus,
  resetInjectedTheme,
  startCodex,
  stopCodex
} from './codex-manager'
import { detectCodexPath } from './codex-locator'
import {
  deleteTheme,
  duplicateTheme,
  exportThemes,
  getGlobalCustomCss,
  importThemes,
  saveTheme,
  setGlobalCustomCss
} from './theme-service'
import type { ThemeSavePayload } from '../shared/types'

const isDev = !app.isPackaged

let mainWindow: BrowserWindow | null = null

/** Dev + packaged: resources/ sits next to out/ (packed into app.asar). */
function resolveAppIcon(): string {
  return join(__dirname, '../../resources/icon.png')
}

function createWindow(): void {
  const settings = getSettings()
  const { width, height, x, y } = settings.windowBounds
  const icon = resolveAppIcon()

  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    minWidth: 960,
    minHeight: 640,
    show: false,
    frame: false,
    icon,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    trafficLightPosition: { x: 16, y: 18 },
    backgroundColor: '#00000000',
    transparent: process.platform === 'darwin',
    vibrancy: process.platform === 'darwin' ? 'under-window' : undefined,
    visualEffectState: process.platform === 'darwin' ? 'active' : undefined,
    roundedCorners: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  // macOS Dock icon (dev + packaged)
  if (process.platform === 'darwin' && app.dock) {
    try {
      app.dock.setIcon(icon)
    } catch {
      // ignore missing icon during early setup
    }
  }

  bindMainWindow(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('close', () => {
    if (!mainWindow) return
    const bounds = mainWindow.getBounds()
    setSettings({
      windowBounds: {
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y
      }
    })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerIpc(): void {
  ipcMain.handle(IPC.GET_SETTINGS, () => getSettings())

  ipcMain.handle(IPC.SET_SETTINGS, (_e, partial: Partial<AppSettings>) => {
    const next = setSettings(partial)
    if (partial.appTheme) {
      applyNativeTheme(partial.appTheme)
    }
    return next
  })

  ipcMain.handle(IPC.CODEX_DETECT, async () => {
    const settings = getSettings()
    return detectCodexPath(settings.codexPath)
  })

  ipcMain.handle(
    IPC.CODEX_START,
    async (_e, payload?: { path?: string; presetId?: string }) => {
      return startCodex({
        path: payload?.path,
        presetId: payload?.presetId,
        inject: true
      })
    }
  )

  ipcMain.handle(IPC.CODEX_STOP, async () => stopCodex())

  ipcMain.handle(IPC.CODEX_STATUS, async () => refreshStatus())

  ipcMain.handle(IPC.THEME_LIST, () => listThemes())

  ipcMain.handle(IPC.THEME_APPLY, async (_e, presetId: string) =>
    applyTheme(presetId)
  )

  ipcMain.handle(IPC.THEME_PREVIEW, async (_e, presetId: string) =>
    previewTheme(presetId)
  )

  ipcMain.handle(IPC.THEME_RESET, async () => resetInjectedTheme())

  ipcMain.handle(IPC.THEME_SAVE, (_e, payload: ThemeSavePayload) => saveTheme(payload))

  ipcMain.handle(IPC.THEME_DELETE, (_e, id: string) => deleteTheme(id))

  ipcMain.handle(IPC.THEME_DUPLICATE, (_e, id: string, name?: string) =>
    duplicateTheme(id, name)
  )

  ipcMain.handle(
    IPC.THEME_EXPORT,
    async (
      _e,
      payload?: { themeIds?: string[] | null; includeGlobalCss?: boolean }
    ) =>
      exportThemes(
        mainWindow,
        payload?.themeIds ?? null,
        payload?.includeGlobalCss !== false
      )
  )

  ipcMain.handle(
    IPC.THEME_IMPORT,
    async (_e, payload?: { replaceGlobalCss?: boolean }) =>
      importThemes(mainWindow, payload)
  )

  ipcMain.handle(IPC.THEME_GET_GLOBAL_CSS, () => getGlobalCustomCss())

  ipcMain.handle(IPC.THEME_SET_GLOBAL_CSS, (_e, css: string) =>
    setGlobalCustomCss(css)
  )

  ipcMain.handle(IPC.DIALOG_PICK_CODEX, async () => {
    if (!mainWindow) return null
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Select ChatGPT / Codex app',
      message:
        process.platform === 'darwin'
          ? 'Choose ChatGPT.app or Codex.app (OpenAI desktop)'
          : undefined,
      buttonLabel: process.platform === 'darwin' ? 'Select' : undefined,
      properties:
        process.platform === 'darwin'
          ? ['openFile', 'openDirectory', 'treatPackageAsDirectory']
          : ['openFile'],
      filters:
        process.platform === 'win32'
          ? [{ name: 'Executable', extensions: ['exe'] }]
          : process.platform === 'darwin'
            ? [{ name: 'Application', extensions: ['app'] }]
            : undefined
    })
    if (result.canceled || result.filePaths.length === 0) {
      return null
    }
    const path = result.filePaths[0]
    setSettings({ codexPath: path })
    return path
  })

  ipcMain.handle('window:minimize', () => {
    mainWindow?.minimize()
  })
  ipcMain.handle('window:maximize', () => {
    if (!mainWindow) return
    if (mainWindow.isMaximized()) mainWindow.unmaximize()
    else mainWindow.maximize()
  })
  ipcMain.handle('window:close', () => {
    mainWindow?.close()
  })
  ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized() ?? false)
}

function applyNativeTheme(mode: AppSettings['appTheme']): void {
  if (mode === 'system') {
    nativeTheme.themeSource = 'system'
  } else {
    nativeTheme.themeSource = mode
  }
}

app.whenReady().then(() => {
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.codexcustomizer.app')
  }

  applyNativeTheme(getSettings().appTheme)
  registerIpc()
  createWindow()
  void refreshStatus()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  bindMainWindow(null)
})
