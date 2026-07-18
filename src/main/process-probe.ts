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
 * Detect already-running ChatGPT / Codex *desktop product* processes.
 *
 * Important: do NOT treat this customizer as Codex. Paths like
 * `.../CodexCustomizer/...` match naive `pgrep -f Codex` and caused false
 * "running / 停止 Codex" when only the customizer was open.
 */
export async function findRunningCodexApps(): Promise<RunningAppInfo> {
  const os = platform()
  const pids = new Set<number>()
  const debugPorts = new Set<number>()
  const names = new Set<string>()

  const accept = (pid: number, cmd: string) => {
    if (!Number.isFinite(pid) || pid <= 0) return
    if (!cmd || isOwnCustomizerCommand(cmd)) return
    if (!isCodexProductCommand(cmd)) return
    pids.add(pid)
    names.add(guessAppName(cmd))
    const port = extractDebugPort(cmd)
    if (port) debugPorts.add(port)
  }

  if (os === 'darwin' || os === 'linux') {
    try {
      const { stdout } = await execFileAsync(
        'ps',
        ['-ax', '-o', 'pid=,command='],
        { timeout: 5000, maxBuffer: 8 * 1024 * 1024 }
      )
      for (const line of stdout.split(/\r?\n/)) {
        const m = line.trim().match(/^(\d+)\s+(.+)$/)
        if (!m) continue
        accept(Number(m[1]), m[2])
      }
    } catch {
      // ignore
    }

    // pgrep only as candidate source — always re-validate full command line
    for (const pattern of [
      'ChatGPT.app',
      'Codex.app',
      'com.openai.codex',
      'MacOS/ChatGPT',
      'MacOS/Codex',
      'ChatGPT.exe',
      'Codex.exe'
    ]) {
      try {
        const { stdout } = await execFileAsync('pgrep', ['-f', pattern], {
          timeout: 3000
        })
        for (const s of stdout.split(/\r?\n/)) {
          const pid = Number(s.trim())
          if (!Number.isFinite(pid) || pid <= 0) continue
          if (pids.has(pid)) continue
          const cmd = await commandForPid(pid)
          if (cmd) accept(pid, cmd)
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
          `Get-CimInstance Win32_Process | Where-Object {
            $_.Name -match '^(ChatGPT|Codex)\\.exe$' -or
            ($_.CommandLine -and (
              $_.CommandLine -match 'ChatGPT\\.app|Codex\\.app|openai\\.codex|\\\\ChatGPT\\.exe|\\\\Codex\\.exe'
            ))
          } | Select-Object ProcessId,Name,CommandLine | ConvertTo-Json -Compress`
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
          const cmd = `${row.Name || ''} ${row.CommandLine || ''}`
          accept(Number(row.ProcessId), cmd)
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

/** This customizer / its Electron helpers / build tooling — never "Codex product". */
export function isOwnCustomizerCommand(cmd: string): boolean {
  const c = cmd.toLowerCase()
  if (c.includes('codexcustomizer')) return true
  if (c.includes('codex-customizer')) return true
  if (c.includes('codex_customizer')) return true
  if (c.includes('electron-vite')) return true
  // Electron userData for this app
  if (c.includes('application support/codex-customizer')) return true
  if (c.includes('appdata\\roaming\\codex-customizer')) return true
  if (c.includes('appdata\\local\\codex-customizer')) return true
  // Packaged customizer binary name
  if (/\/codex customizer\.app\//i.test(cmd)) return true
  if (/\\codex customizer\\/i.test(cmd)) return true
  return false
}

/**
 * True only for OpenAI ChatGPT / Codex *desktop product* processes.
 * Intentionally strict: "Codex" substring alone is NOT enough.
 */
export function isCodexProductCommand(cmd: string): boolean {
  if (!cmd || isOwnCustomizerCommand(cmd)) return false

  // Explicit product bundles / installers
  if (/ChatGPT\.app\//i.test(cmd)) return true
  if (/Codex\.app\//i.test(cmd)) return true
  if (/com\.openai\.codex/i.test(cmd)) return true
  if (/[/\\]ChatGPT\.exe\b/i.test(cmd)) return true
  if (/[/\\]Codex\.exe\b/i.test(cmd)) return true

  // Main binary path inside app bundle
  if (/Contents\/MacOS\/ChatGPT\b/i.test(cmd)) return true
  if (/Contents\/MacOS\/Codex\b/i.test(cmd)) return true

  // Helpers only if clearly under product framework (not our Electron helpers)
  if (
    /ChatGPT\.app\/.*Helper/i.test(cmd) ||
    /Codex\.app\/.*Helper/i.test(cmd) ||
    /Codex Framework\.framework/i.test(cmd)
  ) {
    return true
  }

  // OpenAI product user-data dir (not our codex-customizer dir)
  if (
    /Application Support\/(?:Codex|ChatGPT)\b/i.test(cmd) &&
    !/codex-customizer/i.test(cmd) &&
    (/ChatGPT|Codex Framework|openai/i.test(cmd) ||
      /Contents\/MacOS\//i.test(cmd))
  ) {
    // Require product binary marker to avoid random tools writing that folder
    if (
      /MacOS\/(?:ChatGPT|Codex)\b/i.test(cmd) ||
      /ChatGPT\.app|Codex\.app|Codex Framework/i.test(cmd)
    ) {
      return true
    }
  }

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

async function commandForPid(pid: number): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync(
      'ps',
      ['-p', String(pid), '-o', 'command='],
      { timeout: 2000 }
    )
    const cmd = stdout.trim()
    return cmd || null
  } catch {
    return null
  }
}

/**
 * Probe a list of ports for a live CDP endpoint.
 * Only return ports that look like the OpenAI product when processes are known;
 * bare port reachability alone can false-positive on leftover listeners.
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

  const running = await findRunningCodexApps()
  const productAlive = running.pids.length > 0

  const batchSize = 6
  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize)
    const results = await Promise.all(
      batch.map(async (port) => ((await isCdpReachable(port)) ? port : null)
      )
    )
    const hit = results.find((p) => p != null)
    if (hit == null) continue

    // If we know product processes, accept any open CDP (port may be on renderer).
    // If NO product process is alive, do not claim "connected" just because
    // some random service answers on a common debug port.
    if (productAlive || running.debugPorts.includes(hit) || extra.includes(hit)) {
      return hit
    }
    // Prefer preferred port only when product cmdline advertised it
    if (hit === preferred && running.debugPorts.includes(preferred)) {
      return hit
    }
  }

  // Last resort: if product is running and preferred CDP is up, use it
  if (productAlive && (await isCdpReachable(preferred))) {
    return preferred
  }
  // If product running and any of its cmdline ports is up
  for (const p of running.debugPorts) {
    if (await isCdpReachable(p)) return p
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
    await sleep(600)
    // Only kill verified product PIDs — never killall by bare name if unsure
    for (const pid of running.pids) {
      try {
        process.kill(pid, 'SIGTERM')
      } catch {
        // ignore
      }
    }
    await sleep(400)
    for (const pid of running.pids) {
      try {
        process.kill(pid, 'SIGKILL')
      } catch {
        // ignore
      }
    }
  } else if (os === 'win32') {
    for (const pid of running.pids) {
      try {
        await execFileAsync('taskkill', ['/PID', String(pid), '/T', '/F'], {
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

  const deadline = Date.now() + 8000
  while (Date.now() < deadline) {
    const still = await findRunningCodexApps()
    if (still.pids.length === 0) break
    await sleep(350)
  }
  await sleep(400)
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
