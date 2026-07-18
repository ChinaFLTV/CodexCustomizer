import { existsSync, readdirSync, readFileSync } from 'fs'
import { homedir, platform } from 'os'
import { join, normalize } from 'path'
import { execFile, execFileSync } from 'child_process'
import { promisify } from 'util'
import type { DetectPathResult } from '../shared/types'

const execFileAsync = promisify(execFile)

/** OpenAI desktop app bundle id (ChatGPT super-app / former Codex app) */
export const OPENAI_CODEX_BUNDLE_ID = 'com.openai.codex'

/**
 * Known install locations for ChatGPT / Codex desktop Electron apps.
 * OpenAI merged Codex into ChatGPT.app (bundle id remains com.openai.codex).
 */
function candidatePaths(): string[] {
  const home = homedir()
  const os = platform()

  if (os === 'darwin') {
    return [
      // New: Codex merged into ChatGPT desktop
      '/Applications/ChatGPT.app/Contents/MacOS/ChatGPT',
      '/Applications/ChatGPT.app',
      join(home, 'Applications/ChatGPT.app/Contents/MacOS/ChatGPT'),
      join(home, 'Applications/ChatGPT.app'),
      // Legacy / alternate Codex branding
      '/Applications/Codex.app/Contents/MacOS/Codex',
      '/Applications/Codex.app',
      join(home, 'Applications/Codex.app/Contents/MacOS/Codex'),
      join(home, 'Applications/Codex.app'),
      '/Applications/OpenAI Codex.app/Contents/MacOS/OpenAI Codex',
      '/Applications/OpenAI Codex.app',
      // Classic ChatGPT (pre-merge) may still exist
      '/Applications/ChatGPT (Classic).app',
      join(home, 'Applications/ChatGPT (Classic).app'),
      // CLI helpers
      join(home, '.local/bin/codex'),
      '/usr/local/bin/codex',
      '/opt/homebrew/bin/codex',
      join(home, '.nvm/current/bin/codex')
    ]
  }

  if (os === 'win32') {
    const local = process.env.LOCALAPPDATA || join(home, 'AppData', 'Local')
    const roaming = process.env.APPDATA || join(home, 'AppData', 'Roaming')
    const pf = process.env.ProgramFiles || 'C:\\Program Files'
    const pf86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)'
    return [
      join(local, 'Programs', 'ChatGPT', 'ChatGPT.exe'),
      join(local, 'Programs', 'chatgpt', 'ChatGPT.exe'),
      join(local, 'ChatGPT', 'ChatGPT.exe'),
      join(local, 'Programs', 'Codex', 'Codex.exe'),
      join(local, 'Codex', 'Codex.exe'),
      join(roaming, 'Codex', 'Codex.exe'),
      join(roaming, 'ChatGPT', 'ChatGPT.exe'),
      join(pf, 'ChatGPT', 'ChatGPT.exe'),
      join(pf, 'Codex', 'Codex.exe'),
      join(pf86, 'Codex', 'Codex.exe'),
      join(local, 'Programs', 'OpenAI Codex', 'OpenAI Codex.exe'),
      join(local, 'Programs', 'OpenAI', 'ChatGPT', 'ChatGPT.exe')
    ]
  }

  // linux / others
  return [
    join(home, '.local', 'bin', 'codex'),
    '/usr/local/bin/codex',
    '/usr/bin/codex',
    join(home, 'Applications', 'ChatGPT.AppImage'),
    join(home, 'Applications', 'Codex.AppImage'),
    '/opt/ChatGPT/chatgpt',
    '/opt/Codex/codex',
    join(home, '.codex', 'bin', 'codex')
  ]
}

async function whichBinary(name: string): Promise<string | null> {
  try {
    const cmd = platform() === 'win32' ? 'where' : 'which'
    const { stdout } = await execFileAsync(cmd, [name], {
      timeout: 3000,
      windowsHide: true
    })
    const first = stdout
      .split(/\r?\n/)
      .map((s) => s.trim())
      .find(Boolean)
    return first && existsSync(first) ? first : null
  } catch {
    return null
  }
}

/**
 * Spotlight / mdfind by Bundle ID — finds ChatGPT.app even when renamed.
 */
async function mdfindByBundleId(bundleId: string): Promise<string[]> {
  if (platform() !== 'darwin') return []
  try {
    const { stdout } = await execFileAsync(
      'mdfind',
      [`kMDItemCFBundleIdentifier == "${bundleId}"`],
      { timeout: 5000 }
    )
    return stdout
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((p) => p.endsWith('.app') && existsSync(p))
  } catch {
    return []
  }
}

/**
 * Also search by display / alternate names in case metadata lags.
 */
async function mdfindByNameHints(): Promise<string[]> {
  if (platform() !== 'darwin') return []
  const queries = [
    'kMDItemDisplayName == "ChatGPT"c && kMDItemContentType == "com.apple.application-bundle"',
    'kMDItemDisplayName == "Codex"c && kMDItemContentType == "com.apple.application-bundle"',
    'kMDItemFSName == "ChatGPT.app"',
    'kMDItemFSName == "Codex.app"'
  ]
  const found: string[] = []
  for (const q of queries) {
    try {
      const { stdout } = await execFileAsync('mdfind', [q], { timeout: 4000 })
      for (const line of stdout.split(/\r?\n/)) {
        const p = line.trim()
        if (p.endsWith('.app') && existsSync(p)) found.push(p)
      }
    } catch {
      // ignore individual query failures
    }
  }
  return found
}

function readBundleExecutable(appPath: string): string | null {
  try {
    const plistPath = join(appPath, 'Contents', 'Info.plist')
    if (!existsSync(plistPath)) return null
    // Prefer plutil for binary plists; fallback to naive text parse
    try {
      const stdout = execFileSync(
        'plutil',
        ['-extract', 'CFBundleExecutable', 'raw', '-o', '-', plistPath],
        { encoding: 'utf8', timeout: 2000 }
      )
      const name = String(stdout).trim()
      if (name) {
        const bin = join(appPath, 'Contents', 'MacOS', name)
        if (existsSync(bin)) return bin
      }
    } catch {
      const text = readFileSync(plistPath, 'utf8')
      const m = text.match(
        /<key>CFBundleExecutable<\/key>\s*<string>([^<]+)<\/string>/
      )
      if (m?.[1]) {
        const bin = join(appPath, 'Contents', 'MacOS', m[1])
        if (existsSync(bin)) return bin
      }
    }
  } catch {
    // ignore
  }
  return null
}

/**
 * Resolve the actual executable for macOS .app bundles.
 * Prefers CFBundleExecutable (ChatGPT / Codex / …).
 */
export function resolveExecutable(path: string): string {
  const normalized = normalize(path)
  if (platform() === 'darwin' && normalized.endsWith('.app')) {
    const fromPlist = readBundleExecutable(normalized)
    if (fromPlist) return fromPlist

    const macOSDir = join(normalized, 'Contents', 'MacOS')
    try {
      const entries = readdirSync(macOSDir).filter((e) => !e.startsWith('.'))
      // Prefer known product names
      const preferred = entries.find((e) =>
        /^(ChatGPT|Codex|OpenAI Codex)$/i.test(e)
      )
      if (preferred) return join(macOSDir, preferred)
      if (entries.length > 0) return join(macOSDir, entries[0])
    } catch {
      // fall through
    }
    return join(macOSDir, 'ChatGPT')
  }
  return normalized
}

/**
 * True if path looks like a usable ChatGPT/Codex binary or .app bundle.
 */
export function isLikelyCodexTarget(path: string): boolean {
  if (!existsSync(path)) return false
  if (path.endsWith('.app')) {
    return existsSync(join(path, 'Contents', 'MacOS'))
  }
  return true
}

export async function detectCodexPath(
  preferred: string | null
): Promise<DetectPathResult> {
  const candidates: string[] = []
  const seen = new Set<string>()

  const push = (p: string | null | undefined) => {
    if (!p) return
    const n = normalize(p)
    if (seen.has(n)) return
    seen.add(n)
    candidates.push(n)
  }

  push(preferred)
  for (const c of candidatePaths()) push(c)

  // PATH lookups
  for (const name of ['codex', 'chatgpt', 'ChatGPT']) {
    push(await whichBinary(name))
  }

  // Bundle ID + name discovery (macOS)
  for (const app of await mdfindByBundleId(OPENAI_CODEX_BUNDLE_ID)) {
    push(app)
    push(resolveExecutable(app))
  }
  for (const app of await mdfindByNameHints()) {
    // Prefer apps that look like OpenAI codex bundle when possible
    push(app)
    push(resolveExecutable(app))
  }

  for (const c of candidates) {
    if (!existsSync(c)) continue
    if (c.endsWith('.app')) {
      if (isLikelyCodexTarget(c)) return { path: c, candidates }
      continue
    }
    // Binary / executable path
    return { path: c, candidates }
  }

  return { path: null, candidates }
}
