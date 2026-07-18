#!/usr/bin/env node
/**
 * Ensures the Electron binary is fully extracted and path.txt is valid.
 * Works around incomplete postinstall extractions (common with extract-zip
 * under newer Node versions / interrupted installs).
 */
const { execFileSync, spawnSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const electronDir = path.join(__dirname, '..', 'node_modules', 'electron')
const packageJsonPath = path.join(electronDir, 'package.json')

if (!fs.existsSync(packageJsonPath)) {
  console.warn('[ensure-electron] electron package not installed yet, skip')
  process.exit(0)
}

const { version } = require(packageJsonPath)
const distDir = path.join(electronDir, 'dist')
const pathTxt = path.join(electronDir, 'path.txt')

function platformPath() {
  const platform = process.env.npm_config_platform || process.platform
  switch (platform) {
    case 'darwin':
      return 'Electron.app/Contents/MacOS/Electron'
    case 'win32':
      return 'electron.exe'
    default:
      return 'electron'
  }
}

function binaryPath() {
  return path.join(distDir, platformPath())
}

function isHealthy() {
  try {
    const bin = binaryPath()
    if (!fs.existsSync(bin)) return false
    const st = fs.statSync(bin)
    if (!st.isFile() || st.size < 10_000) return false

    // Framework payload should make dist large on macOS / Linux
    const versionFile = path.join(distDir, 'version')
    if (!fs.existsSync(versionFile)) return false
    const v = fs.readFileSync(versionFile, 'utf8').replace(/^v/, '').trim()
    if (v !== version) return false

    if (!fs.existsSync(pathTxt)) return false
    const recorded = fs.readFileSync(pathTxt, 'utf8').replace(/\r?\n$/, '')
    if (recorded !== platformPath()) return false

    // Spot-check: full electron dist is typically > 50MB
    const du = spawnSync('du', ['-sk', distDir], { encoding: 'utf8' })
    if (du.status === 0) {
      const kb = parseInt(du.stdout.trim().split(/\s+/)[0], 10)
      if (Number.isFinite(kb) && kb < 40_000) return false
    }
    return true
  } catch {
    return false
  }
}

function writePathTxt() {
  fs.writeFileSync(pathTxt, platformPath())
}

function findCachedZip() {
  const cacheRoot =
    process.env.electron_config_cache ||
    path.join(os.homedir(), 'Library', 'Caches', 'electron')
  if (!fs.existsSync(cacheRoot)) return null

  const platform = process.env.npm_config_platform || process.platform
  const arch = process.env.npm_config_arch || process.arch
  const name = `electron-v${version}-${platform}-${arch}.zip`

  /** @type {string[]} */
  const matches = []
  const walk = (dir, depth = 0) => {
    if (depth > 3) return
    let entries
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) walk(full, depth + 1)
      else if (ent.name === name) matches.push(full)
    }
  }
  walk(cacheRoot)
  // Prefer largest (complete) zip
  matches.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size)
  return matches[0] || null
}

function extractWithSystemUnzip(zipPath) {
  fs.rmSync(distDir, { recursive: true, force: true })
  fs.mkdirSync(distDir, { recursive: true })
  console.log(`[ensure-electron] extracting with unzip: ${zipPath}`)
  execFileSync('unzip', ['-o', zipPath, '-d', distDir], {
    stdio: 'inherit'
  })
  writePathTxt()
}

function runOfficialInstall() {
  console.log('[ensure-electron] running electron/install.js …')
  const installJs = path.join(electronDir, 'install.js')
  execFileSync(process.execPath, [installJs], {
    stdio: 'inherit',
    env: {
      ...process.env,
      force_no_cache: process.env.force_no_cache || 'false'
    },
    cwd: electronDir
  })
}

function main() {
  if (isHealthy()) {
    // Normalize path.txt (strip accidental trailing newline)
    writePathTxt()
    console.log('[ensure-electron] electron binary ok →', binaryPath())
    return
  }

  console.warn('[ensure-electron] electron binary incomplete or missing, repairing…')

  // Prefer official installer first (downloads if needed)
  try {
    // Clear broken dist so isInstalled() returns false
    fs.rmSync(distDir, { recursive: true, force: true })
    fs.rmSync(pathTxt, { force: true })
    runOfficialInstall()
  } catch (e) {
    console.warn('[ensure-electron] official install failed:', e.message)
  }

  if (isHealthy()) {
    writePathTxt()
    console.log('[ensure-electron] repaired via install.js →', binaryPath())
    return
  }

  // Fallback: system unzip of cached artifact
  const zip = findCachedZip()
  if (zip) {
    try {
      extractWithSystemUnzip(zip)
    } catch (e) {
      console.error('[ensure-electron] unzip fallback failed:', e.message)
    }
  }

  if (isHealthy()) {
    writePathTxt()
    console.log('[ensure-electron] repaired via unzip →', binaryPath())
    return
  }

  // Last resort: force re-download without cache
  try {
    fs.rmSync(distDir, { recursive: true, force: true })
    fs.rmSync(pathTxt, { force: true })
    execFileSync(process.execPath, [path.join(electronDir, 'install.js')], {
      stdio: 'inherit',
      env: { ...process.env, force_no_cache: 'true' },
      cwd: electronDir
    })
    writePathTxt()
  } catch (e) {
    console.error('[ensure-electron] force re-download failed:', e.message)
  }

  if (!isHealthy()) {
    console.error(
      '[ensure-electron] FAILED. Try:\n' +
        '  rm -rf node_modules/electron ~/Library/Caches/electron\n' +
        '  npm install electron --foreground-scripts'
    )
    process.exit(1)
  }

  console.log('[ensure-electron] electron ready →', binaryPath())
}

main()
