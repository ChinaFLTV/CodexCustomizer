import { execFile } from 'child_process'
import { promisify } from 'util'
import { platform } from 'os'
import { isCdpReachable } from './cdp-injector'

const execFileAsync = promisify(execFile)

export interface RunningAppInfo {
  pids: number[]
  /** remote-debugging-port values found on process command lines */
  debugPorts: number[]
  names: string[]
}

/**
 * Detect already-running ChatGPT / Codex desktop processes.
 */
export async function findRunningCodexApps(): Promise<RunningAppInfo> {
  const os = platform()
  const pids = new Set<number>()
  const debugPorts = new Set<number>()
  const names = new Set<string>()

  if (os === 'darwin' || os === 'linux') {
    // Broad process list — filter by known product names / paths
    try {
      const { stdout } = await execFileAsync(
        'ps',
        ['-ax', '-o', 'pid=,command='],
        { timeout: 5000, maxBuffer: 8 * 1024 * 1024 }
      )
      for (const line of stdout.split(/\r?\n/)) {
        const m = line.trim().match(/^(\d+)\s+(.+)$/)
        if (!m) continue
        const pid = Number(m[1])
        const cmd = m[2]
        if (!isCodexRelatedCommand(cmd)) continue
        // Skip our customizer / helpers
        if (/codex-customizer|CodexCustomizer|electron-vite/i.test(cmd)) continue
        pids.add(pid)
        names.add(guessAppName(cmd))
        const port = extractDebugPort(cmd)
        if (port) debugPorts.add(port)
      }
    } catch {
      // ignore
    }

    // pgrep fallbacks
    for (const pattern of ['ChatGPT', 'Codex', 'com.openai.codex']) {
      try {
        const { stdout } = await execFileAsync('pgrep', ['-f', pattern], {
          timeout: 3000
        })
        for (const s of stdout.split(/\r?\n/)) {
          const pid = Number(s.trim())
          if (Number.isFinite(pid) && pid > 0) pids.add(pid)
        }
      } catch {
        // no matches
      }
    }
  } else if (os === 'win32') {
    try {
      const { stdout } = await execFileAsync(
        'powershell',
        [
          '-NoProfile',
          '-Command',
          `Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'ChatGPT|Codex' -or $_.CommandLine -match 'openai.codex|ChatGPT|Codex' } | Select-Object ProcessId,Name,CommandLine | ConvertTo-Json -Compress`
        ],
        { timeout: 8000, windowsHide: true, maxBuffer: 4 * 1024 * 1024 }
      )
      const raw = stdout.trim()
      if (raw) {
        const data = JSON.parse(raw) as
          | { ProcessId: number; Name: string; CommandLine?: string }
          | Array<{ ProcessId: number; Name: string; CommandLine?: string }>
        const list = Array.isArray(data) ? data : [data]
        for (const row of list) {
          if (!row?.ProcessId) continue
          pids.add(Number(row.ProcessId))
          if (row.Name) names.add(row.Name)
          const port = extractDebugPort(row.CommandLine || '')
          if (port) debugPorts.add(port)
        }
      }
    } catch {
      // ignore
    }
  }

  return {
    pids: Array.from(pids),
    debugPorts: Array.from(debugPorts),
    names: Array.from(names)
  }
}

function isCodexRelatedCommand(cmd: string): boolean {
  const c = cmd.toLowerCase()
  // Prefer app bundle / product binaries; avoid generic "codex" CLI noise when possible
  if (c.includes('chatgpt.app') || c.includes('/chatgpt ')) return true
  if (c.includes('codex.app') || c.includes('openai.codex')) return true
  if (c.includes('chatgpt.exe') || c.includes('codex.exe')) return true
  // Electron helper of the product
  if (c.includes('chatgpt helper') || c.includes('codex helper')) return true
  // Main process often ends with MacOS/ChatGPT
  if (/contents\/macos\/chatgpt/i.test(cmd)) return true
  if (/contents\/macos\/codex/i.test(cmd)) return true
  return false
}

function guessAppName(cmd: string): string {
  if (/ChatGPT/i.test(cmd)) return 'ChatGPT'
  if (/Codex/i.test(cmd)) return 'Codex'
  return 'OpenAI Desktop'
}

function extractDebugPort(cmd: string): number | null {
  const m = cmd.match(/--remote-debugging-port(?:=|\s+)(\d{2,5})/i)
  if (!m) return null
  const port = Number(m[1])
  if (port >= 1024 && port <= 65535) return port
  return null
}

/**
 * Probe a list of ports for a live CDP endpoint.
 */
export async function findOpenCdpPort(
  preferred: number,
  extra: number[] = []
): Promise<number | null> {
  const candidates: number[] = []
  const push = (p: number) => {
    if (p >= 1024 && p <= 65535 && !candidates.includes(p)) candidates.push(p)
  }

  push(preferred)
  for (const p of extra) push(p)

  // Common defaults used by tooling / previous sessions
  for (const p of [
    preferred,
    9222,
    9229,
    9333,
    9334,
    9455,
    9876,
    preferred + 1,
    preferred + 2
  ]) {
    push(p)
  }

  // Parallel-ish batches to keep it snappy
  const batchSize = 6
  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize)
    const results = await Promise.all(
      batch.map(async (port) => ((await isCdpReachable(port)) ? port : null))
    )
    const hit = results.find((p) => p != null)
    if (hit != null) return hit
  }
  return null
}

/**
 * Gracefully quit ChatGPT / Codex so we can relaunch with CDP flags.
 * Single-instance Electron apps ignore --args on a second open otherwise.
 */
export async function quitRunningCodexApps(
  info?: RunningAppInfo
): Promise<void> {
  const os = platform()
  const running = info || (await findRunningCodexApps())

  if (os === 'darwin') {
    for (const name of ['ChatGPT', 'Codex', 'OpenAI Codex']) {
      try {
        await execFileAsync(
          'osascript',
          ['-e', `tell application "${name}" to quit`],
          { timeout: 5000 }
        )
      } catch {
        // app may not be running under that name
      }
    }
    // Force leftovers that didn't quit
    await sleep(600)
    for (const name of ['ChatGPT', 'Codex']) {
      try {
        await execFileAsync('killall', [name], { timeout: 3000 })
      } catch {
        // none
      }
    }
  } else if (os === 'win32') {
    for (const image of ['ChatGPT.exe', 'Codex.exe']) {
      try {
        await execFileAsync('taskkill', ['/IM', image, '/F'], {
          timeout: 5000,
          windowsHide: true
        })
      } catch {
        // none
      }
    }
  } else {
    for (const pid of running.pids) {
      try {
        process.kill(pid, 'SIGTERM')
      } catch {
        // ignore
      }
    }
  }

  // Wait until processes are mostly gone
  const deadline = Date.now() + 8000
  while (Date.now() < deadline) {
    const still = await findRunningCodexApps()
    // helpers may linger briefly; main MacOS binary is enough signal
    const mainAlive = still.pids.length > 0 && still.names.length > 0
    if (!mainAlive || still.pids.length === 0) break
    // If only helpers without ChatGPT name, break
    if (!still.names.some((n) => /ChatGPT|Codex/i.test(n))) break
    await sleep(350)
  }
  await sleep(400)
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
