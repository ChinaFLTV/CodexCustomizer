import { ChildProcess, spawn } from 'child_process'
import { existsSync } from 'fs'
import { platform } from 'os'
import { dirname, normalize } from 'path'
import type { BrowserWindow } from 'electron'
import {
  detectCodexPath,
  isLikelyCodexTarget,
  resolveExecutable
} from './codex-locator'
import { injectTheme, isCdpReachable, resetTheme } from './cdp-injector'
import {
  findOpenCdpPort,
  findRunningCodexApps,
  quitRunningCodexApps
} from './process-probe'
import { getSettings, setSettings } from './settings-store'
import { THEME_PRESETS } from '../shared/theme-presets'
import { DEFAULT_DEBUGGING_PORT } from '../shared/defaults'
import type { CodexRuntimeState, InjectResult } from '../shared/types'
import { IPC } from '../shared/types'
import {
  getGlobalCustomCss,
  listAllThemes,
  resolveTheme
} from './theme-service'

let child: ChildProcess | null = null
/** Tracked PID when we own the process (spawn / direct launch) */
let launchedPid: number | null = null
/** True when we attached to an already-running instance (not started by us) */
let attachedExternally = false

let state: CodexRuntimeState = {
  status: 'stopped',
  pid: null,
  debuggingPort: null,
  executablePath: null,
  lastError: null,
  activePresetId: null,
  injectedAt: null
}

let mainWindow: BrowserWindow | null = null
let healthTimer: ReturnType<typeof setInterval> | null = null

export function bindMainWindow(win: BrowserWindow | null): void {
  mainWindow = win
}

function emitState(): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(IPC.CODEX_STATUS_EVENT, { ...state })
  }
}

function setState(partial: Partial<CodexRuntimeState>): void {
  state = { ...state, ...partial }
  emitState()
}

export function getCodexState(): CodexRuntimeState {
  return { ...state }
}

export function listThemes() {
  return listAllThemes()
}

async function ensurePath(override?: string | null): Promise<{
  launchTarget: string
  executable: string
  appBundle: string | null
}> {
  const settings = getSettings()
  const preferred = (override ?? settings.codexPath)?.trim() || null

  if (preferred && existsSync(preferred) && isLikelyCodexTarget(preferred)) {
    const appBundle = preferred.endsWith('.app')
      ? preferred
      : findEnclosingAppBundle(preferred)
    const executable = resolveExecutable(preferred)
    if (!existsSync(executable) && !appBundle) {
      throw new Error(
        `路径无效：${preferred}。请选择 /Applications/ChatGPT.app 或 Codex.app。`
      )
    }
    if (preferred !== settings.codexPath) {
      setSettings({ codexPath: preferred })
    }
    return {
      launchTarget: appBundle || executable,
      executable: existsSync(executable) ? executable : preferred,
      appBundle
    }
  }

  const { path } = await detectCodexPath(preferred)
  if (!path) {
    // App may already be running even if install path is unknown
    const running = await findRunningCodexApps()
    if (running.pids.length > 0) {
      return {
        launchTarget: preferred || 'ChatGPT',
        executable: preferred || 'ChatGPT',
        appBundle: preferred?.endsWith('.app') ? preferred : null
      }
    }
    throw new Error(
      '未找到 ChatGPT / Codex 应用。请在「运行控制」中选择路径（例如 /Applications/ChatGPT.app），也可选择旧版 Codex.app。'
    )
  }

  if (path !== settings.codexPath) {
    setSettings({ codexPath: path })
  }

  const appBundle = path.endsWith('.app') ? path : findEnclosingAppBundle(path)
  const executable = resolveExecutable(path)
  return {
    launchTarget: appBundle || executable,
    executable: existsSync(executable) ? executable : path,
    appBundle
  }
}

function findEnclosingAppBundle(filePath: string): string | null {
  let cur = normalize(filePath)
  for (let i = 0; i < 8; i++) {
    if (cur.endsWith('.app') && existsSync(cur)) return cur
    const parent = dirname(cur)
    if (parent === cur) break
    cur = parent
  }
  return null
}

function buildLaunchArgs(port: number): string[] {
  return [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    '--enable-features=NetworkService,NetworkServiceInProcess'
  ]
}

function cleanEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env }
  delete env.ELECTRON_RUN_AS_NODE
  delete env.ELECTRON_NO_ASAR
  return env
}

function launchProcess(
  launchTarget: string,
  appBundle: string | null,
  args: string[],
  /** open -n forces a new instance; use false when we just quit the old one */
  forceNew = true
): ChildProcess {
  const os = platform()
  const env = cleanEnv()

  if (os === 'darwin') {
    const appPath =
      appBundle ||
      (launchTarget.endsWith('.app')
        ? launchTarget
        : findEnclosingAppBundle(launchTarget))

    if (appPath) {
      const openArgs = forceNew
        ? ['-n', '-a', appPath, '--args', ...args]
        : ['-a', appPath, '--args', ...args]
      return spawn('open', openArgs, {
        detached: true,
        stdio: 'ignore',
        env
      })
    }

    // Fallback: open by name
    if (launchTarget === 'ChatGPT' || launchTarget === 'Codex') {
      return spawn(
        'open',
        ['-a', launchTarget, '--args', ...args],
        { detached: true, stdio: 'ignore', env }
      )
    }
  }

  return spawn(launchTarget, args, {
    detached: true,
    stdio: 'ignore',
    env,
    windowsHide: false
  })
}

/**
 * Discover a live CDP port from settings, process cmdlines, or common defaults.
 */
async function resolveLiveCdpPort(preferred?: number): Promise<number | null> {
  const settings = getSettings()
  const base = preferred || settings.debuggingPort || DEFAULT_DEBUGGING_PORT
  const running = await findRunningCodexApps()
  return findOpenCdpPort(base, running.debugPorts)
}

/**
 * Attach to an already-open CDP endpoint without launching.
 */
async function attachToCdp(
  port: number,
  options?: {
    inject?: boolean
    presetId?: string | null
    pid?: number | null
    executablePath?: string | null
  }
): Promise<CodexRuntimeState> {
  attachedExternally = true
  launchedPid = options?.pid ?? null
  setState({
    status: 'connected',
    pid: options?.pid ?? state.pid,
    debuggingPort: port,
    executablePath: options?.executablePath ?? state.executablePath,
    lastError: null
  })
  // Persist discovered port so later injects hit the right endpoint
  if (port !== getSettings().debuggingPort) {
    setSettings({ debuggingPort: port })
  }
  startHealthCheck(port)

  if (options?.inject !== false) {
    await applyTheme(options?.presetId || getSettings().lastPresetId)
  }
  return getCodexState()
}

async function afterLaunchWaitAndInject(
  port: number,
  executablePath: string,
  options?: { inject?: boolean; presetId?: string | null },
  timeoutMs = 28000
): Promise<CodexRuntimeState> {
  setState({
    status: 'running',
    debuggingPort: port,
    executablePath,
    lastError: null
  })

  const live = await waitUntilCdp(port, timeoutMs)
  if (live == null) {
    setState({
      status: 'running',
      debuggingPort: port,
      executablePath,
      lastError:
        '已启动 ChatGPT / Codex，但 CDP 调试端口尚未就绪。若应用此前已在运行且未带调试参数，请点「停止」后由本应用重新启动。'
    })
    return getCodexState()
  }

  return attachToCdp(live, {
    inject: options?.inject,
    presetId: options?.presetId,
    executablePath
  })
}

export async function startCodex(options?: {
  path?: string | null
  inject?: boolean
  presetId?: string | null
  /** Force quit existing instance and relaunch with CDP (default: true when needed) */
  relaunchIfNeeded?: boolean
}): Promise<CodexRuntimeState> {
  const settings = getSettings()
  const preferredPort = settings.debuggingPort || DEFAULT_DEBUGGING_PORT
  const relaunchIfNeeded = options?.relaunchIfNeeded !== false

  setState({
    status: 'starting',
    lastError: null
  })

  try {
    // ── 1) Already have CDP? Attach (covers pre-running debug sessions) ──
    const livePort = await resolveLiveCdpPort(preferredPort)
    if (livePort) {
      const running = await findRunningCodexApps()
      let pathInfo: { executable: string; appBundle: string | null } | null =
        null
      try {
        pathInfo = await ensurePath(options?.path)
      } catch {
        // path optional when attaching
      }
      return attachToCdp(livePort, {
        inject: options?.inject,
        presetId: options?.presetId,
        pid: running.pids[0] ?? null,
        executablePath: pathInfo?.appBundle || pathInfo?.executable || null
      })
    }

    // ── 2) App already running but WITHOUT CDP → must relaunch ──
    const running = await findRunningCodexApps()
    if (running.pids.length > 0) {
      if (!relaunchIfNeeded) {
        setState({
          status: 'error',
          pid: running.pids[0] ?? null,
          lastError:
            '检测到 ChatGPT / Codex 已在运行，但未开启远程调试端口，无法注入主题。请通过本应用启动，或允许重启应用。'
        })
        return getCodexState()
      }

      setState({
        status: 'starting',
        lastError: '检测到已运行的实例，正在退出并带 CDP 参数重新启动…'
      })
      await quitRunningCodexApps(running)
      // Clear any stale child handle
      child = null
      launchedPid = null
      attachedExternally = false
    }

    // ── 3) Cold start (or relaunch) with debug flags ──
    const { launchTarget, executable, appBundle } = await ensurePath(
      options?.path
    )
    const port = preferredPort
    const args = buildLaunchArgs(port)

    // If we just quit, prefer open without -n so single-instance activates cleanly
    const justRelaunched = running.pids.length > 0
    child = launchProcess(launchTarget, appBundle, args, !justRelaunched)
    child.unref()
    attachedExternally = false

    const openPid = child.pid ?? null
    launchedPid = openPid

    child.on('error', (err) => {
      setState({
        status: 'error',
        lastError: `启动失败：${err.message}。请确认路径为 ChatGPT.app / Codex.app。`,
        pid: null
      })
    })

    child.on('exit', (code, signal) => {
      if (code && code !== 0 && state.status === 'starting') {
        setState({
          status: 'error',
          lastError: `启动命令退出码 ${code}${signal ? ` (${signal})` : ''}。`,
          pid: null
        })
      }
      if (child && child.pid === openPid) {
        child = null
      }
    })

    setState({
      status: 'running',
      pid: openPid,
      debuggingPort: port,
      executablePath: appBundle || executable,
      lastError: null
    })

    // Brief wait; if CDP not up yet, try direct binary spawn on macOS
    let live = await waitUntilCdp(port, justRelaunched ? 12000 : 16000)
    if (live == null && platform() === 'darwin' && existsSync(executable)) {
      try {
        const direct = spawn(executable, args, {
          detached: true,
          stdio: 'ignore',
          env: cleanEnv()
        })
        direct.unref()
        launchedPid = direct.pid ?? null
        child = direct
        setState({ pid: launchedPid, executablePath: executable })
        live = await waitUntilCdp(port, 12000)
      } catch {
        // ignore
      }
    }

    if (live != null) {
      return attachToCdp(live, {
        inject: options?.inject,
        presetId: options?.presetId,
        pid: launchedPid,
        executablePath: appBundle || executable
      })
    }

    return afterLaunchWaitAndInject(
      port,
      appBundle || executable,
      options,
      8000
    )
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    setState({ status: 'error', lastError: message, pid: null })
    return getCodexState()
  }
}

/** Wait until preferred port (or another discovered CDP) is reachable. */
async function waitUntilCdp(
  port: number,
  timeoutMs: number
): Promise<number | null> {
  const start = Date.now()
  let ticks = 0
  while (Date.now() - start < timeoutMs) {
    if (await isCdpReachable(port)) return port
    ticks += 1
    // Full port scan every ~2s to catch alternate debug ports
    if (ticks % 5 === 0) {
      const alt = await resolveLiveCdpPort(port)
      if (alt != null) return alt
    }
    await new Promise((r) => setTimeout(r, 400))
  }
  return resolveLiveCdpPort(port)
}

function startHealthCheck(port: number): void {
  stopHealthCheck()
  healthTimer = setInterval(async () => {
    if (state.status === 'stopped' || state.status === 'error') return
    const live =
      (await isCdpReachable(port)) ||
      (await resolveLiveCdpPort(port)) != null
    if (live && (state.status === 'running' || state.status === 'starting')) {
      const resolved = (await isCdpReachable(port))
        ? port
        : await resolveLiveCdpPort(port)
      setState({
        status: 'connected',
        debuggingPort: resolved || port,
        lastError: null
      })
    } else if (!live && state.status === 'connected') {
      // If app still running without CDP, keep "running" rather than stopped
      const running = await findRunningCodexApps()
      if (running.pids.length > 0) {
        setState({
          status: 'running',
          pid: running.pids[0] ?? state.pid,
          lastError:
            'CDP 连接已断开。若应用仍在运行，请点击「启动」以附加或重启并开启调试端口。'
        })
      } else {
        setState({
          status: 'stopped',
          pid: null,
          lastError: null,
          activePresetId: null
        })
        stopHealthCheck()
      }
    }
  }, 3000)
}

function stopHealthCheck(): void {
  if (healthTimer) {
    clearInterval(healthTimer)
    healthTimer = null
  }
}

export async function stopCodex(): Promise<CodexRuntimeState> {
  stopHealthCheck()
  const port = state.debuggingPort

  if (child && !child.killed) {
    try {
      if (platform() !== 'win32' && child.pid) {
        try {
          process.kill(-child.pid, 'SIGTERM')
        } catch {
          child.kill('SIGTERM')
        }
      } else {
        child.kill()
      }
    } catch {
      // ignore
    }
  }

  // Always try to quit external ChatGPT/Codex when user asks to stop
  try {
    await quitRunningCodexApps()
  } catch {
    // ignore
  }

  if (platform() === 'darwin' && port) {
    try {
      spawn('pkill', ['-f', `remote-debugging-port=${port}`], {
        stdio: 'ignore'
      })
    } catch {
      // ignore
    }
  }

  child = null
  launchedPid = null
  attachedExternally = false
  setState({
    status: 'stopped',
    pid: null,
    debuggingPort: null,
    activePresetId: null,
    injectedAt: null,
    lastError: null
  })
  return getCodexState()
}

export async function applyTheme(
  presetId: string | null | undefined
): Promise<InjectResult> {
  const id = presetId || getSettings().lastPresetId || THEME_PRESETS[0].id
  const preset = resolveTheme(id)
  if (!preset) {
    return { ok: false, message: `未知主题：${id}` }
  }

  // Prefer live discovery so pre-running sessions still inject
  let port = state.debuggingPort || getSettings().debuggingPort
  if (!(await isCdpReachable(port))) {
    const discovered = await resolveLiveCdpPort(port)
    if (discovered) {
      port = discovered
      setState({ debuggingPort: port, status: 'connected' })
      setSettings({ debuggingPort: port })
      startHealthCheck(port)
    }
  }

  if (!(await isCdpReachable(port))) {
    const running = await findRunningCodexApps()
    if (running.pids.length > 0) {
      return {
        ok: false,
        message:
          'ChatGPT / Codex 已在运行，但未开启 CDP 调试端口。请点击「启动 Codex」——将自动退出并以调试模式重启，然后即可注入。'
      }
    }
    return {
      ok: false,
      message:
        'CDP 不可达。请先通过本应用启动 ChatGPT / Codex（以开启远程调试端口）。'
    }
  }

  setState({ status: 'injecting', lastError: null, debuggingPort: port })

  try {
    const result = await injectTheme(port, preset, getGlobalCustomCss())
    if (result.ok) {
      setSettings({ lastPresetId: preset.id })
      setState({
        status: 'connected',
        activePresetId: preset.id,
        injectedAt: new Date().toISOString(),
        lastError: null
      })
      return { ok: true, message: result.message, presetId: preset.id }
    }
    setState({
      status: 'connected',
      lastError: result.message
    })
    return { ok: false, message: result.message, presetId: preset.id }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    setState({ status: 'error', lastError: message })
    return { ok: false, message }
  }
}

export async function previewTheme(presetId: string): Promise<InjectResult> {
  return applyTheme(presetId)
}

export async function resetInjectedTheme(): Promise<InjectResult> {
  let port = state.debuggingPort || getSettings().debuggingPort
  if (!(await isCdpReachable(port))) {
    const discovered = await resolveLiveCdpPort(port)
    if (discovered) port = discovered
  }
  if (!(await isCdpReachable(port))) {
    return { ok: false, message: 'CDP 不可达。' }
  }
  try {
    const result = await resetTheme(port)
    if (result.ok) {
      setState({
        activePresetId: null,
        injectedAt: null,
        status: 'connected',
        debuggingPort: port,
        lastError: null
      })
    }
    return { ok: result.ok, message: result.message }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return { ok: false, message }
  }
}

/**
 * Probe environment: existing CDP, running processes, path.
 * Called on app boot and "刷新状态".
 */
export async function refreshStatus(): Promise<CodexRuntimeState> {
  const settings = getSettings()
  const preferred = settings.debuggingPort || DEFAULT_DEBUGGING_PORT

  // 1) Live CDP anywhere we know
  const livePort = await resolveLiveCdpPort(preferred)
  if (livePort) {
    const running = await findRunningCodexApps()
    let execPath = state.executablePath || settings.codexPath
    try {
      const info = await ensurePath(settings.codexPath)
      execPath = info.appBundle || info.executable
    } catch {
      // keep previous
    }
    attachedExternally = !child
    setState({
      status: 'connected',
      debuggingPort: livePort,
      pid: running.pids[0] ?? state.pid,
      executablePath: execPath,
      lastError: null
    })
    if (livePort !== settings.debuggingPort) {
      setSettings({ debuggingPort: livePort })
    }
    startHealthCheck(livePort)
    return getCodexState()
  }

  // 2) Process running but no CDP
  const running = await findRunningCodexApps()
  if (running.pids.length > 0) {
    setState({
      status: 'running',
      pid: running.pids[0] ?? null,
      debuggingPort: preferred,
      lastError:
        '检测到 ChatGPT / Codex 已在运行，但未开启远程调试。点击「启动 Codex」将自动重启并开启 CDP。'
    })
    return getCodexState()
  }

  // 3) Nothing running
  if (state.status !== 'starting' && state.status !== 'injecting') {
    setState({
      status: 'stopped',
      pid: null,
      debuggingPort: null,
      lastError: null
    })
  }
  return getCodexState()
}

